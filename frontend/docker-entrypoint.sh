#!/bin/sh -xe
if [ -d /root/config/ ]; then
    cp /root/config/env /usr/src/app/.env
fi

/bin/bash -c "nginx -g 'daemon off;'"