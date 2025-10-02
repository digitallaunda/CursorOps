#!/usr/bin/env bash
# Usage: ./scripts/airtable-query.sh <TABLE> [filter] [maxRecords]
set -e

TABLE="${1:?need:TABLE}"
FILTER="${2:-}"
MAX_RECORDS="${3:-100}"

FILTER_JSON=""
if [ -n "$FILTER" ]; then
  FILTER_JSON=", \"filterByFormula\": \"$FILTER\""
fi

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"airtable.query\",
    \"args\": {
      \"table\": \"$TABLE\",
      \"maxRecords\": $MAX_RECORDS
      $FILTER_JSON
    }
  }" | jq

