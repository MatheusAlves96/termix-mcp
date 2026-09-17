import { z } from "zod";
import { describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/server";
import { filterGatedCatalog, setupTools, ToolRegistry } from "../../src/tools/register.js";
import type { ToolSpec } from "../../src/catalog/types.js";
import type { TermixClient } from "../../src/termix/client.js";
import { createLogger } from "../../src/util/logger.js";
import { DEFAULT_CONFIG } from "../../src/config/types.js";
import { TermixApiError } from "../../src/termix/errors.js";

const silentLogger = createLogger("error");

function tool(overrides: Partial<ToolSpec> & { name: string }): ToolSpec {
  return {
    toolset: "system",
    operation: { method: "GET", path: "/x" },
    title: overrides.name,
    description: "test tool",
    inputSchema: z.object({}),
    risk: "read",
    handler: async () => ({ text: "ok" }),
    ...overrides,
  };
}

interface FakeRegistration {
  meta: unknown;
  handler: (input: unknown) => unknown;
}

function fakeServer() {
  const registered = new Map<string, FakeRegistration>();
  const server = {
    registerTool: vi.fn((name: string, meta: unknown, handler: (input: unknown) => unknown) => {
      const registration = { meta, handler };
      registered.set(name, registration);
      return registration;
    }),
    sendToolListChanged: vi.fn(),
  };
  return { server: server as unknown as McpServer, registered, raw: server };
}

describe("filterGatedCatalog", () => {
  const baseOptions = {
    version: "2.7.0",
    readOnly: false,
    allowDestructive: false,
    exposeSecrets: false,
  };

  it("excludes tools marked exposed: false, with their reason", () => {
    const catalog = [tool({ name: "hidden", exposed: false, exposedReason: "internal only" })];
    const { eligible, excluded } = filterGatedCatalog(catalog, baseOptions);
    expect(eligible).toEqual([]);
    expect(excluded).toEqual([{ tool: "hidden", reason: "internal only" }]);
  });

  it("falls back to a default reason when exposedReason is missing", () => {
    const catalog = [tool({ name: "hidden", exposed: false })];
    const { excluded } = filterGatedCatalog(catalog, baseOptions);
    expect(excluded[0]).toEqual({ tool: "hidden", reason: "not exposed" });
  });

  it("excludes tools whose version range doesn't match", () => {
    const catalog = [tool({ name: "new-only", versions: ">=3.0.0" })];
    const { eligible, excluded } = filterGatedCatalog(catalog, baseOptions);
    expect(eligible).toEqual([]);
    expect(excluded[0]!.reason).toBe("unavailable in Termix 2.7.0");
  });

  it("excludes non-read tools when readOnly is set", () => {
    const catalog = [tool({ name: "writer", risk: "write" })];
    const { eligible, excluded } = filterGatedCatalog(catalog, { ...baseOptions, readOnly: true });
    expect(eligible).toEqual([]);
    expect(excluded[0]!.reason).toBe("TERMIX_READ_ONLY is set");
  });

  it("excludes destructive tools unless allowDestructive is set", () => {
    const catalog = [tool({ name: "danger", risk: "destructive" })];
    expect(filterGatedCatalog(catalog, baseOptions).eligible).toEqual([]);
    expect(
      filterGatedCatalog(catalog, { ...baseOptions, allowDestructive: true }).eligible,
    ).toHaveLength(1);
  });

  it("excludes secret tools unless exposeSecrets is set", () => {
    const catalog = [tool({ name: "vault", risk: "secret" })];
    expect(filterGatedCatalog(catalog, baseOptions).eligible).toEqual([]);
    expect(
      filterGatedCatalog(catalog, { ...baseOptions, exposeSecrets: true }).eligible,
    ).toHaveLength(1);
  });

  it("keeps a plain read tool eligible", () => {
    const catalog = [tool({ name: "healthy" })];
    const { eligible, excluded } = filterGatedCatalog(catalog, baseOptions);
    expect(eligible.map((t) => t.name)).toEqual(["healthy"]);
    expect(excluded).toEqual([]);
  });
});

describe("ToolRegistry", () => {
  it("groups tools by toolset and reports counts", () => {
    const { server } = fakeServer();
    const registry = new ToolRegistry(server, {} as TermixClient, [
      tool({ name: "a", toolset: "hosts" }),
      tool({ name: "b", toolset: "hosts" }),
      tool({ name: "c", toolset: "credentials" }),
    ]);
    expect(new Set(registry.availableToolsetIds())).toEqual(new Set(["hosts", "credentials"]));
    expect(registry.toolCountFor("hosts")).toBe(2);
    expect(registry.toolCountFor("credentials")).toBe(1);
    expect(registry.toolCountFor("docker")).toBe(0);
  });

  it("registers each tool once, even across repeated calls", () => {
    const { server, raw } = fakeServer();
    const registry = new ToolRegistry(server, {} as TermixClient, [
      tool({ name: "a", toolset: "hosts" }),
      tool({ name: "b", toolset: "hosts" }),
    ]);
    expect(registry.registerToolset("hosts")).toBe(2);
    expect(registry.registerToolset("hosts")).toBe(0);
    expect(raw.registerTool).toHaveBeenCalledTimes(2);
    expect(registry.registeredToolNames().sort()).toEqual(["a", "b"]);
    expect(registry.enabledToolsets.has("hosts")).toBe(true);
  });

  it("marks a toolset enabled even if it has no tools", () => {
    const { server } = fakeServer();
    const registry = new ToolRegistry(server, {} as TermixClient, []);
    expect(registry.registerToolset("hosts")).toBe(0);
    expect(registry.enabledToolsets.has("hosts")).toBe(true);
  });

  it("wraps a successful handler result as non-error content", async () => {
    const { server, registered } = fakeServer();
    const registry = new ToolRegistry(server, {} as TermixClient, [
      tool({ name: "ok-tool", handler: async () => ({ text: "all good" }) }),
    ]);
    registry.registerToolset("system");
    const outcome = (await registered.get("ok-tool")!.handler({})) as {
      content: { type: string; text: string }[];
      isError: boolean;
    };
    expect(outcome).toEqual({ content: [{ type: "text", text: "all good" }], isError: false });
  });

  it("maps a thrown error through toErrorResult instead of rejecting", async () => {
    const { server, registered } = fakeServer();
    const registry = new ToolRegistry(server, {} as TermixClient, [
      tool({
        name: "boom-tool",
        handler: async () => {
          throw new TermixApiError(500, "kaboom");
        },
      }),
    ]);
    registry.registerToolset("system");
    const outcome = (await registered.get("boom-tool")!.handler({})) as {
      content: { type: string; text: string }[];
      isError: boolean;
    };
    expect(outcome.isError).toBe(true);
    expect(outcome.content[0]!.text).toContain("kaboom");
  });
});

describe("setupTools", () => {
  const baseConfig = { ...DEFAULT_CONFIG, url: "https://t.example.com", apiKey: "tmx_x" };

  it("registers only the selected toolsets in static mode", () => {
    const { server, raw } = fakeServer();
    const catalog = [
      tool({ name: "a", toolset: "hosts" }),
      tool({ name: "b", toolset: "credentials" }),
    ];
    const registry = setupTools({
      server,
      client: {} as TermixClient,
      catalog,
      config: { ...baseConfig, toolsets: ["hosts"] },
      version: "2.7.0",
      logger: silentLogger,
    });
    expect(registry.registeredToolNames()).toEqual(["a"]);
    expect(raw.registerTool).toHaveBeenCalledTimes(1);
  });

  it("in dynamic mode registers only the two meta-tools up front", () => {
    const { server, raw } = fakeServer();
    const catalog = [tool({ name: "a", toolset: "hosts" })];
    const registry = setupTools({
      server,
      client: {} as TermixClient,
      catalog,
      config: { ...baseConfig, dynamicToolsets: true },
      version: "2.7.0",
      logger: silentLogger,
    });
    expect(registry.registeredToolNames()).toEqual([]);
    expect(raw.registerTool).toHaveBeenCalledTimes(2);
    expect(raw.registerTool.mock.calls.map((c) => c[0])).toEqual([
      "termix_list_toolsets",
      "termix_enable_toolset",
    ]);
  });

  it("termix_list_toolsets lists toolsets that have tools, with enabled/disabled state", () => {
    const { server, registered } = fakeServer();
    setupTools({
      server,
      client: {} as TermixClient,
      catalog: [tool({ name: "a", toolset: "hosts" })],
      config: { ...baseConfig, dynamicToolsets: true },
      version: "2.7.0",
      logger: silentLogger,
    });
    const result = registered.get("termix_list_toolsets")!.handler({}) as {
      content: { text: string }[];
    };
    expect(result.content[0]!.text).toContain("hosts (disabled, 1 tools)");
  });

  it("termix_enable_toolset registers new tools and reports the change", () => {
    const { server, registered, raw } = fakeServer();
    setupTools({
      server,
      client: {} as TermixClient,
      catalog: [tool({ name: "a", toolset: "hosts" })],
      config: { ...baseConfig, dynamicToolsets: true },
      version: "2.7.0",
      logger: silentLogger,
    });
    const result = registered.get("termix_enable_toolset")!.handler({ toolset: "hosts" }) as {
      content: { text: string }[];
      isError?: boolean;
    };
    expect(result.isError).toBeFalsy();
    expect(result.content[0]!.text).toContain('Enabled toolset "hosts": 1 new tool(s)');
    expect(raw.sendToolListChanged).toHaveBeenCalledTimes(1);
  });

  it("termix_enable_toolset rejects an unknown or empty toolset", () => {
    const { server, registered } = fakeServer();
    setupTools({
      server,
      client: {} as TermixClient,
      catalog: [tool({ name: "a", toolset: "hosts" })],
      config: { ...baseConfig, dynamicToolsets: true },
      version: "2.7.0",
      logger: silentLogger,
    });
    const result = registered.get("termix_enable_toolset")!.handler({ toolset: "not-real" }) as {
      isError?: boolean;
    };
    expect(result.isError).toBe(true);
  });
});
