#!/bin/sh
set -eu

if [ -z "${API_BASE_URL:-}" ]; then
  echo "ERROR: API_BASE_URL is required for container startup." >&2
  exit 1
fi

envsubst '$API_BASE_URL' \
  < /usr/share/nginx/html/runtime-config.template.json \
  > /usr/share/nginx/html/runtime-config.json
