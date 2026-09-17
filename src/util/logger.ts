import { redact } from "./redact.js";

export type LogLevel = "error" | "warn" | "info" | "debug";

const LEVELS: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

export interface Logger {
  error(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

function isLogLevel(value: string): value is LogLevel {
  return value === "error" || value === "warn" || value === "info" || value === "debug";
}

/**
 * Every log line goes to stderr, never stdout: on the stdio transport, stdout
 * is the JSON-RPC channel, and writing a log line to it would corrupt the
 * protocol stream from the client's point of view.
 */
export function createLogger(levelInput: string | undefined): Logger {
  const level: LogLevel = levelInput && isLogLevel(levelInput) ? levelInput : "info";
  const threshold = LEVELS[level];

  function write(msgLevel: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (LEVELS[msgLevel] > threshold) return;
    const timestamp = new Date().toISOString();
    const safeMessage = redact(message);
    const line = meta
      ? `${timestamp} ${msgLevel.toUpperCase()} ${safeMessage} ${redact(JSON.stringify(meta))}`
      : `${timestamp} ${msgLevel.toUpperCase()} ${safeMessage}`;
    process.stderr.write(line + "\n");
  }

  return {
    error: (message, meta) => write("error", message, meta),
    warn: (message, meta) => write("warn", message, meta),
    info: (message, meta) => write("info", message, meta),
    debug: (message, meta) => write("debug", message, meta),
  };
}
