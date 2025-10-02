# Workflow Automation Infrastructure

Monorepo for workflow engineering: Make.com, Airtable, Apify, and HTTP automation via MCP server.

## Structure

```
/apps/mcp-server          - MCP server exposing workflow tools
/packages/clients/make    - Make.com API client
/packages/clients/airtable - Airtable API client
/packages/clients/apify   - Apify API client
/packages/clients/http    - Generic HTTP client
/docs/runbooks/           - Provider-specific runbooks
/scripts/                 - CLI wrapper scripts
```

## Quickstart

```bash
# Install
pnpm install

# Build all packages
pnpm -w build

# Configure env
cp .env.example .env.local
# Edit .env.local with your tokens

# Start MCP server
pnpm -F @apps/mcp-server start

# Test health
curl http://localhost:7337/health

# Check all providers status
./scripts/status.sh
```

## CLI Tools

### Discovery
```bash
# List all available resources
./scripts/airtable-list-bases.sh        # List Airtable bases
./scripts/airtable-get-schema.sh        # Get tables in current base
./scripts/make-list-scenarios.sh        # List Make.com scenarios
./scripts/apify-list-actors.sh          # List Apify actors
```

### Execution
```bash
# Make.com
./scripts/make-run.sh <SCENARIO_ID> '{"key":"value"}'

# Airtable - Query
./scripts/airtable-query.sh "Table 1" 'FIND("active",{Status})' 10

# Airtable - Create
./scripts/airtable-create.sh "Table 1" '{"Name":"John","Email":"john@example.com"}'

# Apify
./scripts/apify-run.sh "apify/web-scraper" '{"startUrls":[{"url":"https://example.com"}]}'

# HTTP
./scripts/http-request.sh GET https://api.github.com/zen
./scripts/http-request.sh POST https://httpbin.org/post '{"test":true}'
```

## MCP Tools

Direct tool invocation via HTTP:

```bash
curl -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "airtable.query",
    "args": {
      "table": "Contacts",
      "maxRecords": 5
    }
  }'
```

Available tools:
- `make.runScenario` / `make.listScenarios`
- `airtable.query` / `airtable.createRecord` / `airtable.listBases` / `airtable.getBaseSchema`
- `apify.run` / `apify.getRunStatus` / `apify.listActors`
- `http.request`

## Testing

```bash
# Type check
pnpm -w typecheck

# Run tests
pnpm -w test

# Smoke test
./test-tools.sh
```

## Deployment

See `docs/README.md` for Hostinger VPS deployment via systemd.

## Env Vars

```
MAKE_API_TOKEN=<token>
MAKE_ZONE=eu2.make.com
MAKE_TEAM=<team_id>
AIRTABLE_API_KEY=<key>
AIRTABLE_BASE_ID=<base_id>
APIFY_TOKEN=<token>
GITHUB_TOKEN=<token>
MCP_PORT=7337
LOG_LEVEL=info
```

## Observability

```bash
# Logs (local)
pnpm -F @apps/mcp-server start 2>&1 | pino-pretty

# Logs (deployed)
journalctl -u mcp-workbench -f
```

## Rollback

```bash
cd ~/apps/mcp
git checkout <PREV_COMMIT>
pnpm i && pnpm -w build
sudo systemctl restart mcp-workbench
```

## Docs

- `docs/README.md` - Deployment guide
- `docs/claude.md` - Claude command integration
- `docs/runbooks/` - Provider-specific guides

