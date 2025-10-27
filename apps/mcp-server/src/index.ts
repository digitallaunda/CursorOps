import { config } from "dotenv";
import pino from "pino";
import { createMakeClient } from "@clients/make";
import { createAirtableClient } from "@clients/airtable";
import { createApifyClient } from "@clients/apify";
import { createHttpClient } from "@clients/http";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../../..");

// Load base .env first, then .env.local to allow local overrides
const envPath = resolve(rootDir, ".env");
const envLocalPath = resolve(rootDir, ".env.local");
const envResult = config({ path: envPath });
const envLocalResult = config({ path: envLocalPath });

const logger = pino({
  name: "mcp-server",
  level: process.env.LOG_LEVEL || "info",
  redact: ["*.apiKey", "*.token", "*.apiToken"],
});

const RUN_ID = process.env.RUN_ID || `run_${Date.now()}`;
logger.info(
  {
    RUN_ID,
    envPath,
    envLoaded: !envResult.error,
    envLocalPath,
    envLocalLoaded: !envLocalResult.error,
  },
  "MCP server starting",
);

// Initialize clients
const makeClient = process.env.MAKE_API_TOKEN
  ? createMakeClient({
      apiToken: process.env.MAKE_API_TOKEN,
      zone: process.env.MAKE_ZONE || "eu2.make.com",
      teamId: process.env.MAKE_TEAM,
      organizationId: process.env.MAKE_ORGANIZATION_ID || process.env.MAKE_TEAM,
    })
  : null;

const airtableClient =
  process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID
    ? createAirtableClient({
        apiKey: process.env.AIRTABLE_API_KEY,
        baseId: process.env.AIRTABLE_BASE_ID,
      })
    : null;

const apifyClient = process.env.APIFY_TOKEN
  ? createApifyClient({ token: process.env.APIFY_TOKEN })
  : null;

const httpClient = createHttpClient();

// MCP Tool handlers
export const tools = {
  "make.runScenario": async (args: { scenarioId: string; inputs?: Record<string, unknown> }) => {
    if (!makeClient) throw new Error("need:MAKE_API_TOKEN");
    return makeClient.runScenario(args);
  },

  "airtable.query": async (args: {
    table: string;
    filterByFormula?: string;
    maxRecords?: number;
    view?: string;
  }) => {
    if (!airtableClient) throw new Error("need:AIRTABLE_API_KEY,AIRTABLE_BASE_ID");
    return airtableClient.query(args);
  },

  "airtable.createRecord": async (args: { table: string; fields: Record<string, unknown> }) => {
    if (!airtableClient) throw new Error("need:AIRTABLE_API_KEY,AIRTABLE_BASE_ID");
    return airtableClient.createRecord(args.table, args.fields);
  },

  "airtable.listBases": async () => {
    if (!airtableClient) throw new Error("need:AIRTABLE_API_KEY,AIRTABLE_BASE_ID");
    return airtableClient.listBases();
  },

  "airtable.getBaseSchema": async () => {
    if (!airtableClient) throw new Error("need:AIRTABLE_API_KEY,AIRTABLE_BASE_ID");
    return airtableClient.getBaseSchema();
  },

  "make.listScenarios": async () => {
    if (!makeClient) throw new Error("need:MAKE_API_TOKEN");
    return makeClient.listScenarios();
  },

  "apify.listActors": async () => {
    if (!apifyClient) throw new Error("need:APIFY_TOKEN");
    return apifyClient.listActors();
  },

  "apify.run": async (args: {
    actorId: string;
    input?: Record<string, unknown>;
    timeout?: number;
  }) => {
    if (!apifyClient) throw new Error("need:APIFY_TOKEN");
    return apifyClient.runActor(args);
  },

  "apify.getRunStatus": async (args: { runId: string }) => {
    if (!apifyClient) throw new Error("need:APIFY_TOKEN");
    return apifyClient.getRunStatus(args.runId);
  },

  "http.request": async (args: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    headers?: Record<string, string>;
    body?: unknown;
  }) => {
    return httpClient.request(args);
  },
};

const PORT = process.env.MCP_PORT || 7337;

logger.info(
  {
    port: PORT,
    tools: Object.keys(tools),
    makeEnabled: !!makeClient,
    airtableEnabled: !!airtableClient,
    apifyEnabled: !!apifyClient,
  },
  "MCP server ready"
);

// Minimal HTTP server for health check
import { createServer } from "http";

const server = createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", RUN_ID }));
    return;
  }

  if (req.url === "/tools" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { tool, args } = JSON.parse(body);
        const handler = tools[tool as keyof typeof tools];

        if (!handler) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Tool not found: ${tool}` }));
          return;
        }

        const result = await handler(args);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result }));
      } catch (error) {
        logger.error({ error }, "Tool execution failed");
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
          })
        );
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(Number(PORT), () => {
  logger.info({ port: PORT }, "HTTP server listening");
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down");
  server.close(() => process.exit(0));
});

