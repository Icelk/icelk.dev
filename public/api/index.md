!> hide

<head>
    <title>API reference | Icelk</title>
    <meta name="permalinks" content="enabled"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="Documentation for APIs available for free on icelk.dev">
    [highlight]
</head>

This a document containing the usage of all the APIs I offer, for free. Always.

I will never store identifiable data, such as IP addresses, `user-agent` strings, etc.

The structure is as follows:

-   first heading level denotes the category.
-   the next heading level is the name of the API (optional, e.g. [IP](#ip) doesn't need this)
-   the next is the [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) used
    can be multiple per API.
-   the next level is metadata about the API.

All error responses contain a `reason` header and a useful body.
See the first example of the [lookup API](#lookup).

${toc}

# IP

`/ip`

## GET

### Description

Returns the IP address of the callee.

### Query

No query parameters are considered.

### Response

The IP address in plain text.

# DNS

## Lookup

`/dns/lookup`

### GET

#### Description

Resolve the A, AAAA, MX, TXT, and CNAME records for a domain.

Uses [my public resolver](/dns/).

#### Query

-   `domain` (required) - gives the domain of which to operate on

#### Response

Each DNS record is on it's own line (separated by `\n`, not `\r\n`)
with the type followed by one space followed by the value.

Will always contain a trailing "\n".

The value is the string of the destination domain in the case of MX & CNAME,
the IP address in the case of A & AAAA
and the content in case of a TXT.

If the domain can't be resolved, a 404 will be returned.

#### Examples

```shell
$ curl -sI "https://icelk.dev/dns/lookup?domain=icelk.dev.dev" | grep "reason: "
reason: no DNS entry was found
```

I intentionally added a newline at the bottom to reflect the API.
This isn't how it's displayed in a shell, but represents the string you'd get from a programming language HTTP request function.

```shell
$ curl "https://icelk.dev/dns/lookup?domain=icelk.dev"
A 78.69.142.191
MX mail.icelk.dev.

```

## DNS over TLS check

`/dns/check-dns-over-tls`

### GET

#### Description

Checks the DNS server at the IP address for DNS over TLS support for the domain.

#### Query

-   `ip` (required) - the IP address for the DNS server
-   `name` (required) - the domain to check the certificate against
-   `lookup-name` (default: `icelk.dev`) - which domain to resolve. This should not matter.

#### Response

Might return a `500 Internal Server Error` if creating a DNS request failed.

If the server failed to respond before the timeout,
used invalid protocol, or
failed the TLS check, the string `unsupported` is returned.

If everything checks out, `supported` is returned.

#### Examples

```shell
$ curl "https://icelk.dev/dns/check-dns-over-tls?ip=78.69.142.191&name=icelk.dev"
supported
```
