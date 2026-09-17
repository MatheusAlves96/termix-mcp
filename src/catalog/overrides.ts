import type { Risk, ToolsetId } from "./types.js";

/**
 * Maps every OpenAPI tag Termix's spec uses to one of our toolsets. Every tag
 * observed in specs/termix-2.7.1.openapi.json must appear here -
 * `test/unit/catalog-coverage.test.ts` fails the build otherwise, so a future
 * Termix release adding a new tag surfaces as a loud, specific failure
 * instead of silently dropping that tag's operations from the catalog.
 */
export const TAG_TO_TOOLSET: Record<string, ToolsetId> = {
  AI: "ai",
  Alerts: "alerts",
  "API Keys": "admin",
  Audit: "audit",
  Automations: "automations",
  Credentials: "credentials",
  "Credential Sidebar": "ui-state",
  Dashboard: "homepage",
  Docker: "docker",
  "File Manager": "files",
  Fleets: "fleets",
  Guacamole: "guacamole",
  Homepage: "homepage",
  "Host Enrollment": "hosts",
  "Host Metrics": "metrics",
  "Host Sidebar": "ui-state",
  "Network Topology": "network-topology",
  "Open Tabs": "ui-state",
  Proxmox: "proxmox",
  "Proxmox Stats": "proxmox",
  RBAC: "admin",
  SSH: "hosts",
  "SSH Tunnels": "tunnels",
  SSO: "admin",
  "Session Logs": "session-logs",
  "Session Sharing": "session-sharing",
  Snippets: "snippets",
  Sync: "sync",
  Tailscale: "tailscale",
  Terminal: "terminal-history",
  "Termix ID": "termix-id",
  "Tunnel Presets": "tunnels",
  "UI Preferences": "ui-state",
  "User Preferences": "account",
  Users: "admin",
  Vault: "vault",
  WebAuthn: "account",
  Workspaces: "ui-state",
};

/**
 * Per-operation toolset corrections for tags that are a grab-bag of both
 * admin and self-service actions (mainly "Users", which is one big Express
 * router file with no finer-grained tags upstream). Anything not listed here
 * keeps the tag's default toolset from TAG_TO_TOOLSET.
 */
export const TOOLSET_OVERRIDES: Record<string, ToolsetId> = {
  "GET /users/me": "account",
  "GET /users/me/token": "account",
  "POST /users/me/dismiss-donation-modal": "account",
  "POST /users/change-password": "account",
  "GET /users/data-status": "account",
  "POST /users/unlock-data": "account",
  "DELETE /users/delete-account": "account",
  "GET /users/sessions": "account",
  "POST /users/sessions/revoke-all": "account",
  "DELETE /users/sessions/{sessionId}": "account",
  "POST /users/link-oidc-to-password": "account",
  "POST /users/unlink-oidc-from-password": "account",
  "GET /users/webauthn/credentials": "account",
  "DELETE /users/webauthn/credentials/{credentialId}": "account",
  "GET /users/setup-required": "system",
};

/**
 * Operations kept in the catalog (for coverage) but never registered as MCP
 * tools, with the reason surfaced by `npm run print-tools`. Mostly live
 * browser-auth ceremonies (OIDC/LDAP/WebAuthn/TOTP/password-reset) that need
 * a human at a browser or an authenticator app, and a couple of
 * internal-only endpoints that a user API key can never actually call.
 */
export const NOT_EXPOSED: Record<string, string> = {
  "POST /users/login": "interactive password login; termix-mcp authenticates via API key only",
  "POST /users/logout": "session-based logout; irrelevant when authenticating via API key",
  "GET /users/oidc/authorize": "browser OAuth redirect, not callable as a tool",
  "GET /users/oidc/callback": "browser OAuth redirect, not callable as a tool",
  "POST /users/ldap/login": "interactive LDAP login ceremony",
  "POST /users/initiate-reset": "email-based password reset flow",
  "POST /users/complete-reset": "email-based password reset flow",
  "POST /users/verify-reset-code": "email-based password reset flow",
  "POST /users/totp/setup": "live TOTP enrollment ceremony (needs an authenticator app)",
  "POST /users/totp/enable": "live TOTP enrollment ceremony (needs a real-time code)",
  "POST /users/totp/disable": "needs a real-time TOTP code from the user's own authenticator",
  "POST /users/totp/verify-login": "live TOTP login ceremony",
  "POST /users/totp/backup-codes": "tied to an active browser session's TOTP re-verification",
  "POST /users/webauthn/register/options":
    "live WebAuthn ceremony, requires a browser authenticator",
  "POST /users/webauthn/register/verify":
    "live WebAuthn ceremony, requires a browser authenticator",
  "POST /users/webauthn/authenticate/options":
    "live WebAuthn ceremony, requires a browser authenticator",
  "POST /users/webauthn/authenticate/verify":
    "live WebAuthn ceremony, requires a browser authenticator",
  "POST /users/internal/auto-session":
    "desktop-only local bootstrap, not applicable via a user API key",
  "GET /host/db/host/internal": "requires Termix's internal service auth token, not a user API key",
  "GET /host/db/host/internal/all":
    "requires Termix's internal service auth token, not a user API key",
  "GET /host/opkssh-callback": "OAuth browser callback",
  "GET /host/opkssh-callback/{requestId}": "OAuth browser callback",
  "GET /host/opkssh-chooser/{requestId}": "proxies an interactive HTML chooser page",
  "GET /vault/oidc/callback": "OAuth browser callback",
};

/**
 * Risk overrides beyond the default heuristic in from-spec.ts (DELETE and
 * revoke/rotate/reset-worded summaries -> destructive, GET -> read, else
 * write). Two families: operations whose response can contain a secret
 * (host/session credentials, generated keys, remote-desktop tokens, a full
 * database dump), and a few actions the keyword heuristic doesn't catch.
 */
export const RISK_OVERRIDES: Record<string, Risk> = {
  "GET /host/db/host/{id}/password": "secret",
  "GET /host/db/host/{id}/export": "secret",
  "GET /host/db/hosts/export": "secret",
  "POST /credentials/generate-key-pair": "secret",
  "POST /users/admin/reset-password": "secret",
  "POST /guacamole/connect-host/{hostId}": "secret",
  "POST /guacamole/token": "secret",
  "POST /users/admin/totp/disable": "destructive",
};
