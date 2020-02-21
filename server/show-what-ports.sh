#!/bin/bash

if [ -z "$1" ]
  then
    echo "How To Use: $0 node"
    exit
fi

WHAT=$1

grep_keep_header () {
   pattern="$1" ; shift
   exec awk 'NR == 1 || /'"$pattern"'/' "$@"
}

sudo lsof -n -i -b -P 2>/dev/null | grep_keep_header  $WHAT 
echo ' '
sudo ps axo user,pid,pcpu,pmem,stat,start,time,args | grep_keep_header "$WHAT " | grep -v awk
echo ' '
sudo lsof -Ki -b 2>/dev/null | grep_keep_header '\scwd\s' | grep_keep_header "^$WHAT" 


