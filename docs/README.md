# Workflow Engineering Setup

## Scope
This repo is only for workflow infra and automation, not app/web dev.

## Structure
```
/apps/mcp-server
/packages/clients/{make,airtable,zapier,apify,phantombuster,http}
/docs
```

## Quick start
```bash
pnpm i
pnpm -w build
cp .env.example .env.local   # fill tokens
pnpm -w test
pnpm -F @apps/mcp-server dev
```

## Env

See `project-rules.md`. Populate `.env.local`. Never commit.

## Runbooks

* Make.com: `pnpm m make:run --id <SCENARIO_ID> --inputs <json>`
* Airtable: `pnpm m airtable:query --base $AIRTABLE_BASE_ID --table Contacts --filter "FIND('active',{Status})"`
* Zapier: `pnpm m zap:trigger --zap <ZAP_ID> --data <json>`
* Apify: `pnpm m apify:run --actor <ACTOR_ID> --input <json>`
* PhantomBuster: `pnpm m phantom:run --agent <AGENT_ID> --args <json>`
* HTTP: `pnpm m http:request --method POST --url <URL> --body <json>`

## Deployment to Hostinger VPS

```bash
ssh -i $HOSTINGER_SSH_KEY_PATH $HOSTINGER_SSH_USER@$HOSTINGER_SSH_HOST
mkdir -p ~/apps/mcp && sudo apt-get update && sudo apt-get install -y nodejs npm
rsync -az --exclude-from='.cursorignore' . $HOSTINGER_SSH_USER@$HOSTINGER_SSH_HOST:~/apps/mcp

ssh -i $HOSTINGER_SSH_KEY_PATH $HOSTINGER_SSH_USER@$HOSTINGER_SSH_HOST <<'EOF'
cd ~/apps/mcp && pnpm i && pnpm -w build
sudo tee /etc/systemd/system/mcp-workbench.service >/dev/null <<UNIT
[Unit]
Description=MCP Workbench
After=network.target
[Service]
User=%i
WorkingDirectory=/home/%i/apps/mcp/apps/mcp-server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable mcp-workbench
sudo systemctl start mcp-workbench
EOF
```

## Observability

* Logs: `journalctl -u mcp-workbench -f`
* Rollback: redeploy previous artifact directory, restart service.

