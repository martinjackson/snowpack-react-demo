#!/bin/bash

cd certs

openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout server.key -out server.crt