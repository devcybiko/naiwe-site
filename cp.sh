IFS="/"
arr=($1)
name=${arr[${#arr[@]}-2]}-${arr[${#arr[@]}-1]}
IFS=' '
tail -1000 $1 > ~/git/naiwe-logs/$name

