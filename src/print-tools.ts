import { CATALOG } from "./catalog/index.js";
import { resolveEnabledToolsets } from "./catalog/toolsets.js";
import type { ToolsetId } from "./catalog/types.js";
import type { ResolvedConfig } from "./config/types.js";
import { NEWEST_VALIDATED_VERSION } from "./termix/version.js";
import { filterGatedCatalog } from "./tools/register.js";

/**
 * Renders the effective tool catalog for a config, without contacting
 * Termix. If no version is forced, assumes the newest validated version and
 * says so, since printing the catalog shouldn't require a live instance.
 */
export function renderToolCatalog(config: ResolvedConfig): string {
  const version = config.version ?? NEWEST_VALIDATED_VERSION;
  const versionNote = config.version
    ? `forced via --version/TERMIX_VERSION`
    : `no version forced or detected; showing the catalog for ${NEWEST_VALIDATED_VERSION} (newest validated)`;

  const { eligible, excluded } = filterGatedCatalog(CATALOG, {
    version,
    readOnly: config.readOnly,
    allowDestructive: config.allowDestructive,
    exposeSecrets: config.exposeSecrets,
  });

  const enabledToolsets: Set<ToolsetId> = config.dynamicToolsets
    ? new Set<ToolsetId>()
    : resolveEnabledToolsets(config.toolsets);
  const lines: string[] = [];
  lines.push(`termix-mcp effective catalog (Termix ${version}, ${versionNote})`);
  lines.push(
    config.dynamicToolsets
      ? "Mode: dynamic toolsets (only meta-tools register at startup)"
      : `Toolsets: ${[...enabledToolsets].join(", ")}`,
  );
  lines.push("");

  const byToolset = new Map<ToolsetId, typeof eligible>();
  for (const tool of eligible) {
    const list = byToolset.get(tool.toolset) ?? [];
    list.push(tool);
    byToolset.set(tool.toolset, list);
  }

  for (const [toolset, tools] of [...byToolset.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const willRegister = config.dynamicToolsets || enabledToolsets.has(toolset);
    lines.push(
      `## ${toolset} (${tools.length} tool(s), ${willRegister ? "registers now" : "available, not selected"})`,
    );
    for (const tool of tools) {
      lines.push(`  - ${tool.name} [${tool.risk}] ${tool.operation.method} ${tool.operation.path}`);
    }
    lines.push("");
  }

  if (excluded.length > 0) {
    lines.push(`## Excluded (${excluded.length})`);
    for (const item of excluded) {
      lines.push(`  - ${item.tool}: ${item.reason}`);
    }
  }

  return lines.join("\n");
}
