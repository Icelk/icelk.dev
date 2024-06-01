#!/bin/sh

ip=$(cat ip.txt)

new_ip=$1

if [[ -z $new_ip ]]; then
    echo "Provide a new IP"
    exit 1
fi

read -p "Replace $ip with $new_ip? " -n 1 response
if [[ $response != y ]]; then
    exit 1
fi
echo

paths=$(rg --hidden --one-file-system --files-with-matches "$ip" public)
sd -F $ip $new_ip $paths

echo "$new_ip" > ip.txt
