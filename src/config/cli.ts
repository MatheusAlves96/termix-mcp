/** Partial, string-only view of ResolvedConfig, as produced by parsing argv or a JSON config file. */
export interface RawConfigInput {
  url?: string;
  apiKey?: string;
  toolsets?: string; // comma-separated, or "all"
  dynamicToolsets?: boolean;
  readOnly?: boolean;
  allowDestructive?: boolean;
  exposeSecrets?: boolean;
  version?: string;
  versionCheck?: boolean;
  timeoutMs?: number;
  insecureTls?: boolean;
  transport?: string;
  port?: number;
  host?: string;
  httpAuthToken?: string;
  logLevel?: string;
  printTools?: boolean;
  configPath?: string;
}

const FLAG_SPECS: Array<{
  flag: string;
  key: keyof RawConfigInput;
  kind: "string" | "boolean" | "number";
}> = [
  { flag: "--url", key: "url", kind: "string" },
  { flag: "--api-key", key: "apiKey", kind: "string" },
  { flag: "--toolsets", key: "toolsets", kind: "string" },
  { flag: "--dynamic-toolsets", key: "dynamicToolsets", kind: "boolean" },
  { flag: "--read-only", key: "readOnly", kind: "boolean" },
  { flag: "--allow-destructive", key: "allowDestructive", kind: "boolean" },
  { flag: "--expose-secrets", key: "exposeSecrets", kind: "boolean" },
  { flag: "--version", key: "version", kind: "string" },
  { flag: "--no-version-check", key: "versionCheck", kind: "boolean" },
  { flag: "--timeout-ms", key: "timeoutMs", kind: "number" },
  { flag: "--insecure-tls", key: "insecureTls", kind: "boolean" },
  { flag: "--transport", key: "transport", kind: "string" },
  { flag: "--port", key: "port", kind: "number" },
  { flag: "--host", key: "host", kind: "string" },
  { flag: "--http-auth-token", key: "httpAuthToken", kind: "string" },
  { flag: "--log-level", key: "logLevel", kind: "string" },
  { flag: "--print-tools", key: "printTools", kind: "boolean" },
  { flag: "--config", key: "configPath", kind: "string" },
];

/** Parses CLI flags into a RawConfigInput. Unknown flags are ignored (forward-compatible with new MCP client wrappers passing extra args). */
export function parseArgv(argv: string[]): RawConfigInput {
  const out: RawConfigInput = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const spec = FLAG_SPECS.find((s) => s.flag === arg);
    if (!spec) continue;

    if (spec.kind === "boolean") {
      const negated = spec.flag.startsWith("--no-");
      (out as Record<string, unknown>)[spec.key] = !negated;
      continue;
    }

    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) continue;
    i++;
    if (spec.kind === "number") {
      const parsed = Number(next);
      if (!Number.isNaN(parsed)) (out as Record<string, unknown>)[spec.key] = parsed;
    } else {
      (out as Record<string, unknown>)[spec.key] = next;
    }
  }
  return out;
}
