#!/bin/bash

h2load -n100000 -c100 -m10 https://localhost:8000
h2load -n100000 -c100 -m10 --h1 https://localhost:8000


