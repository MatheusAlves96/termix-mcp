import type { McpServer } from "@modelcontextprotocol/server";
import { CATALOG } from "../catalog/index.js";
import type { TermixClient } from "../termix/client.js";

/**
 * Cheap, read-only resources the model can pull without a tool call. Each
 * one (other than the status resource) delegates to the matching catalog
 * tool's handler by name, so the request logic - and any future
 * BODY_SCHEMA_OVERRIDES-style fix - lives in exactly one place.
 */
export function registerResources(server: McpServer, client: TermixClient): void {
  function handlerFor(toolName: string) {
    const tool = CATALOG.find((t) => t.name === toolName);
    if (!tool) throw new Error(`registerResources: no such catalog tool "${toolName}"`);
    return tool.handler;
  }

  server.registerResource(
    "termix-status",
    "termix://system/status",
    {
      title: "Termix status",
      description: "Health and version of the connected Termix instance.",
      mimeType: "application/json",
    },
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

  const listResources: Array<{
    name: string;
    uri: string;
    title: string;
    description: string;
    tool: string;
  }> = [
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

  for (const { name, uri, title, description, tool } of listResources) {
    const handler = handlerFor(tool);
    server.registerResource(
      name,
      uri,
      { title, description, mimeType: "application/json" },
      async (readUri) => {
        const result = await handler({}, { client });
        return {
          contents: [{ uri: readUri.href, mimeType: "application/json", text: result.text }],
        };
      },
    );
  }
}
