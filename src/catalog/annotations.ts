import type { ToolAnnotations } from "@modelcontextprotocol/server";
import type { HttpMethod } from "../termix/client.js";
import type { Risk } from "./types.js";

/**
 * Derives sensible default MCP tool annotations from the HTTP method and risk
 * level. These are hints for the client UI, not security controls (the real
 * gate is `risk` + the TERMIX_READ_ONLY/ALLOW_DESTRUCTIVE/EXPOSE_SECRETS
 * flags in `src/tools/register.ts`) — they can be refined per-tool in
 * `src/catalog/overrides.ts` when the default guess is wrong.
 */
export function defaultAnnotations(method: HttpMethod, risk: Risk): ToolAnnotations {
  const readOnlyHint = method === "GET";
  return {
    readOnlyHint,
    destructiveHint: risk === "destructive",
    idempotentHint: method === "GET" || method === "PUT" || method === "DELETE",
    openWorldHint: true,
  };
}
