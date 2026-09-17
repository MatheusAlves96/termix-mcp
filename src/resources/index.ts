import type { McpServer } from "@modelcontextprotocol/server";
import { CATALOG } from "../catalog/index.js";
import type { TermixClient } from "../termix/client.js";

export interface ResourceDef {
  name: string;
  uri: string;
  title: string;
  description: string;
  /** Catalog tool this resource delegates to. Omitted only for termix-status, which aggregates two raw endpoints directly. */
  tool?: string;
}

/**
 * Cheap, read-only resources the model can pull without a tool call.
 * Exported as data (not just registered inline) so `scripts/inventory.ts`
 * can document these in TOOLSETS.md from the same source `registerResources`
 * reads from - one list, so the docs can't silently drift from what's
 * actually registered. Each one (other than termix-status) delegates to the
 * matching catalog tool's handler by name, so the request logic - and any
 * future BODY_SCHEMA_OVERRIDES-style fix - lives in exactly one place.
 */
export const RESOURCE_DEFS: ResourceDef[] = [
  {
    name: "termix-status",
    uri: "termix://system/status",
    title: "Termix status",
    description: "Health and version of the connected Termix instance.",
  },
  {
    name: "termix-hosts",
    uri: "termix://hosts",
    title: "SSH hosts",
    description: "Every SSH host configured in Termix.",
    tool: "termix_hosts_get_all_ssh_hosts",
  },
  {
    name: "termix-snippets",
    uri: "termix://snippets",
    title: "Command snippets",
    description: "Every saved command snippet.",
    tool: "termix_snippets_get_all_snippets",
  },
  {
    name: "termix-fleets",
    uri: "termix://fleets",
    title: "Fleets",
    description: "The current user's fleets (grouped hosts).",
    tool: "termix_fleets_list_current_users_fleets",
  },
  {
    name: "termix-host-status",
    uri: "termix://hosts/status",
    title: "Host statuses",
    description: "Live status for every monitored host.",
    tool: "termix_metrics_get_all_host_statuses",
  },
];

export function registerResources(server: McpServer, client: TermixClient): void {
  function handlerFor(toolName: string) {
    const tool = CATALOG.find((t) => t.name === toolName);
    if (!tool) throw new Error(`registerResources: no such catalog tool "${toolName}"`);
    return tool.handler;
  }

  for (const def of RESOURCE_DEFS) {
    if (!def.tool) {
      // termix-status: aggregates /health and /version directly, no single backing tool.
      server.registerResource(
        def.name,
        def.uri,
        { title: def.title, description: def.description, mimeType: "application/json" },
        async (uri) => {
          const [health, version] = await Promise.all([
            client
              .request({ method: "GET", path: "/health" })
              .catch((error: unknown) => ({ error: String(error) })),
            client
              .request({ method: "GET", path: "/version", query: { checkRemote: "false" } })
              .catch((error: unknown) => ({ error: String(error) })),
          ]);
          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ health, version }, null, 2),
              },
            ],
          };
        },
      );
      continue;
    }

    const handler = handlerFor(def.tool);
    server.registerResource(
      def.name,
      def.uri,
      { title: def.title, description: def.description, mimeType: "application/json" },
      async (readUri) => {
        const result = await handler({}, { client });
        return {
          contents: [{ uri: readUri.href, mimeType: "application/json", text: result.text }],
        };
      },
    );
  }
}
