#!/bin/sh

version="1.085"

curl -L https://github.com/arrowtype/recursive/releases/download/v$version/ArrowType-Recursive-$version.zip -o recursive.zip

mkdir recursive
unzip recursive.zip -d recursive

font_base="recursive/ArrowType-Recursive-$version"
font="$font_base/Recursive_Web"
web="public/fonts"

cp "$font_base/LICENSE.txt" "$web/recursive-license.txt"
cp -R "$font/woff2_variable_subsets/fonts/./" "$web/"
cp -R "$font/woff2_variable/./" "$web/"

rm -rf recursive
rm recursive.zip
