use std::sync::mpsc;

use kvarn::prelude::*;

use bytes::BufMut;
use extensions::RetSyncFut;
use internals::mime;
use kvarn::websocket::{SinkExt, StreamExt};

#[allow(clippy::await_holding_lock)] // we sort of have to
fn main() {
    tokio_uring::start(async {
        let mut custom = moella::config::CustomExtensions::empty();
        let (agde_channel, agde_rx) = mpsc::sync_channel(4);
        custom.insert("Ip", ip);
        custom.insert("WsPing", ws_ping);
        custom.insert_without_data_or_config_dir("Dns", dns);
        custom.insert_without_data_or_config_dir("QuizletLearn", quizlet);
        custom.insert_without_data_or_config_dir("Agde", agde(agde_channel));
        //custom.insert("UploadAuthSimple", kvarn_upload::moella_upload_auth_simple);
        custom.insert("Klimatgrupper", klimatgrupper_backend::moella_extensions);

        let sh = moella::run(&custom).await;

        let agdes: Vec<_> = agde_rx.try_iter().collect();

        let pre = sh.wait_for_pre_shutdown().await;

        for agde_handle in agdes {
            info!("Start agde shutdown.");
            if let Some(handle) = &mut *agde_handle.lock().unwrap() {
                let mut manager = handle.manager.lock().await;
                info!("Shutting agde down.");
                if let Err(err) =
                    agde_tokio::shutdown(&mut manager, &handle.options, &handle.platform, handle)
                        .await
                {
                    error!("Got error when shutting agde down: {err:?}");
                }
            };
        }

        pre.send(()).unwrap();
        sh.wait().await;
    });
}

