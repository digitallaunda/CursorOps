#!/usr/bin/env bash
# Usage: ./scripts/http-request.sh <METHOD> <URL> [body_json]
set -e

METHOD="${1:?need:METHOD}"
URL="${2:?need:URL}"
BODY="${3:-}"

BODY_JSON=""
if [ -n "$BODY" ]; then
  BODY_JSON=", \"body\": $BODY"
fi

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"http.request\",
    \"args\": {
      \"method\": \"$METHOD\",
      \"url\": \"$URL\"
      $BODY_JSON
    }
  }" | jq

