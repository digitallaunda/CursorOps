import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "@clients/airtable" });

const ConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseId: z.string().min(1),
});

type Config = z.infer<typeof ConfigSchema>;

export interface QueryInput {
  table: string;
  filterByFormula?: string;
  maxRecords?: number;
  view?: string;
}

export class AirtableClient {
  private config: Config;
  private baseUrl: string;

  constructor(config: Config) {
    this.config = ConfigSchema.parse(config);
    this.baseUrl = `https://api.airtable.com/v0/${this.config.baseId}`;
  }

  async query(input: QueryInput): Promise<unknown> {
    const { table, filterByFormula, maxRecords, view } = input;
    
    logger.info({ table, baseId: this.config.baseId }, "Querying Airtable");

    const params = new URLSearchParams();
    if (filterByFormula) params.set("filterByFormula", filterByFormula);
    if (maxRecords) params.set("maxRecords", maxRecords.toString());
    if (view) params.set("view", view);

    const url = `${this.baseUrl}/${encodeURIComponent(table)}?${params}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ table, status: response.status, error }, "Airtable query failed");
      throw new Error(`Airtable API error: ${response.status} ${error}`);
    }

    const result = await response.json() as { records?: unknown[] };
    logger.info({ table, recordCount: result.records?.length }, "Airtable query completed");
    return result;
  }

  async createRecord(table: string, fields: Record<string, unknown>): Promise<unknown> {
    logger.info({ table }, "Creating Airtable record");

    const url = `${this.baseUrl}/${encodeURIComponent(table)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ table, status: response.status, error }, "Airtable create failed");
      throw new Error(`Airtable API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async listBases(): Promise<unknown> {
    logger.info("Listing Airtable bases");

    const url = "https://api.airtable.com/v0/meta/bases";
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, "Airtable list bases failed");
      throw new Error(`Airtable API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async getBaseSchema(): Promise<unknown> {
    logger.info({ baseId: this.config.baseId }, "Getting Airtable base schema");

    const url = `https://api.airtable.com/v0/meta/bases/${this.config.baseId}/tables`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, "Airtable get schema failed");
      throw new Error(`Airtable API error: ${response.status} ${error}`);
    }

    return response.json();
  }
}

export function createAirtableClient(config: Config): AirtableClient {
  return new AirtableClient(config);
}

