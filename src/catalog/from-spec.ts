import { OPERATIONS, type RawOperation } from "../generated/operations.js";
import { defaultAnnotations } from "./annotations.js";
import {
  BODY_SCHEMA_OVERRIDES,
  DESCRIPTION_NOTES,
  NOT_EXPOSED,
  RISK_OVERRIDES,
  TAG_TO_TOOLSET,
  TOOLSET_OVERRIDES,
} from "./overrides.js";
import { buildOperationIO } from "./schema-from-openapi.js";
import type { Risk, ToolSpec, ToolsetId } from "./types.js";

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "for",
  "to",
  "of",
  "by",
  "with",
  "from",
  "on",
  "in",
  "and",
  "or",
  "this",
  "that",
  "into",
]);

function toSlug(text: string, maxWords: number): string {
  const words = text
    .toLowerCase()
    .replace(/'s\b/g, "s") // "user's" -> "users", not "user_s"
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
  return words.slice(0, maxWords).join("_");
}

/** Long-running Termix operations that need more than the client's default timeout. */
const LONG_RUNNING_TAGS = new Set(["Fleets", "Host Metrics", "Proxmox Stats"]);
const LONG_TIMEOUT_MS = 120_000;

/** revoke/rotate/reset/"clear all" reads as destructive even on a non-DELETE method (see overrides.ts docs). */
const DESTRUCTIVE_SUMMARY_PATTERN = /\b(revoke|rotate|reset|clear all)\b/i;

function defaultRisk(op: RawOperation): Risk {
  if (op.method === "DELETE") return "destructive";
  if (op.method === "GET") return "read";
  if (DESTRUCTIVE_SUMMARY_PATTERN.test(op.summary)) return "destructive";
  return "write";
}

function resolveToolset(op: RawOperation): ToolsetId {
  const override = TOOLSET_OVERRIDES[op.operationKey];
  if (override) return override;
  const fromTag = TAG_TO_TOOLSET[op.tag];
  if (!fromTag) {
    throw new Error(
      `No toolset mapping for OpenAPI tag "${op.tag}" (operation ${op.operationKey}). ` +
        "Add it to TAG_TO_TOOLSET in src/catalog/overrides.ts.",
    );
  }
  return fromTag;
}

function deriveName(op: RawOperation, toolset: ToolsetId, seen: Set<string>): string {
  const toolsetPart = toolset.replace(/-/g, "_");
  // "termix-id" would otherwise stutter into "termix_termix_id_...".
  const prefix = toolsetPart.startsWith("termix") ? toolsetPart : `termix_${toolsetPart}`;
  const slug = toSlug(op.summary, 6);
  let name = `${prefix}_${slug}`;
  let suffix = 2;
  while (seen.has(name)) {
    name = `${prefix}_${slug}_${suffix}`;
    suffix++;
  }
  seen.add(name);
  return name;
}

function buildToolFromOperation(op: RawOperation, seenNames: Set<string>): ToolSpec {
  const toolset = resolveToolset(op);
  const name = deriveName(op, toolset, seenNames);
  const bodyOverride = BODY_SCHEMA_OVERRIDES[op.operationKey];
  const { schema, toRequest } = buildOperationIO(
    bodyOverride ? { ...op, requestBody: bodyOverride } : op,
  );
  const risk = RISK_OVERRIDES[op.operationKey] ?? defaultRisk(op);
  const notExposedReason = NOT_EXPOSED[op.operationKey];
  const timeoutMs = LONG_RUNNING_TAGS.has(op.tag) ? LONG_TIMEOUT_MS : undefined;
  const baseDescription = op.description ? `${op.summary}. ${op.description}` : op.summary;
  const note = DESCRIPTION_NOTES[op.operationKey];

  return {
    name,
    toolset,
    operation: { method: op.method, path: op.path },
    title: op.summary,
    description: note ? `${baseDescription} ${note}` : baseDescription,
    inputSchema: schema,
    risk,
    annotations: defaultAnnotations(op.method, risk),
    exposed: notExposedReason ? false : true,
    ...(notExposedReason ? { exposedReason: notExposedReason } : {}),
    ...(timeoutMs ? { timeoutMs } : {}),
    handler: async (input, { client }) => {
      const request = toRequest(input as Record<string, unknown>);
      const result = await client.request({
        method: op.method,
        path: op.path,
        pathParams: request.pathParams,
        query: request.query,
        ...(request.body !== undefined ? { body: request.body } : {}),
        ...(timeoutMs ? { timeoutMs } : {}),
      });
      return { text: typeof result === "string" ? result : JSON.stringify(result) };
    },
  };
}

const seenNames = new Set<string>();
export const generatedCatalog: ToolSpec[] = OPERATIONS.map((op) =>
  buildToolFromOperation(op, seenNames),
);
