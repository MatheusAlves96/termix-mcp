import { describe, expect, it } from "vitest";
import { createServer } from "../../src/server.js";
import { DEFAULT_CONFIG } from "../../src/config/types.js";
import { createLogger } from "../../src/util/logger.js";
import { NEWEST_VALIDATED_VERSION } from "../../src/termix/version.js";

const silentLogger = createLogger("error");

describe("createServer", () => {
  it("requires url and apiKey", async () => {
    await expect(
      createServer({ ...DEFAULT_CONFIG, url: undefined, apiKey: undefined }, silentLogger),
    ).rejects.toThrow(/requires config.url and config.apiKey/);
  });

  it("builds a server, registry, and detected version without contacting Termix when versionCheck is false", async () => {
    const { server, registry, version } = await createServer(
      {
        ...DEFAULT_CONFIG,
        url: "https://termix.example.com",
        apiKey: "tmx_abc",
        versionCheck: false,
        toolsets: ["system"],
      },
      silentLogger,
    );
    expect(version).toBe(NEWEST_VALIDATED_VERSION);
    expect(registry.registeredToolNames()).toContain("termix_system_health");
    expect(server).toBeDefined();
  });

  it("honors an explicit version override for gating", async () => {
    const { registry } = await createServer(
      {
        ...DEFAULT_CONFIG,
        url: "https://termix.example.com",
        apiKey: "tmx_abc",
        version: "2.5.0",
        toolsets: ["system"],
      },
      silentLogger,
    );
    expect(registry.availableToolsetIds()).toContain("system");
  });
});
