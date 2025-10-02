#!/usr/bin/env bash
# Usage: ./scripts/airtable-create.sh <TABLE> <fields_json>
set -e

TABLE="${1:?need:TABLE}"
FIELDS="${2:?need:FIELDS_JSON}"

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"airtable.createRecord\",
    \"args\": {
      \"table\": \"$TABLE\",
      \"fields\": $FIELDS
    }
  }" | jq

