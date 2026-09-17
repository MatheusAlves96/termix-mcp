import type { ToolSpec } from "./types.js";
import { systemTools } from "./system.js";
import { generatedCatalog } from "./from-spec.js";

/**
 * The full tool catalog: hand-written entries (system) plus every REST
 * operation from the OpenAPI spec, shaped by `src/catalog/overrides.ts`.
 * `test/unit/catalog-coverage.test.ts` enforces that every operation in
 * `src/generated/operations.ts` has exactly one entry here.
 */
export const CATALOG: ToolSpec[] = [...systemTools, ...generatedCatalog];

const names = new Set<string>();
for (const tool of CATALOG) {
  if (names.has(tool.name)) {
    throw new Error(`Duplicate tool name in catalog: ${tool.name}`);
  }
  names.add(tool.name);
}
