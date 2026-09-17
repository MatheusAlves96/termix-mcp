import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SessionManager,
  type SessionManagerOptions,
} from "../../src/termix/sessions/session-manager.js";
import { createLogger } from "../../src/util/logger.js";

const logger = createLogger("error");

class SessionError extends Error {}

function makeManager(overrides: Partial<SessionManagerOptions<string>> = {}) {
  const connect = vi.fn(async (hostId: string) => `session-for-${hostId}`);
  const keepalive = vi.fn(async () => {});
  const disconnect = vi.fn(async () => {});
  const manager = new SessionManager({
    connect,
    keepalive,
    disconnect,
    isSessionError: (error) => error instanceof SessionError,
    keepaliveIntervalMs: 1000,
    logger,
    ...overrides,
  });
  return { manager, connect, keepalive, disconnect };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SessionManager", () => {
  it("connects lazily on first use", async () => {
    const { manager, connect } = makeManager();
    expect(connect).not.toHaveBeenCalled();
    const result = await manager.withSession("host-1", async (id) => `used ${id}`);
    expect(result).toBe("used session-for-host-1");
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("reuses a cached session across calls", async () => {
    const { manager, connect } = makeManager();
    await manager.withSession("host-1", async () => {});
    await manager.withSession("host-1", async () => {});
    await manager.withSession("host-1", async () => {});
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("connects independently per host", async () => {
    const { manager, connect } = makeManager();
    await manager.withSession("host-1", async () => {});
    await manager.withSession("host-2", async () => {});
    expect(connect).toHaveBeenCalledTimes(2);
    expect(manager.size).toBe(2);
  });

  it("deduplicates concurrent connects for the same host", async () => {
    const { manager, connect } = makeManager();
    const [a, b] = await Promise.all([
      manager.withSession("host-1", async (id) => id),
      manager.withSession("host-1", async (id) => id),
    ]);
    expect(a).toBe(b);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("sends a keepalive on the configured interval", async () => {
    const { manager, keepalive } = makeManager();
    await manager.withSession("host-1", async () => {});
    expect(keepalive).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(keepalive).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(keepalive).toHaveBeenCalledTimes(3);
  });

  it("reconnects once when an operation reports the session is gone", async () => {
    const { manager, connect } = makeManager();
    await manager.withSession("host-1", async () => {}); // establish
    let calls = 0;
    const result = await manager.withSession("host-1", async (id) => {
      calls++;
      if (calls === 1) throw new SessionError("gone");
      return id;
    });
    expect(result).toBe("session-for-host-1");
    expect(calls).toBe(2);
    expect(connect).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-session error", async () => {
    const { manager } = makeManager();
    await expect(
      manager.withSession("host-1", async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });

  it("stops the keepalive timer once a session is closed", async () => {
    const { manager, keepalive, disconnect } = makeManager();
    await manager.withSession("host-1", async () => {});
    await manager.close("host-1");
    expect(disconnect).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(5000);
    expect(keepalive).not.toHaveBeenCalled();
    expect(manager.size).toBe(0);
  });

  it("closeAll disconnects every cached session", async () => {
    const { manager, disconnect } = makeManager();
    await manager.withSession("host-1", async () => {});
    await manager.withSession("host-2", async () => {});
    await manager.closeAll();
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(manager.size).toBe(0);
  });

  it("swallows disconnect errors", async () => {
    const { manager } = makeManager({
      disconnect: vi.fn(async () => {
        throw new Error("network gone");
      }),
    });
    await manager.withSession("host-1", async () => {});
    await expect(manager.close("host-1")).resolves.toBeUndefined();
  });
});
