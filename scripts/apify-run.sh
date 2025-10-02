#!/usr/bin/env bash
# Usage: ./scripts/apify-run.sh <ACTOR_ID> <input_json>
set -e

ACTOR_ID="${1:?need:ACTOR_ID}"
INPUT="${2:-{}}"

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"apify.run\",
    \"args\": {
      \"actorId\": \"$ACTOR_ID\",
      \"input\": $INPUT
    }
  }" | jq

