# Contributing to termix-mcp

Thanks for considering a contribution. This project is a community-maintained MCP server for
[Termix](https://github.com/Termix-SSH/Termix); it is not part of the Termix project itself.

## Development setup

Requires Node.js >= 22 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/MatheusAlves96/termix-mcp.git
cd termix-mcp
npm ci
npm run build
npm test
```

Useful scripts:

| Script                                      | What it does                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                               | Run the server from source with `tsx` (stdio transport).                |
| `npm run lint` / `lint:fix`                 | ESLint.                                                                 |
| `npm run typecheck`                         | `tsc --noEmit` project-wide.                                            |
| `npm test` / `test:watch` / `test:coverage` | Vitest.                                                                 |
| `npm run verify`                            | lint + typecheck + test + build, what CI runs.                          |
| `npm run print-tools`                       | Print the effective tool catalog for your current config/env.           |
| `npm run spec:fetch`                        | Download the Termix OpenAPI spec for a given release tag into `specs/`. |
| `npm run spec:generate`                     | Regenerate `src/generated/operations.ts` from a spec in `specs/`.       |
| `npm run spec:inventory`                    | Regenerate the `TOOLSETS.md` tables from the catalog.                   |
| `npm run spec:check-drift`                  | Compare the committed spec against the latest Termix release.           |

## Project layout

```
src/
  termix/       HTTP client, version detection, session managers — talks to Termix, knows nothing about MCP
  catalog/      ToolSpec definitions: names, toolsets, risk, annotations, version gating
  generated/    Generated from the OpenAPI spec — do not hand-edit, run `npm run spec:generate`
  tools/        Turns ToolSpec + gating config into registered MCP tools
  resources/    MCP resources
  prompts/      MCP prompts
  transports/   stdio and Streamable HTTP entry points
  config/       Environment/CLI config parsing and validation (zod)
scripts/        Spec fetch/generate/inventory/drift-check CLIs (run with tsx, not bundled)
specs/          Committed OpenAPI specs, one per supported Termix release
test/           unit/ (pure logic, vi.fn() mocks for TermixClient), e2e/ (gated, needs a real Termix)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design rationale (why per-operation tools, why toolsets,
why version gating works the way it does).

## Adding or changing a tool

Most of the catalog is derived automatically from the OpenAPI spec (`src/generated/operations.ts`) via
`src/catalog/from-spec.ts`. To change how a specific operation is exposed:

1. Find its entry in `src/catalog/overrides.ts` (or add one, keyed by `"METHOD /path"` exactly as it
   appears in the spec).
2. Override only what needs to change: `name`, `toolset`, `risk`, `exposed`/`exposedReason`, `versions`,
   `disabledIn`, or a custom `inputSchema`/`shape` function.
3. Run `npm run spec:inventory` and commit the regenerated tables.
4. If you added a `BODY_SCHEMA_OVERRIDES` entry, add a case for it in `test/unit/schema-from-openapi.test.ts`
   or a small dedicated test, and verify it against a real Termix instance if you can (see
   `test/e2e/`) - `KNOWN_LIMITATIONS.md` exists because some of these were guessed and are wrong.

Every operation in the spec must have a catalog entry, even if `exposed: false` — a test enforces this,
so builds fail loudly instead of silently dropping API coverage.

## Good first contribution: session-aware high-level tools

The file manager, Docker, and host-metrics endpoints require a `sessionId` obtained from a `connect` tool
and refreshed via `keepalive` (see [ARCHITECTURE.md](ARCHITECTURE.md#sessions)). Those raw tools already
work as generated. A nice improvement is a `hostId`-keyed high-level tool set on top of
`src/termix/sessions/session-manager.ts` — e.g. `termix_files_browse(hostId, path)` that connects,
lists, and lets the session live for reuse, instead of the model juggling `sessionId` itself. This needs
a live Termix instance to verify the exact connect/keepalive/disconnect request and response shapes
against, so it wasn't guessed at; a PR adding one domain at a time (file manager first) is very welcome.

## Updating for a new Termix release

1. `npm run spec:fetch -- --tag release-X.Y.Z-tag`
2. `npm run spec:generate`
3. Review the diff in `src/generated/operations.ts` and in `src/catalog/overrides.ts` if the build fails
   (it will, if an operation was renamed/removed — that's the point).
4. Update `COMPATIBILITY.md`.
5. Open a PR. The `spec-drift` workflow does steps 1–3 automatically on a weekly schedule and opens an
   issue when there's something to review.

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`,
`chore:`, ...), enforced by commitlint on the commit-msg hook. Suggested scopes: `catalog`, `client`,
`sessions`, `transport`, `docs`, `ci`. `feat`/`fix` commits drive the automated changelog and version
bump (release-please); other types don't.

## Pull requests

- Keep PRs focused; one logical change per PR.
- `npm run verify` must pass locally before pushing.
- CI (lint, typecheck, tests on Node 22/24 × Linux/Windows, build) must be green.
- Update the relevant root-level doc (`README.md`, `TOOLSETS.md`, `CONFIGURATION.md`,
  `COMPATIBILITY.md`) in the same PR as the code change it documents.

## Reporting security issues

Do not open a public issue. See [SECURITY.md](SECURITY.md).
