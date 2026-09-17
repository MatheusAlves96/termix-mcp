import type { McpServer, RegisteredTool } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { ResolvedConfig } from "../config/types.js";
import { TOOLSET_DEFS, resolveEnabledToolsets, isToolsetId } from "../catalog/toolsets.js";
import type { ToolSpec, ToolsetId } from "../catalog/types.js";
import type { TermixClient } from "../termix/client.js";
import { versionSatisfies } from "../termix/version.js";
import type { Logger } from "../util/logger.js";
import { toErrorResult } from "./error-mapping.js";

export interface GatingReason {
  tool: string;
  reason: string;
}

/** Tools that pass exposure, safety, and version gating - independent of which toolsets are selected. */
export function filterGatedCatalog(
  catalog: ToolSpec[],
  options: {
    version: string;
    readOnly: boolean;
    allowDestructive: boolean;
    exposeSecrets: boolean;
  },
): { eligible: ToolSpec[]; excluded: GatingReason[] } {
  const eligible: ToolSpec[] = [];
  const excluded: GatingReason[] = [];

  for (const tool of catalog) {
    if (tool.exposed === false) {
      excluded.push({ tool: tool.name, reason: tool.exposedReason ?? "not exposed" });
      continue;
    }
    if (!versionSatisfies(options.version, tool.versions, tool.disabledIn)) {
      excluded.push({ tool: tool.name, reason: `unavailable in Termix ${options.version}` });
      continue;
    }
    if (options.readOnly && tool.risk !== "read") {
      excluded.push({ tool: tool.name, reason: "TERMIX_READ_ONLY is set" });
      continue;
    }
    if (tool.risk === "destructive" && !options.allowDestructive) {
      excluded.push({ tool: tool.name, reason: "requires TERMIX_ALLOW_DESTRUCTIVE=true" });
      continue;
    }
    if (tool.risk === "secret" && !options.exposeSecrets) {
      excluded.push({ tool: tool.name, reason: "requires TERMIX_EXPOSE_SECRETS=true" });
      continue;
    }
    eligible.push(tool);
  }

  return { eligible, excluded };
}

function groupByToolset(tools: ToolSpec[]): Map<ToolsetId, ToolSpec[]> {
  const map = new Map<ToolsetId, ToolSpec[]>();
  for (const tool of tools) {
    const list = map.get(tool.toolset) ?? [];
    list.push(tool);
    map.set(tool.toolset, list);
  }
  return map;
}

/**
 * Registers `ToolSpec`s (already gating-filtered) onto an `McpServer`, and
 * tracks which toolsets are currently live so dynamic mode can enable more
 * without double-registering.
 */
export class ToolRegistry {
  private readonly server: McpServer;
  private readonly client: TermixClient;
  private readonly byToolset: Map<ToolsetId, ToolSpec[]>;
  private readonly registered = new Map<string, RegisteredTool>();
  readonly enabledToolsets = new Set<ToolsetId>();

  constructor(server: McpServer, client: TermixClient, eligibleTools: ToolSpec[]) {
    this.server = server;
    this.client = client;
    this.byToolset = groupByToolset(eligibleTools);
  }

  availableToolsetIds(): ToolsetId[] {
    return [...this.byToolset.keys()];
  }

  toolCountFor(id: ToolsetId): number {
    return this.byToolset.get(id)?.length ?? 0;
  }

  /** Registers every eligible tool in a toolset that isn't already registered. Returns how many were newly added. */
  registerToolset(id: ToolsetId): number {
    const tools = this.byToolset.get(id) ?? [];
    let added = 0;
    for (const tool of tools) {
      if (this.registered.has(tool.name)) continue;
      const registered = this.server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: tool.annotations,
        },
        async (input: unknown) => {
          try {
            const result = await tool.handler(input, { client: this.client });
            return {
              content: [{ type: "text" as const, text: result.text }],
              isError: result.isError ?? false,
            };
          } catch (error) {
            const mapped = toErrorResult(error);
            return { content: [{ type: "text" as const, text: mapped.text }], isError: true };
          }
        },
      );
      this.registered.set(tool.name, registered);
      added++;
    }
    this.enabledToolsets.add(id);
    return added;
  }

  registeredToolNames(): string[] {
    return [...this.registered.keys()];
  }
}

const enableToolsetInput = z.object({
  toolset: z.string().describe("The toolset id to enable, from termix_list_toolsets."),
});

/**
 * Wires up the catalog onto the server according to `config`: either the
 * selected toolsets register immediately, or (dynamic mode) only two
 * meta-tools register and the model enables toolsets as it needs them.
 */
export function setupTools(options: {
  server: McpServer;
  client: TermixClient;
  catalog: ToolSpec[];
  config: ResolvedConfig;
  version: string;
  logger: Logger;
}): ToolRegistry {
  const { server, client, catalog, config, version, logger } = options;
  const { eligible, excluded } = filterGatedCatalog(catalog, {
    version,
    readOnly: config.readOnly,
    allowDestructive: config.allowDestructive,
    exposeSecrets: config.exposeSecrets,
  });
  logger.debug(
    `${eligible.length} of ${catalog.length} catalog tools are eligible for this configuration.`,
    {
      excludedCount: excluded.length,
    },
  );

  const registry = new ToolRegistry(server, client, eligible);

  if (config.dynamicToolsets) {
    server.registerTool(
      "termix_list_toolsets",
      {
        title: "List Termix toolsets",
        description:
          "Lists every Termix toolset, whether it's currently enabled, and how many tools it contains. Call termix_enable_toolset to turn one on.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      () => {
        const lines = TOOLSET_DEFS.filter((def) => registry.toolCountFor(def.id) > 0).map((def) => {
          const enabled = registry.enabledToolsets.has(def.id) ? "enabled" : "disabled";
          return `${def.id} (${enabled}, ${registry.toolCountFor(def.id)} tools) - ${def.description}`;
        });
        return { content: [{ type: "text" as const, text: lines.join("\n") }] };
      },
    );

    server.registerTool(
      "termix_enable_toolset",
      {
        title: "Enable a Termix toolset",
        description:
          "Registers every tool in the given Termix toolset so it can be called. Safe to call more than once.",
        inputSchema: enableToolsetInput,
        annotations: { readOnlyHint: false, openWorldHint: false },
      },
      ({ toolset }) => {
        if (!isToolsetId(toolset) || registry.toolCountFor(toolset) === 0) {
          return {
            content: [{ type: "text" as const, text: `Unknown or empty toolset: ${toolset}` }],
            isError: true,
          };
        }
        const added = registry.registerToolset(toolset);
        server.sendToolListChanged();
        return {
          content: [
            {
              type: "text" as const,
              text: `Enabled toolset "${toolset}": ${added} new tool(s) registered (${registry.toolCountFor(toolset)} total in this toolset).`,
            },
          ],
        };
      },
    );

    return registry;
  }

  const enabledIds = resolveEnabledToolsets(config.toolsets);
  for (const id of enabledIds) {
    registry.registerToolset(id);
  }
  logger.info(
    `Registered ${registry.registeredToolNames().length} tools across ${enabledIds.size} toolset(s).`,
  );
  return registry;
}
