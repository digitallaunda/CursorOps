#!/usr/bin/env bash
# Get schema (tables and fields) for the configured Airtable base
set -e

echo "Base ID: $AIRTABLE_BASE_ID"
echo "Tables:"
echo "--------"

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"airtable.getBaseSchema","args":{}}' | jq -r '.result.tables[] | "[\(.id)] \(.name)"'

