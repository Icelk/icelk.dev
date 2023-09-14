#!/bin/sh

rsync -rvPhL --del --exclude '**target**' --exclude '**.pem' --exclude '**private' --exclude '**rsync-ignore**' --exclude 'lets-encrypt-credentials**' --exclude "doc/public/" --include "doc/public/index.html" --include "doc/public/style.css" --exclude "**.git" ./ icelk.dev:~/kvarn/icelk.dev/
cd server
cargo build --release
ssh icelk.dev "mkdir -p kvarn/icelk.dev/server/target/release"
rsync -rvPhL ./target/release/kvarn-icelk icelk.dev:~/kvarn/icelk.dev/server/target/release/kvarn-icelk
