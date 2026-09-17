import type { ToolsetId } from "./types.js";
import type { ToolsetSelector } from "../config/types.js";

export interface ToolsetDef {
  id: ToolsetId;
  label: string;
  description: string;
  /** Whether this toolset is part of TERMIX_TOOLSETS=default (the out-of-the-box set). */
  defaultEnabled: boolean;
}

export const TOOLSET_DEFS: ToolsetDef[] = [
  {
    id: "system",
    label: "System",
    description: "Health, version, and release info.",
    defaultEnabled: true,
  },
  {
    id: "hosts",
    label: "Hosts",
    description: "SSH host CRUD, folders, import/export, autostart, quick-connect.",
    defaultEnabled: true,
  },
  {
    id: "credentials",
    label: "Credentials",
    description: "SSH credential management.",
    defaultEnabled: true,
  },
  {
    id: "snippets",
    label: "Snippets",
    description: "Saved command snippets, including remote execution.",
    defaultEnabled: true,
  },
  {
    id: "fleets",
    label: "Fleets",
    description: "Grouped multi-host operations: execute, packages, transfer, inventory.",
    defaultEnabled: true,
  },
  {
    id: "metrics",
    label: "Host metrics",
    description: "Host status, metrics history, and process/service/TLS/VPN managers.",
    defaultEnabled: true,
  },
  {
    id: "docker",
    label: "Docker",
    description: "Docker container lifecycle and stats over an SSH-backed session.",
    defaultEnabled: true,
  },
  {
    id: "files",
    label: "File manager",
    description: "Remote file operations over an SSH-backed session, plus bookmarks.",
    defaultEnabled: true,
  },
  {
    id: "tunnels",
    label: "Tunnels",
    description: "SSH tunnel connect/status and saved tunnel presets.",
    defaultEnabled: true,
  },
  {
    id: "automations",
    label: "Automations",
    description: "Scheduled and webhook-triggered automations.",
    defaultEnabled: true,
  },
  {
    id: "alerts",
    label: "Alerts",
    description: "Alert rules, notification channels, and firings.",
    defaultEnabled: true,
  },
  {
    id: "audit",
    label: "Audit",
    description: "Audit log querying and export.",
    defaultEnabled: true,
  },
  {
    id: "session-logs",
    label: "Session logs",
    description: "Recorded terminal session metadata and content.",
    defaultEnabled: true,
  },
  {
    id: "proxmox",
    label: "Proxmox",
    description: "Proxmox host discovery and node/VM statistics.",
    defaultEnabled: true,
  },
  {
    id: "tailscale",
    label: "Tailscale",
    description: "Tailscale device listing.",
    defaultEnabled: true,
  },
  {
    id: "terminal-history",
    label: "Terminal history",
    description: "Per-host terminal command history.",
    defaultEnabled: true,
  },
  {
    id: "network-topology",
    label: "Network topology",
    description: "Saved network topology diagrams.",
    defaultEnabled: false,
  },
  {
    id: "termix-id",
    label: "Termix ID",
    description: "Built-in SSH certificate authority and issued keys.",
    defaultEnabled: false,
  },
  {
    id: "vault",
    label: "Vault",
    description: "HashiCorp Vault SSH signing profiles.",
    defaultEnabled: false,
  },
  {
    id: "session-sharing",
    label: "Session sharing",
    description: "Live terminal session collaboration links.",
    defaultEnabled: false,
  },
  {
    id: "guacamole",
    label: "Guacamole",
    description: "RDP/VNC/Telnet connection token generation.",
    defaultEnabled: false,
  },
  {
    id: "admin",
    label: "Admin",
    description: "User management, RBAC, API keys, SSO, and instance settings.",
    defaultEnabled: false,
  },
  {
    id: "account",
    label: "Account",
    description: "The API key's own user profile and preferences.",
    defaultEnabled: false,
  },
  {
    id: "ui-state",
    label: "UI state",
    description: "Workspaces, open tabs, and UI/sidebar display preferences.",
    defaultEnabled: false,
  },
  {
    id: "homepage",
    label: "Homepage & dashboard",
    description: "Homepage service links, layout, and dashboard activity.",
    defaultEnabled: false,
  },
  {
    id: "ai",
    label: "AI",
    description: "Termix's own AI assistant provider/conversation management.",
    defaultEnabled: false,
  },
  {
    id: "sync",
    label: "Sync",
    description: "Internal desktop/server sync protocol.",
    defaultEnabled: false,
  },
  {
    id: "sessions",
    label: "Sessions (manual)",
    description:
      "Raw connect/disconnect/keepalive/status for file manager, Docker, and metrics sessions.",
    defaultEnabled: false,
  },
];

export const TOOLSET_IDS: ToolsetId[] = TOOLSET_DEFS.map((t) => t.id);

export function isToolsetId(value: string): value is ToolsetId {
  return (TOOLSET_IDS as string[]).includes(value);
}

/** Resolves a raw selector ("default" | "all" | string[]) into the concrete set of enabled toolset ids. */
export function resolveEnabledToolsets(selector: ToolsetSelector): Set<ToolsetId> {
  if (selector === "all") return new Set(TOOLSET_IDS);
  if (selector === "default") {
    return new Set(TOOLSET_DEFS.filter((t) => t.defaultEnabled).map((t) => t.id));
  }
  const unknown = selector.filter((id) => !isToolsetId(id));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown toolset(s): ${unknown.join(", ")}. Known toolsets: ${TOOLSET_IDS.join(", ")}.`,
    );
  }
  return new Set(selector as ToolsetId[]);
}
