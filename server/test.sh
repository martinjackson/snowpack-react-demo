#!/bin/bash

curl https://localhost:8080/ -kiv

nghttp -ans https://localhost:8080

npx sitespeed.io https://www.sitespeed.io/
cd sitespeed-result/www.sitespeed.io/2020-02-21-14-02-00
google-chrome index.html


