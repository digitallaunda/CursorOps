import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "@clients/make" });

const ConfigSchema = z.object({
  apiToken: z.string().min(1),
  zone: z.string().default("eu2.make.com"),
  teamId: z.string().optional(),
  organizationId: z.string().optional(),
});

type Config = z.infer<typeof ConfigSchema>;

export interface RunScenarioInput {
  scenarioId: string;
  inputs?: Record<string, unknown>;
}

export class MakeClient {
  private config: Config;
  private baseUrl: string;

  constructor(config: Config) {
    this.config = ConfigSchema.parse(config);
    this.baseUrl = `https://${this.config.zone}/api/v2`;
  }

  async runScenario(input: RunScenarioInput): Promise<unknown> {
    const { scenarioId, inputs = {} } = input;
    
    logger.info({ scenarioId }, "Running Make scenario");

    const url = `${this.baseUrl}/scenarios/${scenarioId}/run`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Token ${this.config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ scenarioId, status: response.status, error }, "Make scenario failed");
      throw new Error(`Make API error: ${response.status} ${error}`);
    }

    const result = await response.json();
    logger.info({ scenarioId }, "Make scenario completed");
    return result;
  }

  async listScenarios(): Promise<unknown> {
    logger.info({ teamId: this.config.teamId, organizationId: this.config.organizationId }, "Listing Make scenarios");

    const params = new URLSearchParams();
    // Prefer organizationId over teamId (newer API)
    if (this.config.organizationId) {
      params.set("organizationId", this.config.organizationId);
    } else if (this.config.teamId) {
      params.set("teamId", this.config.teamId);
    }

    const url = `${this.baseUrl}/scenarios?${params}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Token ${this.config.apiToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, "Make list scenarios failed");
      throw new Error(`Make API error: ${response.status} ${error}`);
    }

    return response.json();
  }
}

export function createMakeClient(config: Config): MakeClient {
  return new MakeClient(config);
}

