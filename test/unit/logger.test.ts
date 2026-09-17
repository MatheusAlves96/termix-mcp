import { afterEach, describe, expect, it, vi } from "vitest";
import { createLogger } from "../../src/util/logger.js";

function captureStderr() {
  const lines: string[] = [];
  const spy = vi.spyOn(process.stderr, "write").mockImplementation((chunk: unknown) => {
    lines.push(String(chunk));
    return true;
  });
  return { lines, spy };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createLogger", () => {
  it("defaults to info level for an unknown/undefined level", () => {
    const { lines } = captureStderr();
    const logger = createLogger(undefined);
    logger.debug("hidden");
    logger.info("shown");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("INFO shown");
  });

  it("falls back to info for a garbage level string", () => {
    const { lines } = captureStderr();
    const logger = createLogger("not-a-level");
    logger.warn("warn line");
    logger.debug("dropped");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("WARN warn line");
  });

  it("respects the debug threshold and includes redacted meta", () => {
    const { lines } = captureStderr();
    const logger = createLogger("debug");
    logger.debug("with meta", { apiKey: "tmx_abcdef1234567890" });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("DEBUG with meta");
    expect(lines[0]).toContain("REDACTED");
    expect(lines[0]).not.toContain("tmx_abcdef1234567890");
  });

  it("suppresses everything below the error threshold", () => {
    const { lines } = captureStderr();
    const logger = createLogger("error");
    logger.warn("nope");
    logger.info("nope");
    logger.debug("nope");
    logger.error("yes");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("ERROR yes");
  });
});
