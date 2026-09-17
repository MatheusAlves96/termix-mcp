import { describe, expect, it } from "vitest";
import { OPERATIONS } from "../../src/generated/operations.js";
import { BODY_SCHEMA_OVERRIDES, NOT_EXPOSED } from "../../src/catalog/overrides.js";

/**
 * Tracks operations whose merged input schema currently has no body-carrying
 * field despite being a write method - see KNOWN_LIMITATIONS.md. This is a
 * regression guard, not a correctness check: it fails if the count changes,
 * so a fix (good) or a newly-introduced gap (bad) both get noticed instead
 * of silently drifting. Update KNOWN_LIMITATIONS.md and this count together.
 */
const KNOWN_GAP_COUNT = 34;

describe("known request-body gaps", () => {
  it("has the expected number of write operations with no body schema", () => {
    const gaps = OPERATIONS.filter((op) => {
      if (op.method === "GET" || op.method === "DELETE") return false;
      if (BODY_SCHEMA_OVERRIDES[op.operationKey]) return false;
      if (NOT_EXPOSED[op.operationKey]) return false;
      return !op.requestBody;
    });
    expect(gaps.length).toBe(KNOWN_GAP_COUNT);
  });
});
