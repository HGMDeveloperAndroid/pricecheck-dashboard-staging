#!/bin/sh

export WORKERS="${WORKERS:=2}"
export WORKER_CONNECTIONS="${WORKER_CONNECTIONS:=1024}"

mkdir -p /app/.next
OLD_BUILD=$(cat /app/.next/BUILD_ID)
NEW_BUILD=$(cat /app/.next-build/BUILD_ID)

if [ "$OLD_BUILD" = "$NEW_BUILD" ]; then
    echo "Same build, will copy only new files in .next directory"
    cp -ru /app/.next-build/* /app/.next/
else
    echo "Different build, will maintain only cached images in .next directory"
    cd /app/.next
    find . -maxdepth 0 -name 'cache' -prune -o -exec rm -rf '{}' ';'
    cd /app/.next-build
    cp -r `ls -A | grep -v "cache"` /app/.next
    cp -ru /app/.next-build/cache/* /app/.next/cache
    cd /app
fi

sed -i "s/WORKERS/$WORKERS/g" /etc/nginx/nginx.conf
sed -i "s/WORKER_CONNECTIONS/$WORKER_CONNECTIONS/g" /etc/nginx/nginx.conf

nginx
yarn start -p 7000