fn ip(extensions: &mut Extensions, path: String, _: PathBuf) -> RetSyncFut<Result<(), String>> {
    extensions.add_prepare_single(
        path,
        prepare!(_req, _, _, addr, {
            FatResponse::no_cache(Response::new(addr.ip().to_string().into()))
                .with_compress(comprash::CompressPreference::None)
                .with_content_type(&mime::TEXT_PLAIN)
        }),
    );
    Box::pin(async { Ok(()) })
}
fn ws_ping(
    extensions: &mut Extensions,
    path: String,
    _: PathBuf,
) -> RetSyncFut<Result<(), String>> {
    extensions.add_prepare_single(
        path,
        prepare!(req, host, _path, _addr, {
            kvarn::websocket::response(
                req,
                host,
                response_pipe_fut!(response_pipe, _host, {
                    if let Ok(mut ws) = kvarn::websocket::wrap(response_pipe).await {
                        while let Some(Ok(message)) = ws.next().await {
                            let _ = ws.send(message).await;
                        }
                    }
                }),
            )
            .await
        }),
    );
    Box::pin(async { Ok(()) })
}
fn dns(extensions: &mut Extensions) -> RetSyncFut<Result<(), String>> {
    let mut resolver_opts = trust_dns_resolver::config::ResolverOpts::default();
    resolver_opts.cache_size = 0;
    resolver_opts.validate = false;
    resolver_opts.timeout = Duration::from_millis(1000);

    let mut resolver_config = trust_dns_resolver::config::ResolverConfig::new();
    resolver_config.add_name_server(trust_dns_resolver::config::NameServerConfig {
        socket_addr: SocketAddr::V4(net::SocketAddrV4::new(net::Ipv4Addr::LOCALHOST, 53)),
        protocol: trust_dns_resolver::config::Protocol::Udp,
        tls_dns_name: None,
        trust_nx_responses: true,
        tls_config: None,
        bind_addr: None,
    });
    let resolver = trust_dns_resolver::AsyncResolver::tokio(resolver_config, resolver_opts)
        .expect("Failed to create a resolver");

    extensions.add_prepare_single(
        "/dns/lookup",
        prepare!(
            req,
            host,
            _path,
            _addr,
            move |resolver: trust_dns_resolver::TokioAsyncResolver| {
                let queries = utils::parse::query(req.uri().query().unwrap_or(""));
                let body = if let Some(domain) = queries.get("domain") {
                    let mut body = Arc::new(Mutex::new(BytesMut::with_capacity(64)));

                    macro_rules! append_body {
                        ($result: expr, $kind: expr, $mod_name: ident, $modification: expr) => {{
                            let body = Arc::clone(&body);
                            let future = async move {
                                let future = $result;
                                if let Ok(lookup) = future.await {
                                    let mut lock = body.lock().await;
                                    for $mod_name in lookup.iter() {
                                        let record = $modification;
                                        lock.extend_from_slice(
                                            format!("{} {}\n", $kind, record).as_bytes(),
                                        );
                                    }
                                }
                            };
                            future
                        }};
                        ($result: expr, $kind: expr) => {{
                            append_body!($result, $kind, v, v)
                        }};
                    }

                    let a = append_body!(resolver.ipv4_lookup(domain.value()), "A");
                    let aaaa = append_body!(resolver.ipv6_lookup(domain.value()), "AAAA");
                    let cname = append_body!(
                        resolver.lookup(
                            domain.value(),
                            trust_dns_resolver::proto::rr::RecordType::CNAME,
                        ),
                        "CNAME"
                    );
                    let mx =
                        append_body!(resolver.mx_lookup(domain.value()), "MX", mx, mx.exchange());
                    let txt = append_body!(resolver.txt_lookup(domain.value()), "TXT");

                    futures_util::join!(a, aaaa, cname, mx, txt);

                    let body = std::mem::take(Arc::get_mut(&mut body).unwrap());
                    body.into_inner().freeze()
                } else {
                    return default_error_response(
                        StatusCode::BAD_REQUEST,
                        host,
                        Some("there must be a `domain` key-value pair in the query"),
                    )
                    .await;
                };

                if body.is_empty() {
                    return default_error_response(
                        StatusCode::NOT_FOUND,
                        host,
                        Some("no DNS entry was found"),
                    )
                    .await;
                }

                FatResponse::no_cache(Response::new(body))
                    .with_compress(comprash::CompressPreference::None)
                    .with_content_type(&mime::TEXT_PLAIN)
            }
        ),
    );

    extensions.add_prepare_single(
        "/dns/check-dns-over-tls",
        prepare!(req, host, _, _, {
                let queries = utils::parse::query(req.uri().query().unwrap_or(""));

                let result = if let (Some(ip), Some(name)) = (queries.get("ip"), queries.get("name")) {
                    let ip = if let Ok(ip) = ip.value().parse() {
                        ip
                    } else {
                        return default_error_response(StatusCode::BAD_REQUEST, host, Some("the value isn't a valid IP address")).await;
                    };

                    let resolver_config = trust_dns_resolver::config::ResolverConfig::from_parts(
                        None,
                        vec![],
                        trust_dns_resolver::config::NameServerConfigGroup::from_ips_tls(
                            &[ip],
                            853,
                            name.value().into(),
                            false,
                        ),
                    );
                    let mut resolver_opts = trust_dns_resolver::config::ResolverOpts::default();
                    resolver_opts.timeout = Duration::from_secs_f64(2.);
                    resolver_opts.validate = false;
                    if let Ok(resolver) = trust_dns_resolver::AsyncResolver::tokio(
                        resolver_config,
                        resolver_opts
                    ) {
                        let query = queries.get("lookup-name").map(utils::parse::QueryPair::value).unwrap_or("icelk.dev.");
                        let future = resolver.ipv4_lookup(query);
                        let result = tokio::time::timeout(Duration::from_secs(5), future)
                            .await.map_err(|_|()).and_then(|e|e.map_err(|_|()));
                        if result.is_ok() {
                            "supported"
                        } else {
                            "unsupported"
                        }
                    } else {
                        return default_error_response(StatusCode::INTERNAL_SERVER_ERROR, host, Some("Creation of resolver failed.")).await;
                    }
                } else {
                    return default_error_response(
                        StatusCode::BAD_REQUEST,
                        host,
                        Some("there must be a `ip` key with a IP address as the value and a `name` with the corresponding host name as the value.\
                             It can have a `query-name` to specify which host name to test the look up with.")
                    )
                    .await;
                };

                FatResponse::no_cache(Response::new(result.into()))
                    .with_compress(comprash::CompressPreference::None)
                    .with_content_type(&mime::TEXT_PLAIN)
        }),
    );
    Box::pin(async { Ok(()) })
}
fn quizlet(extensions: &mut Extensions) -> RetSyncFut<Result<(), String>> {
    Box::pin(async move {
        extensions.add_prepare_single(
            "/quizlet-learn/words",
            prepare!(req, host, _path, _addr, {
                let response = if let Some(uri) =
                    utils::parse::query(req.uri().query().unwrap_or("")).get("quizlet")
                {
                    let uri = uri.value().parse::<Uri>().ok().and_then(|uri| {
                        if uri.host().map_or(false, |domain| domain != "quizlet.com") {
                            None
                        } else {
                            Some(uri)
                        }
                    });
                    if let Some(uri) = uri {
                        let body = tokio::task::spawn_blocking(move || {
                            let mut request = ureq::request("GET", &uri.to_string());
                            // bypass bot filter xD
                            request = request.set(
                                "user-agent",
                                "Mozilla/5.0 (Windows NT 10.0; rv:91.0) \
                                        Gecko/20100101 Firefox/91.0",
                            );
                            if let Ok(response) = request.call() {
                                response.into_string().ok()
                            } else {
                                None
                            }
                            // this thread maybe panics if quizlet is down?
                        })
                        .await
                        .ok()
                        .flatten();
                        let body = if let Some(body) = body {
                            body
                        } else {
                            return default_error_response(StatusCode::BAD_GATEWAY, host, None)
                                .await;
                        };

                        let document = select::document::Document::from(body.as_str());
                        let elements =
                            document.find(select::predicate::Class("SetPageTerm-contentWrapper"));

                        let mut bytes = BytesMut::new();
                        for node in elements {
                            let (l1, l2) = if let Some(l) =
                                node.children().next().and_then(|child| {
                                    let mut c = child.children();
                                    Some((c.next()?, c.next()?))
                                }) {
                                l
                            } else {
                                continue;
                            };
                            let mut t1s = l1.descendants().filter_map(|n| n.as_text()).peekable();
                            while let Some(t1) = t1s.next() {
                                for text_seg in t1.split(|c: char| c == '\n' || c == '|') {
                                    bytes.extend_from_slice(text_seg.as_bytes());
                                    bytes.put_u8(b' ');
                                }

                                if t1s.peek().is_some() {
                                    bytes.put_u8(b'|');
                                }
                            }
                            bytes.put_u8(b'\n');
                            let mut t2s = l2.descendants().filter_map(|n| n.as_text()).peekable();
                            while let Some(t2) = t2s.next() {
                                for text_seg in t2.split(|c: char| c == '\n' || c == '|') {
                                    bytes.extend_from_slice(text_seg.as_bytes());
                                    bytes.put_u8(b' ');
                                }

                                if t2s.peek().is_some() {
                                    bytes.put_u8(b'|');
                                }
                            }
                            bytes.put_u8(b'\n');
                        }

                        Response::new(bytes.freeze())
                        // fetch
                    } else {
                        return default_error_response(
                            StatusCode::BAD_REQUEST,
                            host,
                            Some(
                                "the quizlet query parameter \
                                        couldn't be converted into an URI.",
                            ),
                        )
                        .await;
                    }
                } else {
                    return default_error_response(
                        StatusCode::BAD_REQUEST,
                        host,
                        Some("the quizlet query parameter is required"),
                    )
                    .await;
                };
                FatResponse::no_cache(response).with_content_type(&internals::mime::TEXT_PLAIN)
            }),
        );
        Ok(())
    })
}

