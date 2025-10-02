# Airtable Runbook

## Setup
```bash
export AIRTABLE_API_KEY=<YOUR_AIRTABLE_PAT>
export AIRTABLE_BASE_ID=<YOUR_BASE_ID>
```

## Query Records
```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "airtable.query",
    "args": {
      "table": "Contacts",
      "filterByFormula": "FIND(\"active\",{Status})",
      "maxRecords": 100
    }
  }'
```

## Create Record
```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "airtable.createRecord",
    "args": {
      "table": "Contacts",
      "fields": {
        "Name": "John Doe",
        "Email": "john@example.com",
        "Status": "active"
      }
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
journalctl -u mcp-workbench -f | grep airtable
```

