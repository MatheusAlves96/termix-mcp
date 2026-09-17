import { describe, expect, it, vi, beforeEach } from "vitest";
import type * as UndiciModule from "undici";
import { createLogger } from "../../src/util/logger.js";
import { TermixConnectionError } from "../../src/termix/errors.js";

interface FetchCallInit {
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal: AbortSignal;
  dispatcher?: unknown;
}
type FetchImplFn = (url: string, init: FetchCallInit) => Promise<unknown>;

function fetchMockFn() {
  return vi.fn<FetchImplFn>();
}

const fetchMock = vi.hoisted(() => vi.fn());
vi.mock("undici", async (importOriginal) => {
  const actual = await importOriginal<typeof UndiciModule>();
  return { ...actual, fetch: fetchMock };
});

const { TermixClient } = await import("../../src/termix/client.js");

interface FakeResponseInit {
  ok: boolean;
  status: number;
  contentType?: string | null;
  jsonBody?: unknown;
  textBody?: string;
  jsonThrows?: boolean;
  textThrows?: boolean;
}

function fakeResponse(init: FakeResponseInit) {
  return {
    ok: init.ok,
    status: init.status,
    headers: {
      get: (name: string) => (name === "content-type" ? (init.contentType ?? null) : null),
    },
    json: async () => {
      if (init.jsonThrows) throw new Error("not json");
      return init.jsonBody;
    },
    text: async () => {
      if (init.textThrows) throw new Error("no text");
      return init.textBody ?? "";
    },
    arrayBuffer: async () => new ArrayBuffer(0),
  };
}

const silentLogger = createLogger("error");

