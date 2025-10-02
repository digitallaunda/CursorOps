# Apify Runbook

## Setup
```bash
export APIFY_TOKEN=<YOUR_APIFY_API_TOKEN>
```

## Run Actor
```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "apify.run",
    "args": {
      "actorId": "<ACTOR_ID>",
      "input": {
        "startUrls": ["https://example.com"]
      },
      "timeout": 300
    }
  }'
```

## Check Run Status
```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "apify.getRunStatus",
    "args": {
      "runId": "<RUN_ID>"
    }
  }'
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
journalctl -u mcp-workbench -f | grep apify
```

