import { describe, expect, it } from "vitest";
import { buildOperationIO, jsonSchemaToZod } from "../../src/catalog/schema-from-openapi.js";
import type { RawOperation } from "../../src/generated/operations.js";

describe("jsonSchemaToZod", () => {
  it("converts primitives", () => {
    expect(jsonSchemaToZod({ type: "string" }).parse("x")).toBe("x");
    expect(jsonSchemaToZod({ type: "boolean" }).parse(true)).toBe(true);
    expect(jsonSchemaToZod({ type: "number" }).parse(1.5)).toBe(1.5);
  });

  it("rejects a non-integer for an integer schema", () => {
    expect(() => jsonSchemaToZod({ type: "integer" }).parse(1.5)).toThrow();
    expect(jsonSchemaToZod({ type: "integer" }).parse(2)).toBe(2);
  });

  it("converts an enum to a Zod enum, coercing values to strings", () => {
    const schema = jsonSchemaToZod({ type: "string", enum: ["a", "b"] });
    expect(schema.parse("a")).toBe("a");
    expect(() => schema.parse("c")).toThrow();
  });

  it("converts arrays with typed items", () => {
    const schema = jsonSchemaToZod({ type: "array", items: { type: "integer" } });
    expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
    expect(() => schema.parse(["x"])).toThrow();
  });

  it("converts nested objects, marking non-required fields optional", () => {
    const schema = jsonSchemaToZod({
      type: "object",
      required: ["name"],
      properties: { name: { type: "string" }, age: { type: "integer" } },
    });
    expect(schema.parse({ name: "a" })).toEqual({ name: "a" });
    expect(() => schema.parse({ age: 1 })).toThrow();
  });

  it("falls back to a permissive record for a property-less object", () => {
    const schema = jsonSchemaToZod({ type: "object" });
    expect(schema.parse({ anything: 1, goes: "here" })).toEqual({ anything: 1, goes: "here" });
  });

  it("makes a schema with additionalProperties: false accept only an empty object", () => {
    const schema = jsonSchemaToZod({ type: "object", additionalProperties: false });
    expect(schema.parse({})).toEqual({});
  });

  it("marks a nullable schema as accepting null", () => {
    const schema = jsonSchemaToZod({ type: "string", nullable: true });
    expect(schema.parse(null)).toBeNull();
  });
});

function op(overrides: Partial<RawOperation>): RawOperation {
  return {
    operationKey: "GET /example/{id}",
    method: "GET",
    path: "/example/{id}",
    tag: "Example",
    summary: "Example",
    parameters: [],
    ...overrides,
  };
}

describe("buildOperationIO", () => {
  it("routes a path param into pathParams", () => {
    const { schema, toRequest } = buildOperationIO(
      op({ parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] }),
    );
    const input = schema.parse({ id: "42" });
    expect(toRequest(input).pathParams).toEqual({ id: "42" });
  });

  it("routes an optional query param into query, omitting it when absent", () => {
    const { schema, toRequest } = buildOperationIO(
      op({
        parameters: [{ name: "page", in: "query", required: false, schema: { type: "integer" } }],
      }),
    );
    expect(toRequest(schema.parse({})).query).toEqual({ page: undefined });
    expect(toRequest(schema.parse({ page: 2 })).query).toEqual({ page: 2 });
  });

  it("flattens a JSON object request body into top-level fields", () => {
    const { schema, toRequest } = buildOperationIO(
      op({
        method: "POST",
        requestBody: {
          type: "object",
          required: ["name"],
          properties: { name: { type: "string" }, enabled: { type: "boolean" } },
        },
      }),
    );
    const input = schema.parse({ name: "x", enabled: true });
    expect(toRequest(input).body).toEqual({ name: "x", enabled: true });
  });

  it("omits an optional, unset body field from the outgoing request rather than sending undefined", () => {
    const { schema, toRequest } = buildOperationIO(
      op({
        method: "POST",
        requestBody: { type: "object", properties: { name: { type: "string" } } },
      }),
    );
    expect(toRequest(schema.parse({}))).toEqual(expect.objectContaining({ body: {} }));
  });

  it("prefixes a body field that collides with a path/query param name", () => {
    const { schema, toRequest } = buildOperationIO(
      op({
        method: "POST",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { type: "object", properties: { id: { type: "string" } } },
      }),
    );
    const input = schema.parse({ id: "path-id", body_id: "body-id" });
    const request = toRequest(input);
    expect(request.pathParams).toEqual({ id: "path-id" });
    expect(request.body).toEqual({ id: "body-id" });
  });

  it("wraps a non-object request body under a single 'body' field", () => {
    const { schema, toRequest } = buildOperationIO(
      op({ method: "POST", requestBody: { type: "array", items: { type: "string" } } }),
    );
    const input = schema.parse({ body: ["a", "b"] });
    expect(toRequest(input).body).toEqual(["a", "b"]);
  });
});
