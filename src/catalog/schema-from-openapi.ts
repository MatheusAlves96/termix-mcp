import { z } from "zod";
import type { JsonSchema, RawOperation } from "../generated/operations.js";

/**
 * Converts the JSON-Schema subset Termix's OpenAPI spec actually uses into a
 * Zod schema. Deliberately not a general JSON-Schema-to-Zod converter: it
 * covers string/number/integer/boolean/array/object/enum, arbitrary nesting,
 * and boolean `additionalProperties`. A schema using `oneOf`/`anyOf`/`allOf`
 * (rare - three properties in the whole 2.7.1 spec) has none of those fields
 * after `scripts/generate.ts` prunes it, so it falls through to the
 * open-ended `z.record` branch below: permissive rather than wrong.
 */
export function jsonSchemaToZod(schema: JsonSchema): z.ZodTypeAny {
  let zodType: z.ZodTypeAny;

  switch (schema.type) {
    case "string":
      zodType =
        schema.enum && schema.enum.length > 0
          ? z.enum(schema.enum.map(String) as [string, ...string[]])
          : z.string();
      break;
    case "integer":
      zodType = z.number().int();
      break;
    case "number":
      zodType = z.number();
      break;
    case "boolean":
      zodType = z.boolean();
      break;
    case "array":
      zodType = z.array(schema.items ? jsonSchemaToZod(schema.items) : z.unknown());
      break;
    case "object":
      zodType = buildObjectSchema(schema);
      break;
    default:
      zodType = schema.properties ? buildObjectSchema(schema) : z.record(z.string(), z.unknown());
  }

  if (schema.nullable) zodType = zodType.nullable();
  if (schema.description) zodType = zodType.describe(schema.description);
  return zodType;
}

function buildObjectSchema(schema: JsonSchema): z.ZodTypeAny {
  if (!schema.properties) {
    return schema.additionalProperties === false ? z.object({}) : z.record(z.string(), z.unknown());
  }
  const required = new Set(schema.required ?? []);
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, propSchema] of Object.entries(schema.properties)) {
    const field = jsonSchemaToZod(propSchema);
    shape[key] = required.has(key) ? field : field.optional();
  }
  return z.object(shape);
}

export interface OperationRequest {
  pathParams: Record<string, string | number>;
  query: Record<string, string | number | boolean | undefined>;
  body: unknown;
}

export interface OperationIO {
  /** The single merged Zod object every generated tool uses as its inputSchema. */
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  /** Splits a validated tool input back into path params / query / body for TermixClient.request(). */
  toRequest: (input: Record<string, unknown>) => OperationRequest;
}

/**
 * Merges an operation's path params, query params, and request body into one
 * flat input schema (flatter tool signatures are easier for a model to fill
 * correctly than nested ones). If a body property's name collides with a
 * path/query param - not observed in the Termix 2.7.1 spec - it's exposed as
 * `body_<name>` instead of silently shadowing the param.
 */
export function buildOperationIO(op: RawOperation): OperationIO {
  const shape: Record<string, z.ZodTypeAny> = {};
  const pathParamNames: string[] = [];
  const queryParamNames: string[] = [];
  /** Maps the tool-input field name back to the real body property name. */
  const bodyFieldMap: Array<{ inputKey: string; bodyKey: string }> = [];
  let wholeBody = false;

  for (const param of op.parameters) {
    let field = jsonSchemaToZod(param.schema);
    if (param.description) field = field.describe(param.description);
    if (!param.required) field = field.optional();
    shape[param.name] = field;
    (param.in === "path" ? pathParamNames : queryParamNames).push(param.name);
  }

  if (op.requestBody) {
    if (op.requestBody.type === "object" && op.requestBody.properties) {
      const required = new Set(op.requestBody.required ?? []);
      for (const [bodyKey, propSchema] of Object.entries(op.requestBody.properties)) {
        let field = jsonSchemaToZod(propSchema);
        if (!required.has(bodyKey)) field = field.optional();
        const inputKey = bodyKey in shape ? `body_${bodyKey}` : bodyKey;
        shape[inputKey] = field;
        bodyFieldMap.push({ inputKey, bodyKey });
      }
    } else {
      wholeBody = true;
      shape.body = jsonSchemaToZod(op.requestBody);
    }
  }

  const toRequest = (input: Record<string, unknown>): OperationRequest => {
    const pathParams: Record<string, string | number> = {};
    for (const name of pathParamNames) {
      const value = input[name];
      if (value !== undefined) pathParams[name] = value as string | number;
    }

    const query: Record<string, string | number | boolean | undefined> = {};
    for (const name of queryParamNames) {
      query[name] = input[name] as string | number | boolean | undefined;
    }

    let body: unknown;
    if (wholeBody) {
      body = input.body;
    } else if (bodyFieldMap.length > 0) {
      const bodyObj: Record<string, unknown> = {};
      for (const { inputKey, bodyKey } of bodyFieldMap) {
        if (input[inputKey] !== undefined) bodyObj[bodyKey] = input[inputKey];
      }
      body = bodyObj;
    }

    return { pathParams, query, body };
  };

  return { schema: z.object(shape), toRequest };
}
