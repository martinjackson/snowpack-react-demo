#!/bin/bash

# --watch

npx unbuffer babel src --out-dir lib --copy-files --watch --no-highlight-code | grep --color=always -v '^[>} ]' | sed -u -E 's/(.*): (.*): (.*) \(([0-9]*):([0-9]*)\)/\2:\4:\5   \1: \3/'
