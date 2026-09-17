#!/usr/bin/env tsx
/**
 * Regenerates the "Available Tools, Resources, and Prompts" section of
 * README.md from the live catalog, resources, and prompts
 * (src/catalog/index.ts, src/resources/index.ts, src/prompts/index.ts). Run
 * after any of those change and commit the result - CI checks this section
 * is up to date (see .github/workflows/ci.yml) and fails the build if it
 * isn't, so a stale doc can't merge.
 *
 * The generated block replaces everything between the
 * <!-- GENERATED:TOOLS-RESOURCES-PROMPTS:START --> and
 * <!-- GENERATED:TOOLS-RESOURCES-PROMPTS:END --> markers in README.md;
 * nothing outside those markers is touched.
 */
import { readFile, writeFile } from "node:fs/promises";
import { CATALOG } from "../src/catalog/index.js";
import { TOOLSET_DEFS } from "../src/catalog/toolsets.js";
import type { ToolSpec, ToolsetId } from "../src/catalog/types.js";
import { RESOURCE_DEFS } from "../src/resources/index.js";
import { PROMPT_DEFS } from "../src/prompts/index.js";

const START_MARKER = "<!-- GENERATED:TOOLS-RESOURCES-PROMPTS:START -->";
const END_MARKER = "<!-- GENERATED:TOOLS-RESOURCES-PROMPTS:END -->";
const README_PATH = "README.md";

function renderTool(tool: ToolSpec): string {
  const status = tool.exposed === false ? `not exposed - ${tool.exposedReason}` : tool.risk;
  return `| \`${tool.name}\` | ${tool.operation.method} \`${tool.operation.path}\` | ${status} | ${tool.title} |`;
}

function renderBlock(): string {
  const byToolset = new Map<ToolsetId, ToolSpec[]>();
  for (const tool of CATALOG) {
    const list = byToolset.get(tool.toolset) ?? [];
    list.push(tool);
    byToolset.set(tool.toolset, list);
  }

  const exposedCount = CATALOG.filter((t) => t.exposed !== false).length;

  const lines: string[] = [
    `${CATALOG.length} operations total, ${exposedCount} exposed as tools, ${CATALOG.length - exposedCount} intentionally not exposed (see reasons below).`,
    "",
    "### Tools",
    "",
    "| Toolset | Default | Tools | Description |",
    "| --- | --- | --- | --- |",
  ];

  for (const def of TOOLSET_DEFS) {
    const count = byToolset.get(def.id)?.length ?? 0;
    if (count === 0) continue;
    lines.push(
      `| [\`${def.id}\`](#${def.id}) | ${def.defaultEnabled ? "on" : "off"} | ${count} | ${def.description} |`,
    );
  }

  for (const def of TOOLSET_DEFS) {
    const tools = byToolset.get(def.id);
    if (!tools || tools.length === 0) continue;
    lines.push(
      "",
      `#### ${def.id}`,
      "",
      `${def.description} Enabled by default: **${def.defaultEnabled ? "yes" : "no"}**.`,
      "",
    );
    lines.push("| Tool | Operation | Risk | Summary |", "| --- | --- | --- | --- |");
    for (const tool of [...tools].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(renderTool(tool));
    }
  }

  lines.push(
    "",
    "### Resources",
    "",
    "Cheap, read-only context the model can pull without a tool call. Every one except `termix-status`",
    "delegates to the matching tool listed, so it's covered by the same fixes/tests as that tool.",
    "",
    "| URI | Title | Description | Backing tool |",
    "| --- | --- | --- | --- |",
  );
  for (const resource of RESOURCE_DEFS) {
    lines.push(
      `| \`${resource.uri}\` | ${resource.title} | ${resource.description} | ${resource.tool ? `\`${resource.tool}\`` : "_(aggregates /health + /version directly)_"} |`,
    );
  }

  lines.push(
    "",
    "### Prompts",
    "",
    "Conversation starters: each returns static text naming which tools to call and in what order. The",
    "model still decides based on what it actually finds at each step - these aren't scripted workflows.",
    "",
    "| Prompt | Description |",
    "| --- | --- |",
  );
  for (const prompt of PROMPT_DEFS) {
    lines.push(`| \`${prompt.name}\` | ${prompt.description} |`);
  }

  return lines.join("\n");
}

async function main(): Promise<void> {
  const readme = await readFile(README_PATH, "utf-8");
  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(
      `README.md is missing the ${START_MARKER} / ${END_MARKER} markers - add them where the generated section belongs.`,
    );
  }

  const before = readme.slice(0, startIdx + START_MARKER.length);
  const after = readme.slice(endIdx);
  const block = renderBlock();
  const updated = `${before}\n\n${block}\n\n${after}`;

  await writeFile(README_PATH, updated, "utf-8");
  console.error(
    `Updated README.md's generated section (${CATALOG.length} tools across ${byToolsetCount(CATALOG)} toolsets, ${RESOURCE_DEFS.length} resources, ${PROMPT_DEFS.length} prompts)`,
  );
}

function byToolsetCount(catalog: ToolSpec[]): number {
  return new Set(catalog.map((t) => t.toolset)).size;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
