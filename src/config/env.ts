import type { RawConfigInput } from "./cli.js";

function bool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value.toLowerCase() === "true" || value === "1";
}

function num(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function parseEnv(env: NodeJS.ProcessEnv): RawConfigInput {
  return {
    url: env.TERMIX_URL,
    apiKey: env.TERMIX_API_KEY,
    toolsets: env.TERMIX_TOOLSETS,
    dynamicToolsets: bool(env.TERMIX_DYNAMIC_TOOLSETS),
    readOnly: bool(env.TERMIX_READ_ONLY),
    allowDestructive: bool(env.TERMIX_ALLOW_DESTRUCTIVE),
    exposeSecrets: bool(env.TERMIX_EXPOSE_SECRETS),
    version: env.TERMIX_VERSION,
    versionCheck: bool(env.TERMIX_VERSION_CHECK),
    timeoutMs: num(env.TERMIX_TIMEOUT_MS),
    insecureTls: bool(env.TERMIX_INSECURE_TLS),
    transport: env.MCP_TRANSPORT,
    port: num(env.PORT),
    host: env.HOST,
    httpAuthToken: env.MCP_HTTP_AUTH_TOKEN,
    logLevel: env.LOG_LEVEL,
  };
}
