/**
 * Redacts Termix API keys (`tmx_...`) and bearer tokens from arbitrary text so
 * they never reach logs or tool error messages.
 */
const API_KEY_PATTERN = /\btmx_[a-f0-9]{10,}\b/gi;
const BEARER_PATTERN = /\b(Bearer\s+)[A-Za-z0-9._-]{10,}\b/gi;

export function redact(input: string): string {
  return input
    .replace(API_KEY_PATTERN, "tmx_***REDACTED***")
    .replace(BEARER_PATTERN, "$1***REDACTED***");
}

const SENSITIVE_KEY_PATTERN = /^(authorization|api[-_]?key|token|password|secret)$/i;

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    return redact(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEY_PATTERN.test(key) ? "***REDACTED***" : redactValue(val);
    }
    return out;
  }
  return value;
}

/** Redacts known-sensitive values recursively in an object about to be logged or surfaced in an error. */
export function redactDeep<T>(value: T): T {
  return redactValue(value) as T;
}
