#!/bin/bash -v
find ~/public_html -name 'error_log' -ls -exec ~/git/naiwe-logs/cp.sh {} ';'
cd ~/git/naiwe-logs
date > lastupdate.txt
id > id.txt
git pull origin
git add -A
git commit -am "auto-updating"
git push
