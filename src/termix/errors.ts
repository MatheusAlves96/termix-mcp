import { redact } from "../util/redact.js";

/** An error response returned by the Termix API itself (any 4xx/5xx with a JSON or text body). */
export class TermixApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(status: number, message: string, options?: { code?: string; details?: unknown }) {
    super(redact(message));
    this.name = "TermixApiError";
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

/** The request could not be completed at all: DNS, TLS, connection refused, or a timeout. */
export class TermixConnectionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(redact(message), cause !== undefined ? { cause } : undefined);
    this.name = "TermixConnectionError";
  }
}

export function isRetryableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}
