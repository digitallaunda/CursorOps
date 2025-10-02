import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "@clients/apify" });

const ConfigSchema = z.object({
  token: z.string().min(1),
});

type Config = z.infer<typeof ConfigSchema>;

export interface RunActorInput {
  actorId: string;
  input?: Record<string, unknown>;
  timeout?: number;
  memory?: number;
}

export class ApifyClient {
  private config: Config;
  private baseUrl = "https://api.apify.com/v2";

  constructor(config: Config) {
    this.config = ConfigSchema.parse(config);
  }

  async runActor(input: RunActorInput): Promise<unknown> {
    const { actorId, input: actorInput = {}, timeout, memory } = input;
    
    logger.info({ actorId }, "Running Apify actor");

    const params = new URLSearchParams({ token: this.config.token });
    if (timeout) params.set("timeout", timeout.toString());
    if (memory) params.set("memory", memory.toString());

    const url = `${this.baseUrl}/acts/${actorId}/runs?${params}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actorInput),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ actorId, status: response.status, error }, "Apify actor run failed");
      throw new Error(`Apify API error: ${response.status} ${error}`);
    }

    const result = await response.json() as { data?: { id?: string } };
    logger.info({ actorId, runId: result.data?.id }, "Apify actor started");
    return result;
  }

  async getRunStatus(runId: string): Promise<unknown> {
    const url = `${this.baseUrl}/actor-runs/${runId}?token=${this.config.token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Apify API error: ${response.status}`);
    }

    return response.json();
  }

  async getDataset(datasetId: string): Promise<unknown> {
    const url = `${this.baseUrl}/datasets/${datasetId}/items?token=${this.config.token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Apify API error: ${response.status}`);
    }

    return response.json();
  }

  async listActors(): Promise<unknown> {
    logger.info("Listing Apify actors");

    const url = `${this.baseUrl}/acts?token=${this.config.token}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, "Apify list actors failed");
      throw new Error(`Apify API error: ${response.status} ${error}`);
    }

    return response.json();
  }
}

export function createApifyClient(config: Config): ApifyClient {
  return new ApifyClient(config);
}

