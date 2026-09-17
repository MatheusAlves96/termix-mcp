import type { ZodType, ZodTypeAny } from "zod";
import type { ToolAnnotations } from "@modelcontextprotocol/server";
import type { HttpMethod } from "../termix/client.js";
import type { TermixClient } from "../termix/client.js";

export type Risk = "read" | "write" | "destructive" | "secret";

export type ToolsetId =
  | "system"
  | "hosts"
  | "credentials"
  | "snippets"
  | "fleets"
  | "metrics"
  | "docker"
  | "files"
  | "tunnels"
  | "automations"
  | "alerts"
  | "audit"
  | "session-logs"
  | "proxmox"
  | "tailscale"
  | "terminal-history"
  | "network-topology"
  | "termix-id"
  | "vault"
  | "session-sharing"
  | "guacamole"
  | "admin"
  | "account"
  | "ui-state"
  | "homepage"
  | "ai"
  | "sync"
  | "sessions";

export interface ToolOperation {
  method: HttpMethod;
  /** The spec's path template, e.g. "/host/db/host/{id}". */
  path: string;
}

/** The context a tool handler receives to call Termix. */
export interface ToolContext {
  client: TermixClient;
}

export type ToolHandler<Input> = (input: Input, ctx: ToolContext) => Promise<ToolResult>;

export interface ToolResult {
  /** Plain-text or JSON-stringified content shown to the model. */
  text: string;
  isError?: boolean;
}

export interface ToolSpec<Input extends ZodTypeAny = ZodTypeAny> {
  /** MCP tool name, e.g. "termix_hosts_get". Must be unique across the whole catalog. */
  name: string;
  toolset: ToolsetId;
  operation: ToolOperation;
  title: string;
  description: string;
  inputSchema: Input;
  risk: Risk;
  annotations?: Partial<ToolAnnotations>;
  /** Semver range this tool is available in. Default "*" (all versions). */
  versions?: string;
  /** Semver ranges this tool is explicitly unavailable in, even if `versions` would otherwise match. */
  disabledIn?: string[];
  /** false = kept in the catalog (and coverage tests) but never registered as an MCP tool. */
  exposed?: boolean;
  /** Required when exposed is false: why this operation isn't offered as a tool. */
  exposedReason?: string;
  /** Set for tools that need a managed file-manager/docker/metrics session keyed by hostId. */
  session?: "file-manager" | "docker" | "metrics";
  /** Per-tool timeout override, for the handful of Termix endpoints that are known to run long. */
  timeoutMs?: number;
  handler: ToolHandler<unknown>;
}

type InferOutput<T extends ZodTypeAny> = T extends ZodType<infer Output> ? Output : never;

/** Narrows the handler's input type from the schema, for ergonomic authoring of catalog entries. */
export function defineTool<Input extends ZodTypeAny>(
  spec: Omit<ToolSpec<Input>, "handler"> & { handler: ToolHandler<InferOutput<Input>> },
): ToolSpec<Input> {
  return spec as ToolSpec<Input>;
}
