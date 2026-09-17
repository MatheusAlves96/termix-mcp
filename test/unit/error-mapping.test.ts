import { z } from "zod";
import { describe, expect, it } from "vitest";
import { toErrorResult } from "../../src/tools/error-mapping.js";
import { TermixApiError, TermixConnectionError } from "../../src/termix/errors.js";

describe("toErrorResult", () => {
  it("formats a TermixApiError with its code", () => {
    const result = toErrorResult(new TermixApiError(400, "bad input", { code: "E_BAD" }));
    expect(result.isError).toBe(true);
    expect(result.text).toBe("Termix API error 400 (E_BAD): bad input");
  });

  it("formats a TermixApiError without a code", () => {
    const result = toErrorResult(new TermixApiError(500, "boom"));
    expect(result.text).toBe("Termix API error 500: boom");
  });

  it("formats a TermixConnectionError", () => {
    const result = toErrorResult(new TermixConnectionError("unreachable"));
    expect(result.text).toBe("Could not reach Termix: unreachable");
    expect(result.isError).toBe(true);
  });

  it("formats a ZodError", () => {
    const schema = z.object({ id: z.number() });
    const parseResult = schema.safeParse({ id: "not-a-number" });
    expect(parseResult.success).toBe(false);
    if (parseResult.success) throw new Error("expected failure");
    const result = toErrorResult(parseResult.error);
    expect(result.text).toContain("Invalid input:");
    expect(result.isError).toBe(true);
  });

  it("formats a plain Error", () => {
    const result = toErrorResult(new Error("generic failure"));
    expect(result.text).toBe("Unexpected error: generic failure");
  });

  it("formats a non-Error throw", () => {
    const result = toErrorResult("just a string");
    expect(result.text).toBe("Unexpected error: just a string");
  });
});
