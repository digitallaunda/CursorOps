# Make.com Runbook

## Setup
```bash
export MAKE_API_TOKEN=<YOUR_MAKE_API_TOKEN>
export MAKE_ZONE=<YOUR_MAKE_ZONE>
export MAKE_TEAM=<YOUR_MAKE_TEAM_ID>
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
curl https://eu2.make.com/api/v2/scenarios \
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

