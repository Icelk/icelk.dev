!> hide

<head>
    <title>Icelk code documentation</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="Online documentation for all Icelk's projects and APIs.">
</head>

This is the landing page for my projects' documentation.

icelk.dev's API documentation is located [here](https://icelk.dev/api/).

---

# Rust

[Kvarn](https://doc.kvarn.org), a forward-thinking fast web server designed to
fit your needs, efficiently.

[Mölla](/moella/moella/), the Kvarn executable and config format.

[Agde](/agde/agde/), a general decentralized sync library supporting text and
binary.

[Dach](/agde/dach/), a diff library with support for _any_ changing data.

[agde-io](/agde/agde_io/); [agde-tokio](/agde/agde_tokio/); and
[agde-web](/agde/agde_web/), further abstractions on top of Agde. This is the
code that interacts with your browser / OS to store and send data.

[Elipdotter](/elipdotter/elipdotter/), a full text search engine.

[kvarn-search](/kvarn-search/kvarn_search/), an extension to
[Kvarn](https://kvarn.org) that uses
[Elipdotter](https://github.com/Icelk/elipdotter) to provide search
capabilities.

[kvarn-auth](/kvarn-auth/kvarn_auth/), an en extension to
[Kvarn](https://kvarn.org) that adds simple, secure, and _fast_ authentication
to your Kvarn instance.

[std-dev](/std-dev/std_dev/), a statistics calculation library with support for
regression (multiple estimators), standard deviation, etc.

[fractal-renderer](/fractal-renderer/fractal_renderer/), a multi-threaded
fractal renderer (soon running on the GPU) with support for the Mandelbrot,
Julia sets, and the Barnsley fern. Documentation isn't very good since this is a
binary.

[sitemap-iter](/sitemap-iter/sitemap_iter/), a small library to iterate the
pages of a website according to it's sitemap. Used by
[kvarn-search](https://github.com/Icelk/kvarn-search) when crawling.

[clap_autocomplete](/clap_autocomplete/clap_autocomplete/), an easy to integrate
shell completion for Clap. Finds the user's shell and puts completion files in
the appropriate locations.

[strange-attractor-renderer](/strange-attractor-renderer/strange_attractor_renderer/),
a blazingly fast mulithreaded strange attractor renderer.
