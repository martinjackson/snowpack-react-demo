#!/bin/bash

# npx uncss -s http://127.0.0.1:8080/ -s http://127.0.0.1:8080/public/Card.css http://127.0.0.1:8080/public/Demo.css


npx snowpack --dest public/
npx babel src --out-dir public --copy-files --verbose

