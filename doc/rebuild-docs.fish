#!/bin/fish

# Requires the following directory structure:
# kvarn/icelk.dev/doc (we are here)
# kvarn/kvarn-search
# docs/agde
# docs/elipdotter
# docs/fractal-renderer
# docs/sitemap-iter
# docs/std-dev

set locations "
kvarn/kvarn-search
docs/agde/agde:docs/agde/target/doc
docs/agde/den:null
docs/agde/agde-io:null
docs/agde/agde-tokio:null
docs/agde/agde-web:null
docs/elipdotter
docs/fractal-renderer
docs/sitemap-iter
docs/std-dev
docs/clap_autocomplete
docs/strange-attractor-renderer
kvarn/kvarn-auth
"

cd

set -x RUSTDOCFLAGS "--cfg docsrs"
 
for loc in (echo $locations)
    if test -z (echo $loc | string trim)
        continue
    end

    set doc_path (echo (echo $loc | string split :)[2])
    set loc (echo (echo $loc | string split :)[1])
    if test -z (echo $doc_path | string trim)
        set doc_path $loc/target/doc
    end
    set name (basename $loc)
    if ! string match -q $doc_path "null"
        unlink ~/kvarn/icelk.dev/doc/public/$name
    end
    cd ~/$loc
    echo "Pulling changes for $name."
    # adding `.` makes everything tracked
    git add .
    # when we now reset, every unexpected file is removed
    git reset --hard HEAD
    # then pull changes
    git pull
    echo "Documenting $name at $PWD"
    cargo +nightly doc --no-deps --all-features --lib
    if ! string match -q $doc_path "null"
        ln -fs ~/$doc_path ~/kvarn/icelk.dev/doc/public/$name
    end
end
