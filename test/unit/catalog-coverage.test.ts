import { describe, expect, it } from "vitest";
import { OPERATIONS } from "../../src/generated/operations.js";
import { TAG_TO_TOOLSET } from "../../src/catalog/overrides.js";
import { CATALOG } from "../../src/catalog/index.js";
import { generatedCatalog } from "../../src/catalog/from-spec.js";
import { TOOLSET_IDS } from "../../src/catalog/toolsets.js";

describe("catalog coverage", () => {
  it("has exactly one catalog entry per spec operation", () => {
    expect(generatedCatalog.length).toBe(OPERATIONS.length);
  });

  it("maps every spec operation's tag to a known toolset", () => {
    const tags = new Set(OPERATIONS.map((op) => op.tag));
    const missing = [...tags].filter((tag) => !TAG_TO_TOOLSET[tag]);
    expect(missing).toEqual([]);
  });

  it("gives every generated tool the exact operation it was built from", () => {
    const byKey = new Map(
      generatedCatalog.map((tool) => [`${tool.operation.method} ${tool.operation.path}`, tool]),
    );
    for (const op of OPERATIONS) {
      expect(byKey.has(op.operationKey)).toBe(true);
    }
    expect(byKey.size).toBe(OPERATIONS.length);
  });

  it("has no duplicate tool names across the whole catalog", () => {
    const names = CATALOG.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("only assigns tools to known toolsets", () => {
    const unknown = CATALOG.filter((tool) => !TOOLSET_IDS.includes(tool.toolset));
    expect(unknown).toEqual([]);
  });

  it("requires a reason whenever a tool is not exposed", () => {
    const missingReason = CATALOG.filter((tool) => tool.exposed === false && !tool.exposedReason);
    expect(missingReason.map((t) => t.name)).toEqual([]);
  });

  it("keeps every input schema parseable (flat Zod object tool signatures)", () => {
    for (const tool of CATALOG) {
      expect(typeof tool.inputSchema.parse).toBe("function");
      expect(() => tool.inputSchema.parse({})).not.toThrow(TypeError);
    }
  });
});
