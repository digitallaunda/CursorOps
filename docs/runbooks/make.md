# Make.com Runbook

## Setup
```bash
# Load from .env file
source .env

# Or set manually
export MAKE_API_TOKEN=<YOUR_MAKE_API_TOKEN>
export MAKE_ZONE=<YOUR_MAKE_ZONE>
export MAKE_ORGANIZATION_ID=<YOUR_MAKE_ORG_ID>
```

## Run Scenario
```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "make.runScenario",
    "args": {
      "scenarioId": "<SCENARIO_ID>",
      "inputs": {}
    }
  }'
```

## List Scenarios
Query the Make API directly to get scenario IDs:
```bash
curl "https://$MAKE_ZONE/api/v2/scenarios?organizationId=$MAKE_ORGANIZATION_ID" \
  -H "Authorization: Token $MAKE_API_TOKEN"
```

## Rollback
Redeploy previous version:
```bash
cd ~/apps/mcp && git checkout <PREV_COMMIT>
pnpm i && pnpm -w build
sudo systemctl restart mcp-workbench
```

## Logs
```bash
journalctl -u mcp-workbench -f | grep make
```

