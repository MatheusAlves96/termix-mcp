# Architecture

## Why one MCP tool per REST operation

Termix's API has 400+ operations. Collapsing them into a handful of generic tools (`termix_get`,
`termix_post`) would save registration overhead but forces the model to guess paths, methods and body
shapes from prose — worse tool selection and worse error messages. One tool per operation, with a
generated Zod input schema, gives the model a real signature to call against. The cost (a large catalog)
is handled by toolsets and dynamic mode instead of by collapsing the API.

## Toolsets

Tools are grouped by domain (`hosts`, `docker`, `metrics`, `admin`, ...). A curated default set loads on
startup; the rest is opt-in via `TERMIX_TOOLSETS`. `TERMIX_DYNAMIC_TOOLSETS=true` flips this around:
only two meta-tools register at startup (`termix_list_toolsets`, `termix_enable_toolset`), and the model
enables toolsets as it discovers it needs them, via `tools/list_changed` notifications. This keeps the
initial `tools/list` payload small regardless of how much of the API is covered.

## Spec-driven catalog

```
specs/termix-X.Y.Z.openapi.json   (committed, one per supported release)
        │  npm run spec:generate
        ▼
src/generated/operations.ts       (generated; typed list of every REST operation)
        │  src/catalog/from-spec.ts + src/catalog/overrides.ts
        ▼
src/catalog/index.ts              (ToolSpec[] — the actual catalog)
        │  src/tools/register.ts (applies version gating + safety flags)
        ▼
MCP tools registered on the server
```

`operations.ts` is generated and never hand-edited — regenerating it from a newer spec is how the project
picks up new Termix endpoints. Everything that needs a human decision (a friendlier tool name, which
toolset an operation belongs to, whether it's safe to expose by default, a hand-written input schema for
an operation the spec under-describes) lives in `src/catalog/overrides.ts`, keyed by `"METHOD /path"`.

A test (`test/unit/catalog-coverage.test.ts`) fails the build if any operation in `operations.ts` has no
catalog entry — including `exposed: false` ones. This is what "100% of the API surface" means in
practice: every endpoint is a deliberate decision, not a gap nobody noticed.

### JSON Schema → Zod

The spec's request bodies are plain JSON Schema (string/number/boolean/object/array/enum, up to 3 levels
of nesting, no `oneOf`/`anyOf` in the general case). Rather than pull in a full JSON-Schema-to-Zod
library or code-generate Zod source text, `src/catalog/schema-from-openapi.ts` is a small, direct
converter for exactly the subset Termix's spec uses. It's covered by unit tests against every schema
shape actually observed in the spec; anything outside that subset (e.g. a future `oneOf`) throws at
generate-time instead of silently producing a wrong schema.

## Version gating

At startup, the server calls `GET /version?checkRemote=false` against the configured `TERMIX_URL` to
learn the instance's version (or takes `TERMIX_VERSION` if set, or skips entirely with
`TERMIX_VERSION_CHECK=false`). Each `ToolSpec` has a `versions` semver range (default `*`) and an
optional `disabledIn` list of ranges. A tool registers only if the detected version satisfies `versions`
and matches none of `disabledIn`. This is deliberately a static, declarative gate — no per-tool runtime
branching — so `npm run print-tools` can show exactly what a given version gets without contacting
Termix.

If the detected version is newer than anything in `COMPATIBILITY.md`, every tool still registers (the
spec itself hasn't changed shape, so there's no reason to withhold anything); the server logs a warning
that the version is unvalidated.

## Sessions

File manager, Docker, and host-metrics endpoints follow a connect → operate → keepalive → disconnect
protocol with a server-side `sessionId`: a `connect` tool returns it, subsequent tools take it as an
ordinary input field, and a `keepalive` tool has to be called periodically or the session expires.
Today every one of those tools is generated straight from the spec (as described above), so the model
manages `sessionId` itself the same way it would in a raw HTTP client - this already works correctly,
since it mirrors Termix's real contract exactly.

`src/termix/sessions/session-manager.ts` provides the other half: a generic, fully unit-tested
`SessionManager<SessionId>` that turns that protocol into a single `withSession(hostId, fn)` call -
connecting lazily, caching one session per host, keeping it alive on a timer, and reconnecting once if an
operation reports the session is gone. It takes `connect`/`keepalive`/`disconnect` as plain functions, so
its own logic (the part actually worth testing precisely) has no dependency on any specific endpoint's
request or response shape.

It is not yet wired into a Termix-specific `connect`/`keepalive`/`disconnect` triple or exposed as
higher-level `hostId`-keyed tools that replace the raw ones - doing that well requires knowing each
endpoint's exact field names, which is worth verifying against a live Termix instance rather than
guessing. That wiring (one small module per domain: file manager, Docker, host metrics) is the natural
next contribution on top of this class; see `CONTRIBUTING.md`.

## Safety gates

Every `ToolSpec` carries a `risk` (`read` | `write` | `destructive` | `secret`). Three independent flags
filter the catalog before registration:

- `TERMIX_READ_ONLY` — keep only `risk: "read"`.
- `TERMIX_ALLOW_DESTRUCTIVE` — required for `risk: "destructive"` (delete/revoke/reset/rotate-style
  operations).
- `TERMIX_EXPOSE_SECRETS` — required for `risk: "secret"` (host passwords, session tokens, private key
  export, full database export).

All three default to the safer option (off), so a freshly installed server can only read and make
non-destructive changes, and can never return a secret, until someone deliberately widens that.

## What's not exposed, and why

Browser-auth flows (login, OIDC authorize/callback, WebAuthn, TOTP setup, password reset, LDAP login) are
in the catalog with `exposed: false` and a reason — they establish the session `termix-mcp` itself uses
to authenticate and don't make sense as tools an agent calls on your behalf. Interactive protocols over
WebSocket (terminal, Docker console, serial, RDP/VNC/Telnet via Guacamole, tunnel byte streams) are out of
scope for v1's request/response tool model; see the project's roadmap for whether/how a future version
represents them (e.g. as a bounded "run this command and return output" tool rather than a live PTY).

## Transports

`src/transports/stdio.ts` wraps `@modelcontextprotocol/server/stdio` — the default, used by
`npx termix-mcp` and every desktop MCP client. `src/transports/http.ts` wraps
`@modelcontextprotocol/node`'s Streamable HTTP transport for the container image, with an optional bearer
token (`MCP_HTTP_AUTH_TOKEN`) and Host header validation. Both sit on the same `createServer()` in
`src/server.ts`, so tool registration logic is identical regardless of transport.
