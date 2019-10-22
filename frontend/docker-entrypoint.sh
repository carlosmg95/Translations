#!/bin/sh -xe
if [ -d /root/config/ ]; then
    cp /root/config/env /usr/src/app/.env
fi

serve -s build -l 5000