#!/bin/bash

grep_keep_header () {
   pattern="$1" ; shift
   exec awk 'NR == 1 || /'"$pattern"'/' "$@"
}

## sudo /etc/init.d/xrdp stop
## sudo /etc/init.d/postgresql stop
## sudo /etc/init.d/redis-server stop

# sudo lsof -i -P -n | grep LISTEN
# sudo netstat -tulpn | grep '^tcp'

sudo lsof -i -P -n | grep_keep_header LISTEN | grep_keep_header 'IPv4'


