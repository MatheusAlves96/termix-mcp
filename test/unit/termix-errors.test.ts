import { describe, expect, it } from "vitest";
import {
  TermixApiError,
  TermixConnectionError,
  isRetryableStatus,
} from "../../src/termix/errors.js";

describe("TermixApiError", () => {
  it("carries status, code, and details, and redacts the message", () => {
    const error = new TermixApiError(500, "failed with key tmx_abcdef1234567890", {
      code: "E_BOOM",
      details: { foo: "bar" },
    });
    expect(error.name).toBe("TermixApiError");
    expect(error.status).toBe(500);
    expect(error.code).toBe("E_BOOM");
    expect(error.details).toEqual({ foo: "bar" });
    expect(error.message).toContain("REDACTED");
    expect(error.message).not.toContain("tmx_abcdef1234567890");
  });

  it("leaves code/details undefined when not given", () => {
    const error = new TermixApiError(404, "not found");
    expect(error.code).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});

describe("TermixConnectionError", () => {
  it("redacts the message and carries an optional cause", () => {
    const cause = new Error("ECONNREFUSED");
    const error = new TermixConnectionError("could not reach Bearer abcdefghijklmnop", cause);
    expect(error.name).toBe("TermixConnectionError");
    expect(error.message).toContain("REDACTED");
    expect(error.cause).toBe(cause);
  });

  it("has no cause when none is given", () => {
    const error = new TermixConnectionError("plain failure");
    expect(error.cause).toBeUndefined();
  });
});

describe("isRetryableStatus", () => {
  it("treats 502/503/504 as retryable and everything else as not", () => {
    expect(isRetryableStatus(502)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(504)).toBe(true);
    expect(isRetryableStatus(500)).toBe(false);
    expect(isRetryableStatus(404)).toBe(false);
    expect(isRetryableStatus(200)).toBe(false);
  });
});
