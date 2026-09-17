import { readFileSync } from "node:fs";
import { z } from "zod";
import { parseArgv, type RawConfigInput } from "./cli.js";
import { parseEnv } from "./env.js";
import { DEFAULT_CONFIG, type ResolvedConfig, type ToolsetSelector } from "./types.js";

export class ConfigError extends Error {}

const configFileSchema = z
  .object({
    url: z.string().url().optional(),
    toolsets: z.union([z.literal("all"), z.literal("default"), z.array(z.string())]).optional(),
    dynamicToolsets: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    allowDestructive: z.boolean().optional(),
    exposeSecrets: z.boolean().optional(),
    version: z.string().optional(),
    versionCheck: z.boolean().optional(),
    timeoutMs: z.number().int().positive().optional(),
    insecureTls: z.boolean().optional(),
    transport: z.enum(["stdio", "http"]).optional(),
    port: z.number().int().positive().optional(),
    host: z.string().optional(),
    httpAuthToken: z.string().optional(),
    logLevel: z.enum(["error", "warn", "info", "debug"]).optional(),
  })
  .partial();

function readConfigFile(path: string | undefined): Partial<RawConfigInput> {
  if (!path) return {};
  let raw: string;
  try {
    raw = readFileSync(path, "utf-8");
  } catch (error) {
    throw new ConfigError(`Could not read config file at ${path}: ${(error as Error).message}`);
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    throw new ConfigError(`Config file at ${path} is not valid JSON: ${(error as Error).message}`);
  }
  const parsed = configFileSchema.safeParse(json);
  if (!parsed.success) {
    throw new ConfigError(`Config file at ${path} is invalid: ${parsed.error.message}`);
  }
  return {
    ...parsed.data,
    toolsets: Array.isArray(parsed.data.toolsets)
      ? parsed.data.toolsets.join(",")
      : parsed.data.toolsets,
  };
}

function parseToolsetSelector(value: string | undefined): ToolsetSelector | undefined {
  if (value === undefined) return undefined;
  if (value === "all" || value === "default") return value;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function merge(...layers: RawConfigInput[]): RawConfigInput {
  const out: RawConfigInput = {};
  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer)) {
      if (value !== undefined) (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

/**
 * Resolves configuration with precedence: CLI flags > environment variables >
 * config file > built-in defaults. `url`/`apiKey` are required unless
 * `printTools` ends up true (any layer can set it) — printing the catalog
 * never needs to reach a real Termix instance.
 */
export function loadConfig(argv: string[], env: NodeJS.ProcessEnv): ResolvedConfig {
  const cli = parseArgv(argv);
  const fromFile = readConfigFile(cli.configPath ?? env.TERMIX_MCP_CONFIG);
  const fromEnv = parseEnv(env);
  const merged = merge(fromFile, fromEnv, cli);

  const printTools = merged.printTools ?? DEFAULT_CONFIG.printTools;

  if (!printTools) {
    if (!merged.url) throw new ConfigError("TERMIX_URL (or --url) is required.");
    if (!merged.apiKey) throw new ConfigError("TERMIX_API_KEY (or --api-key) is required.");
  }

  if (merged.url) {
    try {
      new URL(merged.url);
    } catch {
      throw new ConfigError(`TERMIX_URL is not a valid URL: ${merged.url}`);
    }
  }

  const transport = merged.transport ?? DEFAULT_CONFIG.transport;
  if (transport !== "stdio" && transport !== "http") {
    throw new ConfigError(`MCP_TRANSPORT must be "stdio" or "http", got: ${transport}`);
  }

  const logLevel = merged.logLevel ?? DEFAULT_CONFIG.logLevel;
  if (!["error", "warn", "info", "debug"].includes(logLevel)) {
    throw new ConfigError(`LOG_LEVEL must be one of error|warn|info|debug, got: ${logLevel}`);
  }

  const readOnly = merged.readOnly ?? DEFAULT_CONFIG.readOnly;

  return {
    url: merged.url ? merged.url.replace(/\/+$/, "") : undefined,
    apiKey: merged.apiKey,
    toolsets: parseToolsetSelector(merged.toolsets) ?? DEFAULT_CONFIG.toolsets,
    dynamicToolsets: merged.dynamicToolsets ?? DEFAULT_CONFIG.dynamicToolsets,
    readOnly,
    // read-only takes precedence: a read-only server never gains destructive or secret tools
    allowDestructive: readOnly
      ? false
      : (merged.allowDestructive ?? DEFAULT_CONFIG.allowDestructive),
    exposeSecrets: readOnly ? false : (merged.exposeSecrets ?? DEFAULT_CONFIG.exposeSecrets),
    version: merged.version,
    versionCheck: merged.versionCheck ?? DEFAULT_CONFIG.versionCheck,
    timeoutMs: merged.timeoutMs ?? DEFAULT_CONFIG.timeoutMs,
    insecureTls: merged.insecureTls ?? DEFAULT_CONFIG.insecureTls,
    transport,
    port: merged.port ?? DEFAULT_CONFIG.port,
    host: merged.host ?? DEFAULT_CONFIG.host,
    httpAuthToken: merged.httpAuthToken,
    logLevel: logLevel as ResolvedConfig["logLevel"],
    printTools,
  };
}
