/**
 * Runs the generated catalog's handlers against a real, freshly provisioned
 * Termix instance. Skipped unless TERMIX_URL/TERMIX_API_KEY are set (see
 * scripts/e2e-provision.ts and test/e2e/docker-compose.yml) - this is not
 * part of the normal `npm test` run.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { CATALOG } from "../../src/catalog/index.js";
import { TermixClient } from "../../src/termix/client.js";
import { createLogger } from "../../src/util/logger.js";
import type { ToolSpec } from "../../src/catalog/types.js";

const url = process.env.TERMIX_URL;
const apiKey = process.env.TERMIX_API_KEY;

function findTool(name: string): ToolSpec {
  const tool = CATALOG.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool not in catalog: ${name}`);
  return tool;
}

describe.runIf(Boolean(url && apiKey))("e2e against a live Termix instance", () => {
  let client: TermixClient;

  beforeAll(() => {
    client = new TermixClient({
      baseUrl: url as string,
      apiKey: apiKey as string,
      timeoutMs: 15_000,
      insecureTls: false,
      logger: createLogger("error"),
    });
  });

  it("reports healthy", async () => {
    const health = await findTool("termix_system_health").handler({}, { client });
    expect(JSON.parse(health.text)).toEqual({ status: "ok" });
  });

  it("reports its version", async () => {
    const version = await findTool("termix_system_version").handler({}, { client });
    const parsed = JSON.parse(version.text) as { localVersion?: string };
    expect(parsed.localVersion).toBeTruthy();
  });

  it("creates, lists, and deletes an SSH host through the generated tools", async () => {
    const create = findTool("termix_hosts_create_ssh_host");
    const list = findTool("termix_hosts_get_all_ssh_hosts");
    const del = CATALOG.find(
      (t) => t.operation.method === "DELETE" && t.operation.path === "/host/db/host/{id}",
    );
    if (!del) throw new Error("Delete SSH host tool not found in catalog");

    const createInput = create.inputSchema.parse({
      name: "termix-mcp e2e host",
      ip: "203.0.113.10",
      port: 22,
      username: "e2e-user",
      authType: "password",
      password: "not-a-real-password",
    });
    const created = await create.handler(createInput, { client });
    const createdHost = JSON.parse(created.text) as { id?: number | string };
    expect(createdHost.id).toBeDefined();

    const listed = await list.handler({}, { client });
    const hosts = JSON.parse(listed.text) as Array<{ id: number | string }>;
    expect(hosts.some((h) => String(h.id) === String(createdHost.id))).toBe(true);

    const deleted = await del.handler({ id: createdHost.id }, { client });
    expect(deleted.isError).toBeFalsy();
  });
});
