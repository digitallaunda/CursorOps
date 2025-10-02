#!/usr/bin/env bash
# List all Apify actors in your account
set -e

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"apify.listActors","args":{}}' | jq -r '.result.data.items[] | "[\(.id)] \(.name)"'

