import { describe, expect, it } from "vitest";
import {
  TOOLSET_DEFS,
  TOOLSET_IDS,
  isToolsetId,
  resolveEnabledToolsets,
} from "../../src/catalog/toolsets.js";

describe("isToolsetId", () => {
  it("recognizes known ids and rejects unknown ones", () => {
    expect(isToolsetId("hosts")).toBe(true);
    expect(isToolsetId("not-a-toolset")).toBe(false);
  });
});

describe("resolveEnabledToolsets", () => {
  it("'all' resolves to every known toolset id", () => {
    expect(resolveEnabledToolsets("all")).toEqual(new Set(TOOLSET_IDS));
  });

  it("'default' resolves to only the defaultEnabled toolsets", () => {
    const resolved = resolveEnabledToolsets("default");
    const expected = new Set(TOOLSET_DEFS.filter((t) => t.defaultEnabled).map((t) => t.id));
    expect(resolved).toEqual(expected);
    expect(resolved.has("system")).toBe(true);
    expect(resolved.has("admin")).toBe(false);
  });

  it("resolves an explicit array of valid ids", () => {
    expect(resolveEnabledToolsets(["hosts", "credentials"])).toEqual(
      new Set(["hosts", "credentials"]),
    );
  });

  it("throws for unknown ids in an explicit array", () => {
    expect(() => resolveEnabledToolsets(["hosts", "bogus"])).toThrow(/Unknown toolset\(s\): bogus/);
  });
});