async fn handle_ws<
    S: futures_util::Stream<
            Item = agde_tokio::tungstenite::Result<agde_tokio::tungstenite::Message>,
        > + futures_util::Sink<agde_tokio::tungstenite::Message>
        + futures_util::stream::FusedStream
        + Unpin,
>(
    ws_broadcaster: &mut tokio::sync::broadcast::Sender<
        Arc<(Vec<u8>, agde::Uuid, agde::Recipient)>,
    >,
    mut ws: S,
    addr: SocketAddr,
) {
    use futures_util::FutureExt;
    let mut listener = ws_broadcaster.subscribe();
    let mut uuid = None;
    let mut disconnected = false;

    #[allow(unused_assignments)] // invalid lint, the disconnected = true
    // assignments are valid
    loop {
        futures_util::select! {
            msg = listener.recv().fuse() => {
                let msg = msg.expect("ws broadcast got backlogged or unexpectedly closed");
                let (msg, sender, recipient) = &*msg;
                let recipient_matches= *recipient == agde::Recipient::All
                    || if let agde::Recipient::Selected(pier) = recipient {
                        uuid.map_or(false, |uuid| pier.uuid() == uuid)
                    } else {
                        false
                    };

                // don't ping pong message!
                if Some(*sender) == uuid || !recipient_matches {
                    continue;
                }
                let data = (*msg).clone();
                let msg = websocket::tungstenite::Message::Binary(data);
                if ws.send(msg).await.is_err() {
                    if !disconnected {
                        if let Some(uuid) = uuid {
                            ws_broadcaster.send(
                                Arc::new((
                                    agde_tokio::agde_io::to_compressed_bin(&agde::Message::new(
                                        agde::MessageKind::Disconnect,
                                        uuid,
                                        agde::Uuid::new()
                                    )),
                                    uuid,
                                    agde::Recipient::All,
                                ))
                            ).unwrap();
                        }
                        disconnected = true;
                    }
                    break;
                }
            },
            incomming = ws.next() => {
                let incomming = if let Some(Ok(msg)) = incomming {
                    msg
                } else {
                    if !disconnected {
                        if let Some(uuid) = uuid {
                            ws_broadcaster.send(
                                Arc::new((
                                    agde_tokio::agde_io::to_compressed_bin(&agde::Message::new(
                                        agde::MessageKind::Disconnect,
                                        uuid,
                                        agde::Uuid::new()
                                    )),
                                    uuid,
                                    agde::Recipient::All,
                                ))
                            ).unwrap();
                        }
                        disconnected = true;
                    }
                    break;
                };
                let msg = match incomming {
                    websocket::tungstenite::Message::Binary(msg) => msg,
                    websocket::tungstenite::Message::Text(text) => {
                        info!("Agde pier with UUID {uuid:?} send a text message: {text}");
                        continue;
                    }
                    _ => continue,
                };
                // `TODO` change agde protocol to add magic number to Bin
                // format, add version, recipient, sender, and if
                // dsconnecting.
                let agde_msg = if let Ok(msg) = agde_tokio::agde_io::from_compressed_bin(&msg) {
                    msg
                } else {
                    warn!("Received invalid message from UUID {uuid:?} from {addr}");
                    continue;
                };
                if let agde::MessageKind::Hello(cap) = agde_msg.inner() {
                    uuid = Some(cap.uuid());
                }
                if let agde::MessageKind::Disconnect = agde_msg.inner() {
                    disconnected = true;
                }
                if let Some(uuid) = uuid {
                    ws_broadcaster.send(Arc::new((msg, uuid, agde_msg.recipient()))).unwrap();
                }
            }
        };
    }
}
fn agde(
    channel: mpsc::SyncSender<
        Arc<std::sync::Mutex<Option<agde_tokio::agde_io::StateHandle<agde_tokio::Native>>>>,
    >,
) -> impl Fn(&mut kvarn::Extensions) -> kvarn::extensions::RetSyncFut<Result<(), String>>
       + Send
       + Sync
       + 'static {
    move |extensions| {
        let channel = channel.clone();
        Box::pin(async move {
            let agde_handle = Arc::new(std::sync::Mutex::new(None));
            let agde_moved_handle = agde_handle.clone();
            channel.send(agde_handle).unwrap();
            let (dx1, dx2) = tokio::io::duplex(1024 * 64);
            tokio::spawn(async move {
                tokio::time::sleep(Duration::from_millis(200)).await;
                let options =
                    agde_tokio::options_fs(true, agde_tokio::Compression::Zstd, "agde-data".into())
                        .await
                        .expect("failed to read file system metadata");
                let options = options
                    .with_startup_duration(Duration::from_secs(0))
                    .with_sync_interval(Duration::from_secs(30))
                    .with_periodic_interval(Duration::from_secs(120))
                    .with_no_public_storage();

                let options = options.arc();

                let log_lifetime = Duration::from_secs(60);

                let manager = agde_tokio::agde::Manager::new(true, 0, log_lifetime, 512);

                match agde_tokio::agde_io::run(
                    manager,
                    options,
                    move || async move {
                        let connection =
                            agde_tokio::tokio_tungstenite::WebSocketStream::from_raw_socket(
                                dx1,
                                agde_tokio::tungstenite::protocol::Role::Client,
                                None,
                            )
                            .await;
                        let (w, r) = agde_tokio::Io::Duplex(connection).split();
                        Ok(agde_tokio::Native(
                            Arc::new(futures_util::lock::Mutex::new(agde_tokio::WriteHalf(w))),
                            Arc::new(futures_util::lock::Mutex::new(agde_tokio::ReadHalf(r))),
                        ))
                    },
                    |_msg| {},
                    || {},
                )
                .await
                {
                    Ok(handle) => {
                        {
                            *agde_moved_handle.lock().unwrap() = Some(handle.state().clone());
                        }
                        agde_tokio::catch_ctrlc(handle.state().clone()).await;

                        let r = handle.wait().await;

                        if let Err(err) = r {
                            error!("agde-tokio: Got error when running: {err}. Exiting.");
                        } else {
                            info!("agde-tokio considers itself done.")
                        }
                    }
                    Err(err) => {
                        error!("agde-tokio: Got error when starting: {err}. Agde will not function from now on.");
                    }
                }
            });
            let (ws_broadcaster, _) = tokio::sync::broadcast::channel(1024);
            {
                let mut ws_broadcaster = ws_broadcaster.clone();
                tokio::spawn(async move {
                    let connection =
                        agde_tokio::tokio_tungstenite::WebSocketStream::from_raw_socket(
                            dx2,
                            agde_tokio::tungstenite::protocol::Role::Server,
                            None,
                        )
                        .await;
                    handle_ws(
                        &mut ws_broadcaster,
                        connection,
                        SocketAddr::new(IpAddr::V6(net::Ipv6Addr::LOCALHOST), 0),
                    )
                    .await;
                });
            }
            extensions.add_prepare_single(
                "/demo/ws",
                prepare!(
                    req,
                    host,
                    _path,
                    addr,
                    move |ws_broadcaster: tokio::sync::broadcast::Sender<
                        Arc<(Vec<u8>, agde::Uuid, agde::Recipient)>,
                    >| {
                        let ws_broadcaster = ws_broadcaster.clone();
                        websocket::response(
                            req,
                            host,
                            response_pipe_fut!(
                                pipe,
                                _host,
                                move |ws_broadcaster: tokio::sync::broadcast::Sender<
                                    Arc<(Vec<u8>, agde::Uuid, agde::Recipient)>,
                                >,
                                      addr: SocketAddr| {
                                    if let Ok(ws) = websocket::wrap(pipe).await {
                                        handle_ws(ws_broadcaster, ws, *addr).await;
                                    }
                                }
                            ),
                        )
                        .await
                    }
                ),
            );

            Ok(())
        })
    }
}
