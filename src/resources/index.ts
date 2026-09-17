import type { McpServer } from "@modelcontextprotocol/server";
import type { TermixClient } from "../termix/client.js";

/**
 * Cheap, read-only resources the model can pull without a tool call.
 * Kept intentionally small in Phase 1; more are added alongside the
 * toolsets they summarize (e.g. termix://hosts once the hosts catalog
 * exists) rather than guessed ahead of time.
 */
export function registerResources(server: McpServer, client: TermixClient): void {
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
}
