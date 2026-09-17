import { describe, expect, it, vi } from "vitest";
import {
  detectTermixVersion,
  versionSatisfies,
  NEWEST_VALIDATED_VERSION,
} from "../../src/termix/version.js";
import { createLogger } from "../../src/util/logger.js";
import type { TermixClient } from "../../src/termix/client.js";

const silentLogger = createLogger("error");

function fakeClient(response: unknown, shouldThrow = false): TermixClient {
  return {
    request: vi
      .fn()
      .mockImplementation(() =>
        shouldThrow ? Promise.reject(new Error("boom")) : Promise.resolve(response),
      ),
  } as unknown as TermixClient;
}

describe("versionSatisfies", () => {
  it("matches everything with the default range", () => {
    expect(versionSatisfies("2.7.1", undefined, undefined)).toBe(true);
  });

  it("respects a minimum version range", () => {
    expect(versionSatisfies("2.5.0", ">=2.6.0", undefined)).toBe(false);
    expect(versionSatisfies("2.7.1", ">=2.6.0", undefined)).toBe(true);
  });

  it("excludes versions matching disabledIn even if versions would match", () => {
    expect(versionSatisfies("2.7.1", "*", ["2.7.x"])).toBe(false);
    expect(versionSatisfies("2.6.0", "*", ["2.7.x"])).toBe(true);
  });
});

describe("detectTermixVersion", () => {
  it("uses an explicit override without probing", async () => {
    const client = fakeClient({ localVersion: "9.9.9" });
    const version = await detectTermixVersion({
      client,
      override: "2.5.0",
      probe: true,
      logger: silentLogger,
    });
    expect(version).toBe("2.5.0");
    expect(client.request).not.toHaveBeenCalled();
  });

  it("rejects an invalid override", async () => {
    const client = fakeClient({});
    await expect(
      detectTermixVersion({ client, override: "not-a-version", probe: true, logger: silentLogger }),
    ).rejects.toThrow();
  });

  it("skips probing when disabled", async () => {
    const client = fakeClient({ localVersion: "2.7.1" });
    const version = await detectTermixVersion({
      client,
      override: undefined,
      probe: false,
      logger: silentLogger,
    });
    expect(version).toBe(NEWEST_VALIDATED_VERSION);
    expect(client.request).not.toHaveBeenCalled();
  });

  it("probes /version?checkRemote=false and parses the response", async () => {
    const client = fakeClient({ localVersion: "2.7.1" });
    const version = await detectTermixVersion({
      client,
      override: undefined,
      probe: true,
      logger: silentLogger,
    });
    expect(version).toBe("2.7.1");
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", path: "/version", query: { checkRemote: "false" } }),
    );
  });

  it("falls back to the newest validated version if the probe fails", async () => {
    const client = fakeClient(undefined, true);
    const version = await detectTermixVersion({
      client,
      override: undefined,
      probe: true,
      logger: silentLogger,
    });
    expect(version).toBe(NEWEST_VALIDATED_VERSION);
  });
});
