import { z } from "zod";
import { defineTool } from "./types.js";
import type { ToolSpec } from "./types.js";

export const systemTools: ToolSpec[] = [
  defineTool({
    name: "termix_system_health",
    toolset: "system",
    operation: { method: "GET", path: "/health" },
    title: "Termix health check",
    description: "Checks whether the Termix backend is up and responding.",
    inputSchema: z.object({}),
    risk: "read",
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async (_input, { client }) => {
      const result = await client.request<{ status: string }>({ method: "GET", path: "/health" });
      return { text: JSON.stringify(result) };
    },
  }),

  defineTool({
    name: "termix_system_version",
    toolset: "system",
    operation: { method: "GET", path: "/version" },
    title: "Get Termix version",
    description:
      "Returns the Termix instance's local version. Does not contact GitHub for update checks.",
    inputSchema: z.object({}),
    risk: "read",
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async (_input, { client }) => {
      const result = await client.request({
        method: "GET",
        path: "/version",
        query: { checkRemote: "false" },
      });
      return { text: JSON.stringify(result) };
    },
  }),

  defineTool({
    name: "termix_system_releases",
    toolset: "system",
    operation: { method: "GET", path: "/releases/rss" },
    title: "List Termix releases",
    description: "Lists recent Termix releases from GitHub, as seen by the Termix backend.",
    inputSchema: z.object({
      page: z.number().int().positive().optional().describe("Page number, 1-based."),
      perPage: z.number().int().positive().max(100).optional().describe("Results per page."),
    }),
    risk: "read",
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async (input, { client }) => {
      const result = await client.request({
        method: "GET",
        path: "/releases/rss",
        query: { page: input.page, per_page: input.perPage },
      });
      return { text: JSON.stringify(result) };
    },
  }),
];
