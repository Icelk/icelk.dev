# [icelk.dev](https://icelk.dev/)

> This repo uses GIT LFS. Please see it's [docs](https://git-lfs.com/) before cloning.

This is the source of my personal website.
To get the full version running,
[download the fonts](download-fonts.sh) and start the server:

> You do have to clone [Moella](https://github.com/Icelk/moella)
> to `../moella` to get a successful build.

```shell
$ cd server
$ cargo install --path .
$ cd ..
$ kvarn-icelk -c icelk.dev.ron --high-ports -d icelk.dev
```

to run icelk.dev (you can leave `-d` out, since it's by default icelk.dev)
on high ports (8080, 8443), so you don't need superuser privileges.

## Server

The server builds on top of [Mölla](https://github.com/Icelk/moella) by adding
custom extensions for my websites.

## Contribution

Feel free to address any typos or misinformation!
The only requirement is to accept and cohere to [the license](#license).

## License

The front-end code and writing of this project is distributed under the
[CC Attribution-ShareAlike 4.0 International license](LICENSE).
All contributions must also be.

The files in `server` are licensed under the `MIT` license.

The above is not applicable to [highlight.js](highlight.js) which is licensed under the `BSD 3-Clause License`.
