import { Agent, fetch as undiciFetch } from "undici";
import type { Logger } from "../util/logger.js";
import { TermixApiError, TermixConnectionError, isRetryableStatus } from "./errors.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Structural response shape used instead of the global `Response` type:
 * Node's built-in `fetch` and the separately installed `undici` package
 * (needed for the insecure-TLS `Agent`) ship distinct, nominally
 * incompatible `Response`/`FormData`/`File` type trees, even though both
 * satisfy this shape at runtime.
 */
interface MinimalResponse {
  readonly ok: boolean;
  readonly status: number;
  readonly headers: { get(name: string): string | null };
  json(): Promise<unknown>;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  /** Values for `{param}` placeholders in `path`. */
  pathParams?: Record<string, string | number>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  /** Overrides the client's default timeout for this one call (some Termix endpoints run long, e.g. fleet execute). */
  timeoutMs?: number;
  /** Set for endpoints that return a non-JSON body (file downloads, CSV export, RSS). */
  responseType?: "json" | "text" | "arrayBuffer";
}

export interface TermixClientOptions {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  insecureTls: boolean;
  logger: Logger;
  fetchImpl?: typeof fetch;
}

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

function substitutePath(
  path: string,
  pathParams: Record<string, string | number> | undefined,
): string {
  if (!pathParams) return path;
  let result = path;
  for (const [key, value] of Object.entries(pathParams)) {
    result = result.replace(`{${key}}`, encodeURIComponent(String(value)));
  }
  return result;
}

function buildQueryString(query: RequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Thin HTTP client for the Termix REST API: auth header, timeouts, retry on
 * transient upstream errors, and consistent error mapping. Knows nothing
 * about MCP or the tool catalog.
 */
export class TermixClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly logger: Logger;
  private readonly fetchImpl: typeof fetch;
  private readonly dispatcher: Agent | undefined;

  constructor(options: TermixClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs;
    this.logger = options.logger;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.dispatcher = options.insecureTls
      ? new Agent({ connect: { rejectUnauthorized: false } })
      : undefined;
    if (options.insecureTls) {
      this.logger.warn("TLS certificate validation is disabled (TERMIX_INSECURE_TLS=true).");
    }
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const path = substitutePath(options.path, options.pathParams);
    const url = `${this.baseUrl}${path}${buildQueryString(options.query)}`;
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;

    let attempt = 0;
    for (;;) {
      attempt++;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        };
        if (options.body !== undefined) headers["Content-Type"] = "application/json";

        const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;

        // The insecure-TLS escape hatch bypasses `globalThis.fetch` (and therefore
        // any fetch-level test interception) because it needs undici's `Agent` to
        // turn off certificate validation; the default, tested path below always
        // goes through `this.fetchImpl` (`globalThis.fetch` unless overridden).
        const response: MinimalResponse = this.dispatcher
          ? await undiciFetch(url, {
              method: options.method,
              headers,
              body,
              signal: controller.signal,
              dispatcher: this.dispatcher,
            })
          : await this.fetchImpl(url, {
              method: options.method,
              headers,
              body,
              signal: controller.signal,
            });

        if (!response.ok) {
          if (isRetryableStatus(response.status) && attempt <= MAX_RETRIES) {
            await sleep(RETRY_BASE_DELAY_MS * attempt);
            continue;
          }
          throw await this.toApiError(response);
        }

        return (await this.parseBody(response, options.responseType)) as T;
      } catch (error) {
        if (error instanceof TermixApiError) throw error;
        if (controller.signal.aborted) {
          throw new TermixConnectionError(
            `Request to ${options.method} ${path} timed out after ${timeoutMs}ms`,
          );
        }
        if (attempt <= MAX_RETRIES && this.isNetworkError(error)) {
          await sleep(RETRY_BASE_DELAY_MS * attempt);
          continue;
        }
        throw new TermixConnectionError(
          `Could not reach Termix at ${this.baseUrl}: ${(error as Error).message}`,
          error,
        );
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  private isNetworkError(error: unknown): boolean {
    const code =
      (error as { cause?: { code?: string }; code?: string })?.cause?.code ??
      (error as { code?: string })?.code;
    return (
      code === "ECONNREFUSED" ||
      code === "ECONNRESET" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN"
    );
  }

  private async parseBody(
    response: MinimalResponse,
    responseType: RequestOptions["responseType"],
  ): Promise<unknown> {
    if (responseType === "text") return response.text();
    if (responseType === "arrayBuffer") return response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "";
    if (response.status === 204 || !contentType.includes("application/json")) {
      const text = await response.text();
      return text.length > 0 ? text : null;
    }
    return response.json();
  }

  private async toApiError(response: MinimalResponse): Promise<TermixApiError> {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      try {
        body = await response.text();
      } catch {
        body = undefined;
      }
    }
    const message =
      (typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : undefined) ??
      (typeof body === "string" && body.length > 0 ? body : undefined) ??
      `Termix responded with HTTP ${response.status}`;
    const code =
      typeof body === "object" && body !== null && "code" in body && typeof body.code === "string"
        ? body.code
        : undefined;
    return new TermixApiError(response.status, message, { code, details: body });
  }
}
