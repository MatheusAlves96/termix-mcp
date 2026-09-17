# Known limitations

Found while building and e2e-testing this project, tracked here so they're visible instead of silent.
Contributions fixing any of these (the same way the ones already fixed were: read the actual Termix route
handler, not guessed) are very welcome.

## Operations with an under-specified request body

Termix's OpenAPI spec documents a `summary`/`description`/`responses` for every operation, but not every
`requestBody` - some are entirely absent from the spec even though the underlying route reads fields from
`req.body`, and one operation family (`POST`/`PUT /host/db/host`) additionally accepts `multipart/form-data`
for uploading a private key file, which this project's HTTP client does not support (JSON bodies only).

Verified and fixed (see `src/catalog/overrides.ts` `BODY_SCHEMA_OVERRIDES`), by reading the actual handler:

- `POST /host/db/host`, `PUT /host/db/host/{id}` - create/update SSH host (JSON body only; the
  `multipart/form-data` + private-key-file path is not supported).
- `POST /alert-rules`, `PUT /alert-rules/{id}` - create/update alert rule.
- `POST /notification-channels`, `PUT /notification-channels/{id}` - create/update notification channel.

Confirmed genuinely bodyless (path params fully identify the action; verified by summary/shape, not every
one individually against source) and therefore not a bug:

`POST /ai/proposals/{id}/apply`, `.../reject`, `POST /alert-firings/{id}/acknowledge`,
`POST /alert-firings/acknowledge-all`, `POST /clear-connections`,
`POST /docker/containers/{sessionId}/{containerId}/{pause,restart,start,stop,unpause}`,
`POST /fleets/{id}/inventory`, `POST /metrics/start/{id}`, `POST /notification-channels/{id}/test`,
`POST /proxmox-stats/start/{id}`, `POST /refresh`, `POST /session-sharing/{shareId}/end`,
`POST /ssh/file_manager/ssh/disconnect`, `POST /users/me/dismiss-donation-modal`,
`POST /workspaces/{id}/apply`, `.../set-default`, `.../unset-default`.

(A few more operations in this same "no requestBody in the spec" category - login/logout, TOTP setup, the
WebAuthn ceremonies, the desktop-only auto-session mint - are already excluded entirely via `NOT_EXPOSED`
for unrelated reasons; see `src/catalog/overrides.ts`. `test/unit/known-gaps.test.ts` tracks only the ones
below, i.e. still-exposed operations.)

**Still needing a verified body schema** (the tool currently accepts no usable input for these - calling
it sends an effectively empty request, which will most likely fail against a real Termix instance):

| Operation                                          | Toolset       | Notes                                                                             |
| -------------------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| `PATCH /ai/providers/{id}`                         | `ai`          |                                                                                   |
| `PATCH /fleets/{id}`                               | `fleets`      |                                                                                   |
| `PATCH /open-tabs/{id}`                            | `ui-state`    |                                                                                   |
| `PATCH /users/log-level`                           | `admin`       |                                                                                   |
| `PATCH /users/session-timeout`                     | `admin`       |                                                                                   |
| `PATCH /users/terminal-image-storage-settings`     | `admin`       |                                                                                   |
| `PATCH /workspaces/{id}`                           | `ui-state`    |                                                                                   |
| `POST /fleets/{id}/transfer/push`                  | `fleets`      | Needs file content + remote path; likely also needs multipart or base64 handling. |
| `PUT /automations/{id}`                            | `automations` |                                                                                   |
| `PUT /c2s-tunnel-presets/{id}`                     | `tunnels`     |                                                                                   |
| `PUT /rbac/host-access/{hostId}/auth/{protocol}`   | `admin`       |                                                                                   |
| `PUT /users/sso-providers/{id}`                    | `admin`       |                                                                                   |
| `POST /users/oidc-config`                          | `admin`       |                                                                                   |
| `POST /sync/{entityType}`, `POST /sync/tombstones` | `sync`        | Off by default; low priority.                                                     |

**Ambiguous - may or may not need a body, not verified either way**:

`POST /credentials/{id}/apply-to-host/{hostId}` (may take auth overrides), `POST /rbac/snippet/{id}/share`
(likely needs a target user/role id), `POST /ssh/file_manager/ssh/connect-totp` (likely needs the TOTP
code itself), `POST /users/acme-ssl-request` (may need a domain/email), `POST /ssh/file_manager/ssh/uploadFileChunk`
and `.../uploadFileStream` (raw/multipart bodies, same class of gap as host creation's file upload).

## No multipart/form-data support

`src/termix/client.ts` only sends `application/json` bodies. Any Termix endpoint that requires an actual
file upload (SSH private key on host creation, file manager uploads, credential deploy) cannot fully work
through this project yet. `termix_hosts_create_ssh_host` works for password/credential/vault auth; key-based
auth by uploading a `.pem` file is not currently supported (though passing key contents as a `key` string
field in JSON, per the same handler's non-multipart branch, may work - not yet verified).

## Session-aware high-level tools not implemented

See [ARCHITECTURE.md](ARCHITECTURE.md#sessions) and [CONTRIBUTING.md](CONTRIBUTING.md). The raw
connect/keepalive/disconnect tools for file manager, Docker, and host metrics work as generated; a
`SessionManager`-backed high-level tool set (`hostId` in, no manual `sessionId` juggling) does not exist
yet.
