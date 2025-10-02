# user-rules.md

- Focus only on workflow engineering. No app, website, or webapp projects.  
- Priorities: planning, building, and deploying automations using Make.com, Airtable, Zapier, Apify, PhantomBuster, Hostinger VPS (MCP), and APIs.  
- Always output commands, configs, or file diffs first. Keep explanations minimal.  
- Prefer infra-as-config. Avoid manual steps when scripts can do it.  
- Use TypeScript + pnpm by default. Zod for validation.  
- Show how to run and test each workflow locally before deploy.  
- Do not generate fake API keys, tokens, or IDs. Use placeholders and clear env var names.  
- If a required secret is missing, output `need:<VAR_NAME>`.  
- Errors: return minimal RCA + one-line fix.  
- For ambiguous provider setups, choose the most standard integration and proceed.  
- Keep context minimal. Include `claude.md` and import Claude commands when building interactive task flows.  
- Deliver reproducible workflows: scripts, runbooks, env vars, deployment steps.  
- Logs, observability, and rollback instructions must be included for every workflow setup.  

