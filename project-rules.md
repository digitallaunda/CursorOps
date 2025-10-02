# project-rules.md  

- **Scope**: Only workflow engineering. Configure, automate, and deploy workflows across Make.com, Airtable, Zapier, Apify, PhantomBuster, Hostinger VPS (for MCP), and APIs. No app, website, or webapp builds.  

- **Language & tools**:  
  - TypeScript as default.  
  - pnpm for package management.  
  - zod for input validation.  
  - vitest for tests.  
  - pino for structured logging.  

- **Style & quality**:  
  - Biome or ESLint+Prettier for linting and formatting.  
  - Strict TypeScript. Fail on warnings in CI.  

- **Secrets & env**:  
  - Use env vars only. No plaintext in repo.  
  - `.env*` files ignored.  
  - Support Doppler or 1Password for CI.  
  - Standard vars:  
    - MAKE_API_TOKEN  
    - AIRTABLE_API_KEY, AIRTABLE_BASE_ID  
    - ZAPIER_AUTH_TOKEN  
    - APIFY_TOKEN  
    - PHANTOMBUSTER_API_KEY  
    - HOSTINGER_SSH_HOST, HOSTINGER_SSH_USER, HOSTINGER_SSH_KEY_PATH  
    - MCP_PORT, MCP_ALLOWED_ORIGINS  
    - LOG_LEVEL  

- **MCP tools exposed**:  
  - `make.runScenario(id, inputs)`  
  - `airtable.query(baseId, table, filter)`  
  - `zapier.trigger(zapId, payload)`  
  - `apify.run(actorId, input)`  
  - `phantombuster.launch(agentId, args)`  
  - `http.request({method,url,headers,body})`  

- **Testing**:  
  - Minimal mock calls for each provider.  
  - Local smoke tests before deploy.  

- **Deployment**:  
  - MCP server deployed to Hostinger VPS via SSH + systemd service.  
  - Service: `mcp-workbench.service`.  
  - Use zero-downtime restart (`systemctl reload-or-restart`).  

- **CI/CD**:  
  - Jobs: install, lint, typecheck, test, build, deploy.  
  - Cache pnpm store.  
  - Fail CI if typecheck or tests fail.  

- **Observability**:  
  - Structured logs with `RUN_ID`.  
  - Logs redacted of secrets.  
  - Rollback steps included in docs.  

- **Docs**:  
  - `/docs/runbooks` with quickstart + rollback for each provider.  
  - `claude.md` included for command-based tasking.  

