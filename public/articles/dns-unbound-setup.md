!> hide

<head>
    <title>Unbound DNS setup - 0 DNS latency | Linux</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="Local setup of Unbound, a caching, recursively resolving DNS server. Handling of captive portals when using custom DNS.">
</head>

If you want a speed and privacy increase while... well, being on the internet, setting up a local DNS server is an important first step.

> For a introduction to DNS, check the top of the page of [my DNS service](/dns/).

> I'll cover how to set up Unbound on Linux in this tutorial.
> As mentioned [here](/dns/#windows), you can install it on Windows too.
> If you are interested in privacy, consider switching to Linux
> (_especially_ if you're not planning on gaming, [Linus](https://youtu.be/3E8IGy6I9Wo)...)

The DNS server we'll be using, [Unbound](https://nlnetlabs.nl/projects/unbound/),
caches DNS queries using [Redis](https://redis.io/) for fast resolutions.

${toc}

# Background

Using third-party DNS resolvers (e.g. [`1.1.1.1`](https://1.1.1.1)) poses a security and privacy risk.
When using Linux (especially Arch), the default is probably to use your Wi-Fi's DNS. That's a disaster.

The DNS server you use can log and track you each time you visit a website.
By default on many low-level Linux distros, a DNS cache isn't used. This worsens the problem.

I offer a [DNS service](/dns/), physically located in Scandinavia
(i.e. speed will only beat `1.1.1.1`'s if you're physically near me, as they have servers all around the globe),
with guarantees to never collect **any** data.
If you don't trust me or Cloudflare (provider of `1.1.1.1`), I'll show you how to set up your own Unbound server,
just as I have it configured.

# Installation

Install the packages `redis` and `unbound`. These should be available in your package manager.
The aforementioned are the names `pacman` uses.

# Configuration

Next, let's configure Redis.

In `/etc/redis/redis.conf`, change the line with `hz 10` to `hz 2` and add the line `maxmemory 67108864` (2^26B, 64MiB) after `# maxmemory <bytes>`.

In `/etc/unbound/unbound.conf`, change the following lines. I state the value (by default commented out in the config) and what the line should contain.
These are all in the `server` section.

```yml
# This can sometimes help if you don't have IPv6 or if the connection is unreliable.
do-ip6: no

qname-minimisation: yes

module-config: "validator cachedb iterator"

serve-expired: yes
serve-expired-ttl: 0
```

Paste the following at the end of the config file.

```yml
cachedb:
    backend: "redis"
    redis-server-host: 127.0.0.1
    redis-server-port: 6379
```

The configuration is nearly done. Skip to [Running](#running) to start the server. Then run `drill icelk.dev. @127.0.0.1` to test Unbound.
If that succeeds, we need to tell all the programs using DNS (e.g. `pacman`, `curl`, `firefox`, `ntp`) to use our local DNS.

## Changing resolver

If you are using a graphical network manager (this is applicable for Windows too), change the DNS server there to `127.0.0.1` for IPv4 & `::1` for IPv6.

### Without GUI

First, we need to [disable overriding of `/etc/resolv.conf`](https://wiki.archlinux.org/title/Domain_name_resolution#Overwriting_of_/etc/resolv.conf).
If you're using `dhcpcd`, add this line at the bottom of `/etc/dhcpcd.conf`.

```ini
nohook resolv.conf
```

That disables usign the LAN's set DNS. See the link above on how to disable this using other network managers.

Next, **replace** `/etc/resolv.conf` with the following.

```conf
nameserver ::1
nameserver 127.0.0.1
options trust-ad
```

# Running

> Windows users can start, enable on startup, and restart the service `Unbound`.

To run now and on startup, run this as root.

```shell
# systemctl enable --now redis unbound
```

Check for any errors:

```shell
$ journalctl -eu unbound
$ journalctl -eu redis
```

# Captive portals

For me, the captive portal detection in Firefox works great.

If you're using Chromium or derivatives, I've heard great thing about [captive browser](https://github.com/FiloSottile/captive-browser).
