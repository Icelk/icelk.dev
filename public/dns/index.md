!> hide

<head>
    <title>DNS resolver & lookup</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="Fast, log-free and privacy first independent DNS resolver. DNS MX, A, AAAA lookup & DNS over TLS verifier / checker.">
    <script src="script.js" defer></script>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>

When you visit a website (or anything on the internet), you write the name of the site and get an answer.
Somewhere (probably in a Big Tech data centre), a computer (not unlike the one you're using)
gets your request and forms a response.

To get the address to send data to, DNS resolvers take the site name and gives you the address. That's what I'm offering. A **privacy first**, fast DNS resolver.

> The service is best in Scandinavia, as that's where the server physically resides.

After seeing the [stats Cloudflare provided](https://blog.cloudflare.com/october-2021-facebook-outage/),
I realized the DNS resolver I'd been using was keeping logs. This is more private.

> Cloudflare's `1.1.1.1` service is anyway greatly superior in every way (privacy, speed) to Google's offering and especially your ISP's service.

<div id="status" style="text-align: center;">Checking status...</div>

<div id="tools" style="text-align: center;">
    <div id="toolsHeading">Tools</div>
    <input id="lookup" class="box" type="url" placeholder="Look up DNS records...">
    <br>
    <span id="lookupResult" class="result box" style="display: none;"></span>
    <span id="getIp" class="box">Reveal my ip</span>
    <br>
    <input id="tlsCheck" class="box" type="text" placeholder="Check DoT, <ip>#<name>">
    <br>
    <span id="tlsCheckResult" class="result box" style="display: none;"></span>
</div>

In my perpetual mission of increasing privacy, I've began hosting my own DNS resolver. It does **not** depend on any external resolvers.

> I guarantee to not collect **any** data, no IP logs, no DNS queries, nada.

If your DNS / internet suddenly stops working, please remove the [changes](#setup) and visit this page for updates.

# Service

The IP for this DNS service is **78.69.142.191**.

I offer both DNS on port `53` and [DNS over TLS](https://en.wikipedia.org/wiki/DNS_over_TLS) on port `853`.
Use DoT for better security and privacy. Using normal DNS (port `53`), middlemen can redirect you to other sites.

# Setup

This is a brief introduction on how to change DNS settings on various devices.

## Mobile devices

In most operating systems, you can change DNS settings on a per network basis.
Go to the Wi-Fi settings and select the connected network. In that menu, you should find the settings.

## Desktop computers

I recommend installing `Unbound` as a DNS server locally, which caches DNS queries and can more securely fetch them from my server.

### Windows

[Install Unbound](https://nlnetlabs.nl/projects/unbound/download/).

Edit the config file located at `C:\Program Files\Unbound\service.conf`.

At the bottom, add the following:

```
forward-zone:
  name: "."
  forward-tls-upstream: yes
  forward-addr: 78.69.142.191@853#icelk.dev
```

Also, find (search in your text editor (e.g. `notepad`)) the line that contains `# tls-win-cert: no`.
Replace it with `tls-win-cert: yes`. Notice the `#` got removed.

Now, search for and open the program `Services` and restart `Unbound`.

You should now be using my DNS service.

### Unix

Install Unbound using your favourite package manager
(e.g. `brew` on macOS, `pacman` on Arch derivatives, `apt-get` on Debian derivatives).

Edit the config file located at `/etc/unbound/unbound.conf`.
At the bottom, add the following:

```
forward-zone:
  name: "."
  forward-tls-upstream: yes
  forward-addr: 78.69.142.191@853#icelk.dev
```

Now, you need to add trusted certificates to verify it's me who's responding to your DNS queries.
On Arch, replace the line containing `tls-cert-bundle` with `tls-cert-bundle: /etc/ssl/certs/ca-certificates.crt`, with the same indentation.
[Search](https://search.brave.com) for how to do it for your OS.

Check [this](https://wiki.archlinux.org/title/Unbound#Manually_specifying_DNS_servers)
and [this link](https://wiki.archlinux.org/title/Unbound#Forwarding_using_DNS_over_TLS)
for more details.

For more details on how to harden this setup and allow captive portals on Linux,
see my [accompanying article](/articles/dns-unbound-setup.).
