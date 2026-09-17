import {
  createServer as createHttpServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { randomUUID } from "node:crypto";
import {
  NodeStreamableHTTPServerTransport,
  localhostHostValidation,
} from "@modelcontextprotocol/node";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ResolvedConfig } from "../config/types.js";
import type { Logger } from "../util/logger.js";

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function checkBearerAuth(
  req: IncomingMessage,
  res: ServerResponse,
  expectedToken: string | undefined,
): boolean {
  if (!expectedToken) return true;
  const header = req.headers.authorization;
  if (header === `Bearer ${expectedToken}`) return true;
  writeJson(res, 401, { error: "Missing or invalid Authorization header." });
  return false;
}

/**
 * Runs the Streamable HTTP transport over plain `node:http`. Binding anything
 * other than loopback without `MCP_HTTP_AUTH_TOKEN` set is refused: an
 * unauthenticated MCP endpoint reachable beyond localhost would let anyone
 * who can reach it act as your Termix API key.
 */
export async function runHttp(
  server: McpServer,
  config: ResolvedConfig,
  logger: Logger,
): Promise<void> {
  const isLoopback =
    config.host === "127.0.0.1" || config.host === "::1" || config.host === "localhost";
  if (!isLoopback && !config.httpAuthToken) {
    throw new Error(
      `Refusing to bind ${config.host}:${config.port} without MCP_HTTP_AUTH_TOKEN set. ` +
        "Either bind to 127.0.0.1 or set an auth token.",
    );
  }

  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  await server.connect(transport);

  const validateHost = isLoopback ? localhostHostValidation() : undefined;

  const httpServer = createHttpServer((req, res) => {
    if (req.url === "/healthz" && req.method === "GET") {
      writeJson(res, 200, { status: "ok" });
      return;
    }
    if (validateHost && !validateHost(req, res)) return;
    if (!checkBearerAuth(req, res, config.httpAuthToken)) return;
    void transport.handleRequest(req, res);
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(config.port, config.host, () => resolve());
  });

  logger.info(
    `termix-mcp listening on http://${config.host}:${config.port} (Streamable HTTP transport).`,
  );

  const shutdown = () => {
    httpServer.close();
    void transport.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
