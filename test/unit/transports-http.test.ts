import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/server";
import { DEFAULT_CONFIG } from "../../src/config/types.js";
import { createLogger } from "../../src/util/logger.js";

const listen = vi.fn((_port: number, _host: string, cb: () => void) => cb());
const close = vi.fn();
const once = vi.fn();
type Handler = (req: FakeReq, res: FakeRes) => void;
let capturedHandler: Handler | undefined;
const createServerMock = vi.fn((handler: Handler) => {
  capturedHandler = handler;
  return { listen, close, once };
});
vi.mock("node:http", () => ({ createServer: createServerMock }));

const handleRequest = vi.fn();
const transportClose = vi.fn();
const NodeStreamableHTTPServerTransportMock = vi.fn().mockImplementation(function () {
  return { handleRequest, close: transportClose };
});
const validateHostFn = vi.fn().mockReturnValue(true);
const localhostHostValidationMock = vi.fn(() => validateHostFn);
vi.mock("@modelcontextprotocol/node", () => ({
  NodeStreamableHTTPServerTransport: NodeStreamableHTTPServerTransportMock,
  localhostHostValidation: localhostHostValidationMock,
}));

const { runHttp } = await import("../../src/transports/http.js");

interface FakeReq {
  url: string;
  method: string;
  headers: Record<string, string | undefined>;
}
interface FakeRes {
  writeHead: (status: number, headers: Record<string, string>) => void;
  end: (body?: string) => void;
  statusCode?: number;
  body?: string;
}

function fakeReq(overrides: Partial<FakeReq> = {}): FakeReq {
  return { url: "/mcp", method: "POST", headers: {}, ...overrides };
}

function fakeRes(): FakeRes {
  const res: FakeRes = {
    writeHead: (status, _headers) => {
      res.statusCode = status;
    },
    end: (body) => {
      res.body = body;
    },
  };
  return res;
}

const silentLogger = createLogger("error");
const fakeServer = { connect: vi.fn().mockResolvedValue(undefined) } as unknown as McpServer;

beforeEach(() => {
  listen.mockClear();
  close.mockClear();
  createServerMock.mockClear();
  handleRequest.mockClear();
  transportClose.mockClear();
  validateHostFn.mockClear().mockReturnValue(true);
  capturedHandler = undefined;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runHttp", () => {
  it("refuses to bind a non-loopback host without an auth token", async () => {
    await expect(
      runHttp(fakeServer, { ...DEFAULT_CONFIG, host: "0.0.0.0", port: 3000 }, silentLogger),
    ).rejects.toThrow(/Refusing to bind 0\.0\.0\.0:3000/);
    expect(createServerMock).not.toHaveBeenCalled();
  });

  it("allows a non-loopback host once an auth token is set", async () => {
    await runHttp(
      fakeServer,
      { ...DEFAULT_CONFIG, host: "0.0.0.0", port: 3000, httpAuthToken: "secret" },
      silentLogger,
    );
    expect(listen).toHaveBeenCalledWith(3000, "0.0.0.0", expect.any(Function));
  });

  it("answers /healthz without touching auth or host validation", async () => {
    await runHttp(fakeServer, { ...DEFAULT_CONFIG, host: "127.0.0.1", port: 3000 }, silentLogger);
    const res = fakeRes();
    capturedHandler!(fakeReq({ url: "/healthz", method: "GET" }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify({ status: "ok" }));
    expect(handleRequest).not.toHaveBeenCalled();
  });

  it("on a loopback bind, runs host validation and forwards valid requests to the transport", async () => {
    await runHttp(fakeServer, { ...DEFAULT_CONFIG, host: "127.0.0.1", port: 3000 }, silentLogger);
    const res = fakeRes();
    capturedHandler!(fakeReq(), res);
    expect(validateHostFn).toHaveBeenCalledTimes(1);
    expect(handleRequest).toHaveBeenCalledTimes(1);
  });

  it("stops at host validation when it fails", async () => {
    validateHostFn.mockReturnValue(false);
    await runHttp(fakeServer, { ...DEFAULT_CONFIG, host: "127.0.0.1", port: 3000 }, silentLogger);
    capturedHandler!(fakeReq(), fakeRes());
    expect(handleRequest).not.toHaveBeenCalled();
  });

  it("rejects requests missing or mismatching the bearer token", async () => {
    await runHttp(
      fakeServer,
      { ...DEFAULT_CONFIG, host: "0.0.0.0", port: 3000, httpAuthToken: "secret" },
      silentLogger,
    );
    const res = fakeRes();
    capturedHandler!(fakeReq({ headers: { authorization: "Bearer wrong" } }), res);
    expect(res.statusCode).toBe(401);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  it("accepts requests with the correct bearer token", async () => {
    await runHttp(
      fakeServer,
      { ...DEFAULT_CONFIG, host: "0.0.0.0", port: 3000, httpAuthToken: "secret" },
      silentLogger,
    );
    capturedHandler!(fakeReq({ headers: { authorization: "Bearer secret" } }), fakeRes());
    expect(handleRequest).toHaveBeenCalledTimes(1);
  });

  it("closes the http server and transport on SIGINT/SIGTERM", async () => {
    const handlers = new Map<string, () => void>();
    vi.spyOn(process, "on").mockImplementation(
      (event: string | symbol, cb: (...args: unknown[]) => void) => {
        handlers.set(String(event), cb);
        return process;
      },
    );

    await runHttp(fakeServer, { ...DEFAULT_CONFIG, host: "127.0.0.1", port: 3000 }, silentLogger);

    expect(handlers.has("SIGINT")).toBe(true);
    expect(handlers.has("SIGTERM")).toBe(true);
    handlers.get("SIGINT")!();
    expect(close).toHaveBeenCalledTimes(1);
    expect(transportClose).toHaveBeenCalledTimes(1);
  });
});
