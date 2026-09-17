export type Transport = "stdio" | "http";
export type LogLevelName = "error" | "warn" | "info" | "debug";

/**
 * `toolsets` is kept as the raw selector here; turning it into an actual set of
 * enabled toolset ids is `resolveEnabledToolsets()` in `src/catalog/toolsets.ts`,
 * since only the catalog module knows which toolsets exist and which are
 * "default". Config itself has no opinion on that.
 */
export type ToolsetSelector = "default" | "all" | string[];

export interface ResolvedConfig {
  /** Base URL of the Termix instance. Required unless `printTools` is set. */
  url: string | undefined;
  /** Termix API key (`tmx_...`). Required unless `printTools` is set. */
  apiKey: string | undefined;
  toolsets: ToolsetSelector;
  dynamicToolsets: boolean;
  readOnly: boolean;
  allowDestructive: boolean;
  exposeSecrets: boolean;
  /** Forces the Termix version used for gating instead of probing `/version`. */
  version: string | undefined;
  versionCheck: boolean;
  timeoutMs: number;
  insecureTls: boolean;
  transport: Transport;
  port: number;
  host: string;
  httpAuthToken: string | undefined;
  logLevel: LogLevelName;
  /** When true, the process prints the effective catalog and exits without connecting to Termix. */
  printTools: boolean;
}

export const DEFAULT_CONFIG: ResolvedConfig = {
  url: undefined,
  apiKey: undefined,
  toolsets: "default",
  dynamicToolsets: false,
  readOnly: false,
  allowDestructive: false,
  exposeSecrets: false,
  version: undefined,
  versionCheck: true,
  timeoutMs: 30_000,
  insecureTls: false,
  transport: "stdio",
  port: 3000,
  host: "127.0.0.1",
  httpAuthToken: undefined,
  logLevel: "info",
  printTools: false,
};
