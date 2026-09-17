import { McpServer } from "@modelcontextprotocol/server";
import packageJson from "../package.json" with { type: "json" };
import { CATALOG } from "./catalog/index.js";
import type { ResolvedConfig } from "./config/types.js";
import { registerResources } from "./resources/index.js";
import { registerPrompts } from "./prompts/index.js";
import { TermixClient } from "./termix/client.js";
import { detectTermixVersion } from "./termix/version.js";
import { setupTools, type ToolRegistry } from "./tools/register.js";
import type { Logger } from "./util/logger.js";

export interface CreatedServer {
  server: McpServer;
  registry: ToolRegistry;
  version: string;
}

/** Builds the McpServer and registers tools/resources/prompts. Does not connect a transport. */
export async function createServer(config: ResolvedConfig, logger: Logger): Promise<CreatedServer> {
  if (!config.url || !config.apiKey) {
    throw new Error(
      "createServer requires config.url and config.apiKey (only --print-tools may omit them).",
    );
  }

  const client = new TermixClient({
    baseUrl: config.url,
    apiKey: config.apiKey,
    timeoutMs: config.timeoutMs,
    insecureTls: config.insecureTls,
    logger,
  });

  const version = await detectTermixVersion({
    client,
    override: config.version,
    probe: config.versionCheck,
    logger,
  });

  const server = new McpServer({ name: "termix-mcp", version: packageJson.version });

  const registry = setupTools({ server, client, catalog: CATALOG, config, version, logger });
  registerResources(server, client);
  registerPrompts(server);

  return { server, registry, version };
}
