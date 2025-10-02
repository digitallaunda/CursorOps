#!/usr/bin/env bash
# List all Make.com scenarios
set -e

FILTER="${1:-all}"

RESPONSE=$(curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"make.listScenarios","args":{}}')

case "$FILTER" in
  active)
    echo "$RESPONSE" | jq -r '.result.scenarios[] | select(.isActive) | "[\(.id)] \(.name) - \(.scheduling.type)"'
    ;;
  inactive)
    echo "$RESPONSE" | jq -r '.result.scenarios[] | select(.isActive == false) | "[\(.id)] \(.name) - \(.scheduling.type)"'
    ;;
  summary)
    echo "$RESPONSE" | jq '{total: (.result.scenarios | length), active: [.result.scenarios[] | select(.isActive)] | length, inactive: [.result.scenarios[] | select(.isActive == false)] | length}'
    ;;
  *)
    echo "$RESPONSE" | jq -r '.result.scenarios[] | "[\(.id)] \(.name) - \(.scheduling.type) - Active: \(.isActive)"'
    ;;
esac

