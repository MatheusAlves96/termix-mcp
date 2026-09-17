#!/usr/bin/env tsx
/**
 * Reads a committed OpenAPI spec (specs/termix-<version>.openapi.json) and
 * regenerates src/generated/operations.ts: a flat, typed list of every REST
 * operation the spec documents. Converting that into actual Zod schemas
 * happens at runtime (src/catalog/schema-from-openapi.ts) so this script
 * only needs to serialize plain JSON Schema, not code-generate Zod calls.
 *
 * Usage: tsx scripts/generate.ts [--version 2.7.1]
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;
type HttpMethodLower = (typeof HTTP_METHODS)[number];

function arg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  const value = idx !== -1 ? process.argv[idx + 1] : undefined;
  return value ?? fallback;
}

interface OpenApiSchema {
  type?: string;
  format?: string;
  enum?: unknown[];
  items?: OpenApiSchema;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  description?: string;
  nullable?: boolean;
  default?: unknown;
  additionalProperties?: boolean | OpenApiSchema;
  [key: string]: unknown;
}

interface OpenApiParameter {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  schema?: OpenApiSchema;
}

interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: OpenApiSchema }>;
  };
}

interface OpenApiSpec {
  paths: Record<string, Partial<Record<HttpMethodLower, OpenApiOperation>>>;
}

/** Keeps only the JSON Schema fields src/catalog/schema-from-openapi.ts understands. */
function pruneSchema(schema: OpenApiSchema | undefined): OpenApiSchema | undefined {
  if (!schema) return undefined;
  const out: OpenApiSchema = {};
  if (schema.type) out.type = schema.type;
  if (schema.format) out.format = schema.format;
  if (schema.enum) out.enum = schema.enum;
  if (schema.description) out.description = schema.description;
  if (schema.nullable) out.nullable = schema.nullable;
  if (schema.default !== undefined) out.default = schema.default;
  if (schema.items) out.items = pruneSchema(schema.items);
  if (schema.properties) {
    out.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, pruneSchema(value)]),
    ) as Record<string, OpenApiSchema>;
  }
  if (schema.required) out.required = schema.required;
  if (typeof schema.additionalProperties === "object") {
    out.additionalProperties = pruneSchema(schema.additionalProperties);
  } else if (typeof schema.additionalProperties === "boolean") {
    out.additionalProperties = schema.additionalProperties;
  }
  return out;
}

interface RawParam {
  name: string;
  in: "path" | "query";
  required: boolean;
  schema: OpenApiSchema;
  description?: string;
}

interface RawOperation {
  operationKey: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  tag: string;
  summary: string;
  description?: string;
  parameters: RawParam[];
  requestBody?: OpenApiSchema;
}

async function main(): Promise<void> {
  const version = arg("version", "2.7.1");
  const specPath = path.join("specs", `termix-${version}.openapi.json`);
  const spec = JSON.parse(await readFile(specPath, "utf-8")) as OpenApiSpec;

  const operations: RawOperation[] = [];

  for (const [routePath, methods] of Object.entries(spec.paths)) {
    for (const method of HTTP_METHODS) {
      const op = methods[method];
      if (!op) continue;

      const upperMethod = method.toUpperCase() as RawOperation["method"];
      const parameters: RawParam[] = (op.parameters ?? [])
        .filter((p) => p.in === "path" || p.in === "query")
        .map((p) => ({
          name: p.name,
          in: p.in as "path" | "query",
          required: p.required ?? false,
          schema: pruneSchema(p.schema) ?? { type: "string" },
          ...(p.description ? { description: p.description } : {}),
        }));

      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;

      operations.push({
        operationKey: `${upperMethod} ${routePath}`,
        method: upperMethod,
        path: routePath,
        tag: op.tags?.[0] ?? "General",
        summary: op.summary ?? `${upperMethod} ${routePath}`,
        ...(op.description ? { description: op.description } : {}),
        parameters,
        ...(bodySchema ? { requestBody: pruneSchema(bodySchema) } : {}),
      });
    }
  }

  operations.sort((a, b) => a.operationKey.localeCompare(b.operationKey));

  const header = `// GENERATED FILE - do not edit by hand.
// Regenerate with: npm run spec:generate -- --version ${version}
// Source: specs/termix-${version}.openapi.json (${operations.length} operations)

export interface JsonSchema {
  type?: "string" | "number" | "integer" | "boolean" | "array" | "object";
  format?: string;
  enum?: unknown[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  description?: string;
  nullable?: boolean;
  default?: unknown;
  additionalProperties?: boolean | JsonSchema;
}

export interface RawParam {
  name: string;
  in: "path" | "query";
  required: boolean;
  schema: JsonSchema;
  description?: string;
}

export interface RawOperation {
  operationKey: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  tag: string;
  summary: string;
  description?: string;
  parameters: RawParam[];
  requestBody?: JsonSchema;
}

export const TERMIX_SPEC_VERSION = ${JSON.stringify(version)};

export const OPERATIONS: RawOperation[] = `;

  const outPath = path.join("src", "generated", "operations.ts");
  await writeFile(outPath, header + JSON.stringify(operations, null, 2) + ";\n", "utf-8");
  console.error(`Wrote ${outPath} (${operations.length} operations from ${specPath})`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
