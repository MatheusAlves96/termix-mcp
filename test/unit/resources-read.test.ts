import { describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/server";
import { registerResources } from "../../src/resources/index.js";
import type { TermixClient } from "../../src/termix/client.js";

type ReadCallback = (uri: {
  href: string;
}) => Promise<{ contents: [{ uri: string; mimeType: string; text: string }] }>;

function fakeServer() {
  const captured = new Map<string, ReadCallback>();
  const server = {
    registerResource: vi.fn(
      (name: string, _uri: string, _meta: unknown, callback: ReadCallback) => {
        captured.set(name, callback);
      },
    ),
  };
  return { server: server as unknown as McpServer, captured };
}

describe("registerResources read callbacks", () => {
  it("termix-status aggregates /health and /version", async () => {
    const { server, captured } = fakeServer();
    const request = vi
      .fn()
      .mockResolvedValueOnce({ status: "ok" })
      .mockResolvedValueOnce({ localVersion: "2.7.1" });
    const client = { request } as unknown as TermixClient;
    registerResources(server, client);

    const result = await captured.get("termix-status")!({ href: "termix://system/status" });
    const parsed = JSON.parse(result.contents[0].text) as { health: unknown; version: unknown };
    expect(parsed).toEqual({ health: { status: "ok" }, version: { localVersion: "2.7.1" } });
    expect(result.contents[0].uri).toBe("termix://system/status");
    expect(request).toHaveBeenCalledWith({ method: "GET", path: "/health" });
    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/version",
      query: { checkRemote: "false" },
    });
  });

  it("termix-status swallows a failing sub-request into an {error} field instead of throwing", async () => {
    const { server, captured } = fakeServer();
    const request = vi
      .fn()
      .mockRejectedValueOnce(new Error("health down"))
      .mockResolvedValueOnce({ localVersion: "2.7.1" });
    const client = { request } as unknown as TermixClient;
    registerResources(server, client);

    const result = await captured.get("termix-status")!({ href: "termix://system/status" });
    const parsed = JSON.parse(result.contents[0].text) as { health: { error: string } };
    expect(parsed.health.error).toContain("health down");
  });

  it("a tool-backed resource (termix-hosts) delegates to its catalog tool's handler", async () => {
    const { server, captured } = fakeServer();
    const request = vi.fn().mockResolvedValue([{ id: 1, name: "box" }]);
    const client = { request } as unknown as TermixClient;
    registerResources(server, client);

    const result = await captured.get("termix-hosts")!({ href: "termix://hosts" });
    expect(JSON.parse(result.contents[0].text)).toEqual([{ id: 1, name: "box" }]);
    expect(result.contents[0].mimeType).toBe("application/json");
    expect(result.contents[0].uri).toBe("termix://hosts");
  });
});
