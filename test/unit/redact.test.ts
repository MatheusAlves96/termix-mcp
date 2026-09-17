import { describe, expect, it } from "vitest";
import { redact, redactDeep } from "../../src/util/redact.js";

describe("redact", () => {
  it("redacts a Termix API key", () => {
    expect(redact("token is tmx_deadbeef1234567890")).toBe("token is tmx_***REDACTED***");
  });

  it("redacts a bearer token", () => {
    expect(redact("Authorization: Bearer abcdefghijklmnop")).toBe(
      "Authorization: Bearer ***REDACTED***",
    );
  });

  it("leaves unrelated text untouched", () => {
    expect(redact("hello world")).toBe("hello world");
  });
});

describe("redactDeep", () => {
  it("redacts sensitive keys regardless of value shape", () => {
    const input = { apiKey: "tmx_secret", nested: { password: "hunter2", ok: "fine" } };
    expect(redactDeep(input)).toEqual({
      apiKey: "***REDACTED***",
      nested: { password: "***REDACTED***", ok: "fine" },
    });
  });

  it("redacts API keys found inside plain string values", () => {
    const input = { message: "failed with tmx_deadbeef1234567890" };
    expect(redactDeep(input)).toEqual({ message: "failed with tmx_***REDACTED***" });
  });

  it("recurses into arrays", () => {
    expect(redactDeep([{ token: "x".repeat(20) }])).toEqual([{ token: "***REDACTED***" }]);
  });
});
