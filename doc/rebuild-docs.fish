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
docs/elipdotter
docs/fractal-renderer
docs/sitemap-iter
docs/std-dev
docs/clap_autocomplete
docs/strange-attractor-renderer
docs/kvarn-auth
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
    unlink ~/kvarn/icelk.dev/doc/public/$name
    cd ~/$loc
    echo "Pulling changes for $name."
    # adding `.` makes everything tracked
    git add .
    # when we now reset, every unexpected file is removed
    git reset --hard HEAD
    # then pull changes
    git pull
    echo "Documenting $name."
    cargo +nightly doc --no-deps --all-features
    if ! string match -q $doc_path "null"
        ln -fs ~/$doc_path ~/kvarn/icelk.dev/doc/public/$name
    end
end