function client(fetchImpl: FetchImplFn, options?: Partial<{ insecureTls: boolean }>) {
  return new TermixClient({
    baseUrl: "https://termix.example.com/",
    apiKey: "tmx_abcdef1234",
    timeoutMs: 5000,
    insecureTls: options?.insecureTls ?? false,
    logger: silentLogger,
    fetchImpl: fetchImpl as unknown as typeof fetch,
  });
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe("TermixClient.request", () => {
  it("sends auth/accept headers, strips trailing slash from baseUrl, and parses JSON", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        contentType: "application/json",
        jsonBody: { ok: true },
      }),
    );
    const result = await client(fetchImpl).request({ method: "GET", path: "/health" });
    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe("https://termix.example.com/health");
    expect(init.headers.Authorization).toBe("Bearer tmx_abcdef1234");
    expect(init.headers.Accept).toBe("application/json");
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("substitutes path params and filters undefined query values", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: true, status: 200, contentType: "application/json", jsonBody: {} }),
    );
    await client(fetchImpl).request({
      method: "GET",
      path: "/host/db/host/{id}",
      pathParams: { id: 42 },
      query: { page: 1, filter: undefined },
    });
    const [url] = fetchImpl.mock.calls[0]!;
    expect(url).toBe("https://termix.example.com/host/db/host/42?page=1");
  });

  it("JSON-stringifies the body and sets Content-Type for writes", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: true, status: 200, contentType: "application/json", jsonBody: {} }),
    );
    await client(fetchImpl).request({ method: "POST", path: "/host", body: { name: "x" } });
    const [, init] = fetchImpl.mock.calls[0]!;
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ name: "x" }));
  });

  it("returns null for a 204 response", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(fakeResponse({ ok: true, status: 204 }));
    const result = await client(fetchImpl).request({ method: "DELETE", path: "/host/1" });
    expect(result).toBeNull();
  });

  it("returns raw text (or null) when the body isn't JSON", async () => {
    const fetchImpl = fetchMockFn()
      .mockResolvedValueOnce(
        fakeResponse({ ok: true, status: 200, contentType: "text/plain", textBody: "hi" }),
      )
      .mockResolvedValueOnce(
        fakeResponse({ ok: true, status: 200, contentType: "text/plain", textBody: "" }),
      );
    const c = client(fetchImpl);
    await expect(c.request({ method: "GET", path: "/a" })).resolves.toBe("hi");
    await expect(c.request({ method: "GET", path: "/b" })).resolves.toBeNull();
  });

  it("honors responseType text and arrayBuffer", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: true, status: 200, contentType: "application/json", textBody: "raw" }),
    );
    const c = client(fetchImpl);
    await expect(c.request({ method: "GET", path: "/a", responseType: "text" })).resolves.toBe(
      "raw",
    );
    const buf = await c.request({ method: "GET", path: "/a", responseType: "arrayBuffer" });
    expect(buf).toBeInstanceOf(ArrayBuffer);
  });

  it("retries on a retryable status then succeeds", async () => {
    const fetchImpl = fetchMockFn()
      .mockResolvedValueOnce(fakeResponse({ ok: false, status: 503 }))
      .mockResolvedValueOnce(
        fakeResponse({
          ok: true,
          status: 200,
          contentType: "application/json",
          jsonBody: { done: true },
        }),
      );
    const result = await client(fetchImpl).request({ method: "GET", path: "/flaky" });
    expect(result).toEqual({ done: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("gives up after MAX_RETRIES and throws TermixApiError with the response body's error/code", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 503,
        contentType: "application/json",
        jsonBody: { error: "down", code: "E1" },
      }),
    );
    await expect(
      client(fetchImpl).request({ method: "GET", path: "/flaky" }),
    ).rejects.toMatchObject({ status: 503, code: "E1", message: "down" });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("throws immediately for a non-retryable status", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: false, status: 404, contentType: "application/json", jsonBody: {} }),
    );
    await expect(
      client(fetchImpl).request({ method: "GET", path: "/missing" }),
    ).rejects.toMatchObject({ status: 404, message: "Termix responded with HTTP 404" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("falls back to the text body, then the default message, when JSON parsing fails", async () => {
    const fetchImpl = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: false, status: 400, jsonThrows: true, textBody: "plain text error" }),
    );
    await expect(client(fetchImpl).request({ method: "GET", path: "/bad" })).rejects.toMatchObject({
      status: 400,
      message: "plain text error",
    });

    const fetchImpl2 = fetchMockFn().mockResolvedValue(
      fakeResponse({ ok: false, status: 400, jsonThrows: true, textThrows: true }),
    );
    await expect(client(fetchImpl2).request({ method: "GET", path: "/bad" })).rejects.toMatchObject(
      { status: 400, message: "Termix responded with HTTP 400" },
    );
  });

  it("wraps a DNS/connection-refused error as TermixConnectionError after retrying", async () => {
    const err = Object.assign(new Error("refused"), { cause: { code: "ECONNREFUSED" } });
    const fetchImpl = fetchMockFn().mockRejectedValue(err);
    await expect(client(fetchImpl).request({ method: "GET", path: "/x" })).rejects.toBeInstanceOf(
      TermixConnectionError,
    );
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("maps an abort (timeout) to TermixConnectionError without retrying", async () => {
    const fetchImpl = fetchMockFn().mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );
    const c = new TermixClient({
      baseUrl: "https://termix.example.com",
      apiKey: "tmx_abcdef1234",
      timeoutMs: 1,
      insecureTls: false,
      logger: silentLogger,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(c.request({ method: "GET", path: "/slow" })).rejects.toThrow(
      /timed out after 1ms/,
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("uses undici's fetch with an insecure-TLS dispatcher, and warns once", async () => {
    fetchMock.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        contentType: "application/json",
        jsonBody: { insecure: true },
      }),
    );
    const warn = vi.fn();
    const logger = { ...silentLogger, warn };
    const c = new TermixClient({
      baseUrl: "https://termix.example.com",
      apiKey: "tmx_abcdef1234",
      timeoutMs: 5000,
      insecureTls: true,
      logger,
    });
    const result = await c.request({ method: "GET", path: "/health" });
    expect(result).toEqual({ insecure: true });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("TLS certificate validation is disabled"),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, FetchCallInit];
    expect(init.dispatcher).toBeDefined();
  });
});
