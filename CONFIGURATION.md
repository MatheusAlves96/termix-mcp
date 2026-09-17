# Configuration reference

`termix-mcp` is configured entirely through environment variables. A `--flag` form is available for the
ones most people change per-invocation; flags win over environment variables.

## Connection

| Variable              | Flag             | Required | Default | Notes                                                                                                                                                  |
| --------------------- | ---------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TERMIX_URL`          | `--url`          | yes      | —       | Base URL of your Termix instance (e.g. `https://termix.example.com`). No trailing path or slash.                                                       |
| `TERMIX_API_KEY`      | `--api-key`      | yes      | —       | Created in Termix under **Admin > API Keys**. Starts with `tmx_`. Never logged; redacted in error output.                                              |
| `TERMIX_INSECURE_TLS` | `--insecure-tls` | no       | `false` | Accept self-signed/invalid TLS certificates. Only for trusted local networks; never for anything internet-facing.                                      |
| `TERMIX_TIMEOUT_MS`   | —                | no       | `30000` | Default request timeout. A handful of tools (fleet execute, metrics history) use a longer built-in timeout because the underlying Termix endpoints do. |

## Toolsets

| Variable                  | Flag                 | Default   | Notes                                                                                                                                         |
| ------------------------- | -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `TERMIX_TOOLSETS`         | `--toolsets`         | `default` | Comma-separated toolset ids (see [available tools in the README](README.md#available-tools-resources-and-prompts)), or `all`.                 |
| `TERMIX_DYNAMIC_TOOLSETS` | `--dynamic-toolsets` | `false`   | Only register `termix_list_toolsets` / `termix_enable_toolset` at startup; the model enables the rest on demand. Overrides `TERMIX_TOOLSETS`. |

## Safety gates

All three default to the safest option. See [SECURITY.md](SECURITY.md) for the reasoning.

| Variable                   | Flag                  | Default | Effect                                                                              |
| -------------------------- | --------------------- | ------- | ----------------------------------------------------------------------------------- |
| `TERMIX_READ_ONLY`         | `--read-only`         | `false` | Only tools with `risk: read` register.                                              |
| `TERMIX_ALLOW_DESTRUCTIVE` | `--allow-destructive` | `false` | Allow `risk: destructive` tools (delete/revoke/reset/rotate).                       |
| `TERMIX_EXPOSE_SECRETS`    | `--expose-secrets`    | `false` | Allow `risk: secret` tools (host passwords, session tokens, key export, DB export). |

`TERMIX_READ_ONLY=true` takes precedence over the other two: a read-only server never exposes destructive
or secret-returning tools even if those flags are also set.

## Version gating

| Variable               | Flag                                         | Default       | Notes                                                                                                                       |
| ---------------------- | -------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `TERMIX_VERSION`       | `--version` (of Termix, not of this package) | auto-detected | Force the version used for gating instead of probing `GET /version`. Format `x.y.z`.                                        |
| `TERMIX_VERSION_CHECK` | `--no-version-check`                         | `true`        | Set to `false` (or pass the flag) to skip the startup probe entirely; behaves as if the newest known version were detected. |

## Transport

| Variable              | Flag          | Default     | Notes                                                                                                                                       |
| --------------------- | ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `MCP_TRANSPORT`       | `--transport` | `stdio`     | `stdio` or `http`.                                                                                                                          |
| `PORT`                | `--port`      | `3000`      | Only for `http`.                                                                                                                            |
| `HOST`                | `--host`      | `127.0.0.1` | Only for `http`. Bind `0.0.0.0` explicitly for container use.                                                                               |
| `MCP_HTTP_AUTH_TOKEN` | —             | —           | If set, the HTTP transport requires `Authorization: Bearer <token>` from MCP clients. Strongly recommended whenever `HOST` is not loopback. |

## Misc

| Variable          | Flag          | Default | Notes                                                                                                                                                               |
| ----------------- | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOG_LEVEL`       | `--log-level` | `info`  | `error` \| `warn` \| `info` \| `debug`. All logs go to stderr; stdout is reserved for the stdio JSON-RPC stream.                                                    |
| `--config <path>` | —             | —       | Optional JSON file (`termix-mcp.config.json`) with any of the above as camelCase keys. Environment variables override it; flags override both.                      |
| `--print-tools`   | —             | —       | Print the effective tool catalog (name, toolset, risk, gating reason if excluded) for the current configuration and detected version, then exit. Registers nothing. |

## Precedence

`CLI flag > environment variable > config file > built-in default`.

## Example config file

```json
{
  "url": "https://termix.example.com",
  "toolsets": ["hosts", "credentials", "snippets", "metrics"],
  "readOnly": true
}
```

(`TERMIX_API_KEY` should still come from the environment, not the config file, so it doesn't end up in a
file that might get committed or shared.)
