import { describe, expect, it } from "vitest";
import { ConfigError, loadConfig } from "../../src/config/load.js";

const BASE_ENV = {};

describe("loadConfig", () => {
  it("requires url and apiKey unless printTools is set", () => {
    expect(() => loadConfig([], BASE_ENV)).toThrow(ConfigError);
    expect(() => loadConfig(["--print-tools"], BASE_ENV)).not.toThrow();
  });

  it("resolves from environment variables", () => {
    const config = loadConfig([], {
      TERMIX_URL: "https://termix.example.com/",
      TERMIX_API_KEY: "tmx_abc",
    });
    expect(config.url).toBe("https://termix.example.com"); // trailing slash stripped
    expect(config.apiKey).toBe("tmx_abc");
    expect(config.toolsets).toBe("default");
    expect(config.readOnly).toBe(false);
  });

  it("CLI flags override environment variables", () => {
    const config = loadConfig(["--url", "https://cli.example.com", "--read-only"], {
      TERMIX_URL: "https://env.example.com",
      TERMIX_API_KEY: "tmx_env",
    });
    expect(config.url).toBe("https://cli.example.com");
    expect(config.readOnly).toBe(true);
  });

  it("read-only forces off destructive and secret access even if those flags are set", () => {
    const config = loadConfig([], {
      TERMIX_URL: "https://termix.example.com",
      TERMIX_API_KEY: "tmx_abc",
      TERMIX_READ_ONLY: "true",
      TERMIX_ALLOW_DESTRUCTIVE: "true",
      TERMIX_EXPOSE_SECRETS: "true",
    });
    expect(config.allowDestructive).toBe(false);
    expect(config.exposeSecrets).toBe(false);
  });

  it("parses a comma-separated toolset list", () => {
    const config = loadConfig([], {
      TERMIX_URL: "https://termix.example.com",
      TERMIX_API_KEY: "tmx_abc",
      TERMIX_TOOLSETS: "hosts, credentials",
    });
    expect(config.toolsets).toEqual(["hosts", "credentials"]);
  });

  it("rejects an invalid URL", () => {
    expect(() => loadConfig([], { TERMIX_URL: "not-a-url", TERMIX_API_KEY: "tmx_abc" })).toThrow(
      ConfigError,
    );
  });

  it("rejects an invalid transport", () => {
    expect(() =>
      loadConfig([], {
        TERMIX_URL: "https://termix.example.com",
        TERMIX_API_KEY: "tmx_abc",
        MCP_TRANSPORT: "carrier-pigeon",
      }),
    ).toThrow(ConfigError);
  });
});
