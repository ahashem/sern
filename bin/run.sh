#!/usr/bin/env bash
service ssh start
export NODE_ENV=production
export DEBUG=sern:*
pm2 start ./bin/pm2.config.js  --env production --no-daemon
