import { describe, expect, it, vi } from "vitest";
import { systemTools } from "../../src/catalog/system.js";
import type { TermixClient } from "../../src/termix/client.js";

function findTool(name: string) {
  const tool = systemTools.find((t) => t.name === name);
  if (!tool) throw new Error(`missing tool ${name}`);
  return tool;
}

function fakeClient(response: unknown): TermixClient {
  return { request: vi.fn().mockResolvedValue(response) } as unknown as TermixClient;
}

describe("systemTools", () => {
  it("termix_system_health calls GET /health and returns the JSON result", async () => {
    const client = fakeClient({ status: "ok" });
    const result = await findTool("termix_system_health").handler({}, { client });
    expect(client.request).toHaveBeenCalledWith({ method: "GET", path: "/health" });
    expect(result.text).toBe(JSON.stringify({ status: "ok" }));
  });

  it("termix_system_version calls GET /version with checkRemote=false", async () => {
    const client = fakeClient({ localVersion: "2.7.1" });
    const result = await findTool("termix_system_version").handler({}, { client });
    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/version",
      query: { checkRemote: "false" },
    });
    expect(result.text).toBe(JSON.stringify({ localVersion: "2.7.1" }));
  });

  it("termix_system_releases forwards page/perPage as page/per_page", async () => {
    const client = fakeClient([{ tag: "v1" }]);
    const result = await findTool("termix_system_releases").handler(
      { page: 2, perPage: 10 },
      { client },
    );
    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/releases/rss",
      query: { page: 2, per_page: 10 },
    });
    expect(result.text).toBe(JSON.stringify([{ tag: "v1" }]));
  });

  it("termix_system_releases works with no input at all", async () => {
    const client = fakeClient([]);
    await findTool("termix_system_releases").handler({}, { client });
    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/releases/rss",
      query: { page: undefined, per_page: undefined },
    });
  });
});
