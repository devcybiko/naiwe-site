#!/bin/bash -v
find ~/public_html -name 'error_log' -ls -exec ~/git/naiwe-logs/cp.sh {} ';'
cd ~/git/naiwe-logs
theDate=`date`
echo "$theDate" > lastupdate.txt
id > id.txt
#git pull
git add -A
git commit -am "auto-updating $theDate"
git push
