import type { Logger } from "../../util/logger.js";

export interface SessionManagerOptions<SessionId> {
  /** Establishes a new session for a host and returns its session id. */
  connect: (hostId: string) => Promise<SessionId>;
  /** Pings a session to keep it alive. Failures are logged and otherwise ignored - the next real call will reconnect if needed. */
  keepalive: (sessionId: SessionId) => Promise<void>;
  /** Best-effort session teardown. Errors are logged and swallowed. */
  disconnect: (sessionId: SessionId) => Promise<void>;
  /** True if an error means the session is gone server-side (expired, or Termix restarted) and should be replaced. */
  isSessionError: (error: unknown) => boolean;
  /** How often to ping an idle session. Default 60s. */
  keepaliveIntervalMs?: number;
  logger: Logger;
}

interface Entry<SessionId> {
  sessionId: SessionId;
  timer: ReturnType<typeof setInterval>;
}

/**
 * Manages Termix's connect -> operate -> keepalive -> disconnect session
 * protocol (used by the file manager, Docker, and host-metrics endpoints)
 * behind a single `withSession(hostId, fn)` call: connects lazily, caches
 * the session per host, keeps it alive on a timer, and transparently
 * reconnects once if an operation reports the session is gone.
 *
 * Deliberately parameterized over `connect`/`keepalive`/`disconnect` rather
 * than calling TermixClient directly, so this class's own logic - the part
 * that's actually easy to get subtly wrong - is fully unit-testable without
 * depending on the exact request/response shape of any specific Termix
 * session endpoint.
 */
export class SessionManager<SessionId = string> {
  private readonly sessions = new Map<string, Entry<SessionId>>();
  private readonly connecting = new Map<string, Promise<SessionId>>();
  private readonly options: Required<
    Pick<SessionManagerOptions<SessionId>, "keepaliveIntervalMs">
  > &
    SessionManagerOptions<SessionId>;

  constructor(options: SessionManagerOptions<SessionId>) {
    this.options = { keepaliveIntervalMs: 60_000, ...options };
  }

  /** Runs `fn` with a live session for `hostId`, connecting or reconnecting as needed. */
  async withSession<T>(hostId: string, fn: (sessionId: SessionId) => Promise<T>): Promise<T> {
    const sessionId = await this.acquire(hostId);
    try {
      return await fn(sessionId);
    } catch (error) {
      if (!this.options.isSessionError(error)) throw error;
      this.options.logger.debug(`Session for host ${hostId} was rejected; reconnecting once.`);
      this.drop(hostId);
      const retried = await this.acquire(hostId);
      return await fn(retried);
    }
  }

  private async acquire(hostId: string): Promise<SessionId> {
    const existing = this.sessions.get(hostId);
    if (existing) return existing.sessionId;

    const inFlight = this.connecting.get(hostId);
    if (inFlight) return inFlight;

    const connectPromise = this.options
      .connect(hostId)
      .then((sessionId) => {
        const timer = setInterval(() => {
          this.options.keepalive(sessionId).catch((error: unknown) => {
            this.options.logger.debug(`Keepalive failed for host ${hostId}: ${String(error)}`);
          });
        }, this.options.keepaliveIntervalMs);
        timer.unref?.();
        this.sessions.set(hostId, { sessionId, timer });
        return sessionId;
      })
      .finally(() => {
        this.connecting.delete(hostId);
      });

    this.connecting.set(hostId, connectPromise);
    return connectPromise;
  }

  /** Drops a cached session (stopping its keepalive) without attempting to disconnect it server-side. Used when the session is already known-dead. */
  private drop(hostId: string): void {
    const entry = this.sessions.get(hostId);
    if (!entry) return;
    clearInterval(entry.timer);
    this.sessions.delete(hostId);
  }

  /** Disconnects and drops one host's session, if any. Safe to call even if there is none. */
  async close(hostId: string): Promise<void> {
    const entry = this.sessions.get(hostId);
    if (!entry) return;
    clearInterval(entry.timer);
    this.sessions.delete(hostId);
    try {
      await this.options.disconnect(entry.sessionId);
    } catch (error) {
      this.options.logger.debug(
        `Failed to disconnect session for host ${hostId}: ${String(error)}`,
      );
    }
  }

  /** Disconnects and drops every cached session. Call on server shutdown. */
  async closeAll(): Promise<void> {
    await Promise.all([...this.sessions.keys()].map((hostId) => this.close(hostId)));
  }

  /** Number of live cached sessions. Exposed for tests and diagnostics, not part of the public contract. */
  get size(): number {
    return this.sessions.size;
  }
}
