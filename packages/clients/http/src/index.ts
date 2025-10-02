import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "@clients/http" });

const RequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  body: z.unknown().optional(),
  timeout: z.number().optional(),
});

export type HttpRequest = z.infer<typeof RequestSchema>;

export class HttpClient {
  async request(input: HttpRequest): Promise<unknown> {
    const validated = RequestSchema.parse(input);
    const { method, url, headers = {}, body, timeout = 30000 } = validated;

    logger.info({ method, url }, "HTTP request");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        logger.error({ method, url, status: response.status, error }, "HTTP request failed");
        throw new Error(`HTTP error: ${response.status} ${error}`);
      }

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      logger.info({ method, url, status: response.status }, "HTTP request completed");
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        logger.error({ method, url, timeout }, "HTTP request timeout");
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }
}

export function createHttpClient(): HttpClient {
  return new HttpClient();
}

