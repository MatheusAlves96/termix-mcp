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

// --- Manual request body schemas -------------------------------------------
//
// A handful of operations have a requestBody in Termix's spec with no usable
// `properties` (or none at all) - the JSDoc `@openapi` comment documents the
// response but not the request. The auto-derived schema for these is
// therefore empty, which silently strips every field a caller passes (Zod's
// default "strip" mode) and sends `{}` to Termix. Verified against
// Termix-SSH/Termix @ release-2.7.1-tag by reading the route handler
// directly, not guessed - see git history for how each was checked.
import type { JsonSchema } from "../generated/operations.js";

/**
 * Fields for creating/updating an SSH host (src/backend/database/routes/host.ts,
 * `POST /host/db/host` and `PUT /host/db/host/{id}`, which both accept a plain
 * JSON body). `ip` and `port` are the only fields the handler actually
 * requires; everything else has a server-side default. Deliberately covers
 * the common SSH case, not the full ~90-field surface (RDP/VNC/Telnet
 * sub-config, Proxmox stats config, SOCKS5 proxy chains, MAC/WOL, port
 * knocking) - those are a good follow-up contribution once verified the same
 * way against a live instance.
 */
const HOST_WRITE_PROPERTIES: Record<string, JsonSchema> = {
  connectionType: { type: "string", description: 'ssh, rdp, vnc, or telnet. Defaults to "ssh".' },
  name: { type: "string", description: "Display name. Defaults to username@ip if omitted." },
  folder: { type: "string" },
  parentHostId: {
    type: "integer",
    description: "Nests this host under another. Mutually exclusive with folder.",
  },
  tags: { type: "array", items: { type: "string" } },
  ip: { type: "string" },
  port: { type: "integer" },
  username: { type: "string" },
  password: { type: "string" },
  authType: {
    type: "string",
    description:
      "e.g. password, key, credential, vault, agent, keyboard-interactive, warpgate, opkssh.",
  },
  key: { type: "string", description: "Private key contents (PEM)." },
  keyPassword: { type: "string", description: "Passphrase for an encrypted private key." },
  keyType: { type: "string" },
  credentialId: {
    type: "integer",
    description: "Use a saved credential instead of an inline password/key.",
  },
  vaultProfileId: {
    type: "integer",
    description: 'Use a Vault SSH signing profile (authType "vault").',
  },
  sudoPassword: { type: "string" },
  pin: { type: "boolean" },
  notes: { type: "string" },
  defaultPath: { type: "string", description: "Default file manager path." },
  enableTerminal: { type: "boolean" },
  enableCommandHistory: { type: "boolean" },
  enableTunnel: { type: "boolean" },
  enableFileManager: { type: "boolean" },
  enableDocker: { type: "boolean" },
  enableProxmox: { type: "boolean" },
  enableTmuxMonitor: { type: "boolean" },
  enableTerminalToolbar: { type: "boolean" },
  allowSessionSharing: { type: "boolean" },
  showTerminalInSidebar: { type: "boolean" },
  showFileManagerInSidebar: { type: "boolean" },
  showTunnelInSidebar: { type: "boolean" },
  showDockerInSidebar: { type: "boolean" },
  showServerStatsInSidebar: { type: "boolean" },
  jumpHosts: {
    type: "array",
    items: { type: "object" },
    description: "Ordered list of jump host hop configs.",
  },
  tunnelConnections: { type: "array", items: { type: "object" } },
  forceKeyboardInteractive: { type: "boolean" },
  domain: { type: "string" },
  useSocks5: { type: "boolean" },
  socks5Host: { type: "string" },
  socks5Port: { type: "integer" },
  socks5Username: { type: "string" },
  socks5Password: { type: "string" },
};

export const BODY_SCHEMA_OVERRIDES: Record<string, JsonSchema> = {
  "POST /host/db/host": {
    type: "object",
    required: ["ip", "port"],
    properties: HOST_WRITE_PROPERTIES,
  },
  "PUT /host/db/host/{id}": {
    type: "object",
    properties: HOST_WRITE_PROPERTIES,
  },
};

/** Verified against src/backend/database/routes/alert-rules-routes.ts. */
const ALERT_RULE_TRIGGER_TYPES = [
  "host_offline",
  "host_online",
  "cpu_threshold",
  "memory_threshold",
  "disk_threshold",
  "health_check_failure",
  "health_check_recovery",
  "user_login",
];

const ALERT_RULE_PROPERTIES: Record<string, JsonSchema> = {
  name: { type: "string" },
  hostId: { type: "integer", description: "Restrict this rule to one host. Omit for all hosts." },
  enabled: { type: "boolean", default: true },
  triggerType: { type: "string", enum: ALERT_RULE_TRIGGER_TYPES },
  thresholdValue: {
    type: "number",
    description: "0-100. Required by cpu/memory/disk_threshold triggers.",
  },
  thresholdDurationSeconds: { type: "integer" },
  cooldownMinutes: { type: "integer", default: 15 },
  channels: {
    type: "array",
    items: { type: "integer" },
    description: "Notification channel ids to fire.",
  },
};

const NOTIFICATION_CHANNEL_PROPERTIES: Record<string, JsonSchema> = {
  name: { type: "string" },
  type: { type: "string", enum: ["webhook", "ntfy", "discord"] },
  enabled: { type: "boolean", default: true },
  config: {
    type: "object",
    description:
      'Shape depends on "type". webhook/discord: {"url": string}. ntfy: {"url": string, "topic": string}. A discord webhook URL must match https://discord.com/api/webhooks/... (or canary./ptb. / discordapp.com).',
    properties: { url: { type: "string" }, topic: { type: "string" } },
  },
};

Object.assign(BODY_SCHEMA_OVERRIDES, {
  "POST /alert-rules": {
    type: "object",
    required: ["name", "triggerType"],
    properties: ALERT_RULE_PROPERTIES,
  } satisfies JsonSchema,
  "PUT /alert-rules/{id}": {
    type: "object",
    properties: ALERT_RULE_PROPERTIES,
  } satisfies JsonSchema,
  "POST /notification-channels": {
    type: "object",
    required: ["name", "type", "config"],
    properties: NOTIFICATION_CHANNEL_PROPERTIES,
  } satisfies JsonSchema,
  "PUT /notification-channels/{id}": {
    type: "object",
    properties: NOTIFICATION_CHANNEL_PROPERTIES,
  } satisfies JsonSchema,
});
