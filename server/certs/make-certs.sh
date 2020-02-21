#!/bin/bash

# openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout localhost.key -out localhost.crt

# echo '(assumes previously)     sudo apt-get install libnss3-tools'
# npx tls-keygen server.key server.crt

# previously ... brew install mkcert 
#   https://docs.brew.sh/Homebrew-on-Linux
#       sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
#   https://github.com/FiloSottile/mkcert
#       brew install mkcert 
# 
mkcert -install
mkcert ncu0190765.fda.gov "*.ncu0190765.fda.gov" example.test localhost 127.0.0.1 ::1

