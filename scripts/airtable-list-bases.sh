#!/usr/bin/env bash
# List all Airtable bases accessible with your API key
set -e

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"airtable.listBases","args":{}}' | jq -r '.result.bases[] | "[\(.id)] \(.name)"'

