#!/bin/bash

# sudo apt-get install nghttp2-client

h2load -n200 -c100 -m10 https://localhost:8000

