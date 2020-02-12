#!/bin/bash

ERR=$( npx unbuffer babel src --out-dir lib --copy-files --no-highlight-code | grep --color=always -v '^[>} ]' )
echo $ERR

echo "================================================"

echo $ERR | awk 'BEGIN { FS = "[:\(\)]" } ; { print $2 ":" $4 ":" $5 " " $1 ":" $3 }'

