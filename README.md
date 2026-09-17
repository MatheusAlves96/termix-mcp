# termix-mcp

[![CI](https://github.com/MatheusAlves96/termix-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusAlves96/termix-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/termix-mcp.svg)](https://www.npmjs.com/package/termix-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the
[Termix](https://github.com/Termix-SSH/Termix) REST API — self-hosted SSH, RDP/VNC, Docker, and fleet
management — as MCP tools, resources, and prompts, so an LLM agent can manage your Termix instance
directly.

> Termix is a self-hosted SSH and remote desktop manager. This project is an independent,
> community-maintained MCP server for it and is not affiliated with the Termix project.

## Features

- Covers the full Termix REST API surface (hosts, credentials, snippets, fleets, host metrics, Docker,
  file manager, tunnels, automations, alerts, audit logs, session logs, Proxmox, Tailscale, and more).
- **Toolset-based**: tools are grouped so you only load what you need. A curated default set is enabled
  out of the box; everything else (admin, account settings, UI state, AI providers, sync) is opt-in.
- **Version-aware**: tools declare which Termix versions they support. The server detects your instance's
  version at startup and only registers what actually works against it.
- **Safe by default**: destructive actions and secret-returning endpoints (host passwords, session
  tokens, database export) are disabled until you explicitly opt in.
- Ships as a single npm package (stdio transport, for Claude Desktop / Claude Code / Cursor / VS Code) and
  as a container image (Streamable HTTP transport, for hosted deployments).

## Quick start

```bash
npx termix-mcp
```

Requires `TERMIX_URL` and `TERMIX_API_KEY` to be set (see [Configuration](#configuration)).

### Claude Code

```bash
claude mcp add termix -- npx -y termix-mcp
```

### Claude Desktop / other MCP clients

```json
{
  "mcpServers": {
    "termix": {
      "command": "npx",
      "args": ["-y", "termix-mcp"],
      "env": {
        "TERMIX_URL": "https://termix.example.com",
        "TERMIX_API_KEY": "tmx_..."
      }
    }
  }
}
```

### Docker (Streamable HTTP)

```bash
docker run -p 3000:3000 \
  -e TERMIX_URL=https://termix.example.com \
  -e TERMIX_API_KEY=tmx_... \
  -e MCP_TRANSPORT=http \
  ghcr.io/matheusalves96/termix-mcp:latest
```

## Getting an API key

In Termix, go to **Admin > API Keys** and create a key scoped to a user. Terminal, RBAC, and admin-only
endpoints follow that user's own permissions — create a dedicated non-admin user for `termix-mcp` unless
you explicitly want an agent to have admin access.

## Configuration

All configuration is via environment variables (CLI flags override them; see `termix-mcp --help`).

| Variable                   | Required | Default             | Description                                                              |
| -------------------------- | -------- | ------------------- | ------------------------------------------------------------------------ |
| `TERMIX_URL`               | yes      | —                   | Base URL of your Termix instance, no trailing path.                      |
| `TERMIX_API_KEY`           | yes      | —                   | API key created in Termix, starting with `tmx_`.                         |
| `TERMIX_TOOLSETS`          | no       | `default`           | Comma-separated toolset ids, or `all`. See [TOOLSETS.md](TOOLSETS.md).   |
| `TERMIX_DYNAMIC_TOOLSETS`  | no       | `false`             | Register only meta-tools; let the model enable toolsets on demand.       |
| `TERMIX_READ_ONLY`         | no       | `false`             | Only register tools that don't mutate state.                             |
| `TERMIX_ALLOW_DESTRUCTIVE` | no       | `false`             | Allow delete/revoke/reset/rotate-style tools.                            |
| `TERMIX_EXPOSE_SECRETS`    | no       | `false`             | Allow tools that can return secrets (host passwords, tokens, DB export). |
| `TERMIX_VERSION`           | no       | auto-detected       | Force the Termix version used for tool gating (`x.y.z`).                 |
| `TERMIX_VERSION_CHECK`     | no       | `true`              | Set `false` to skip the startup version probe.                           |
| `TERMIX_TIMEOUT_MS`        | no       | `30000`             | Default per-request timeout.                                             |
| `TERMIX_INSECURE_TLS`      | no       | `false`             | Accept self-signed/invalid TLS certificates. Not recommended.            |
| `MCP_TRANSPORT`            | no       | `stdio`             | `stdio` or `http`.                                                       |
| `PORT`, `HOST`             | no       | `3000`, `127.0.0.1` | Only used when `MCP_TRANSPORT=http`.                                     |
| `MCP_HTTP_AUTH_TOKEN`      | no       | —                   | Bearer token required by clients of the HTTP transport.                  |
| `LOG_LEVEL`                | no       | `info`              | `error` \| `warn` \| `info` \| `debug`. Logs go to stderr, never stdout. |

See [CONFIGURATION.md](CONFIGURATION.md) for the full reference, and [SECURITY.md](SECURITY.md) for the
threat model behind the safety gates.

## Toolsets

Tools are grouped into toolsets you can enable independently. See [TOOLSETS.md](TOOLSETS.md) for the
full list, what's on by default, and what's intentionally not exposed (login/OIDC/WebAuthn flows,
interactive terminal/RDP over WebSocket, etc. — see [ARCHITECTURE.md](ARCHITECTURE.md) for why).

Run `npx termix-mcp --print-tools` to see the exact set of tools active for your configuration and
detected Termix version.

## Version compatibility

See [COMPATIBILITY.md](COMPATIBILITY.md) for the matrix of Termix versions this project is tested
against.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for how the codebase is organized,
how to add or update tools, and how releases work.

## License

[MIT](LICENSE)
