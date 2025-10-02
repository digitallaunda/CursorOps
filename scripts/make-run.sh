#!/usr/bin/env bash
# Usage: ./scripts/make-run.sh <SCENARIO_ID> <inputs_json>
set -e

SCENARIO_ID="${1:?need:SCENARIO_ID}"
INPUTS="${2:-{}}"

curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"make.runScenario\",
    \"args\": {
      \"scenarioId\": \"$SCENARIO_ID\",
      \"inputs\": $INPUTS
    }
  }" | jq

