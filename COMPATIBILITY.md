# Termix version compatibility

`termix-mcp` targets Termix's REST API as documented in its OpenAPI spec. Tools are gated per-version
(see [ARCHITECTURE.md](ARCHITECTURE.md#version-gating)); this table tracks which Termix releases have
actually been validated against this project, versus versions that are expected to work because nothing
in the spec changed for the endpoints in question.

| Termix version | Status    | Notes                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.7.1          | Reference | Spec committed at `specs/termix-2.7.1.openapi.json`. A meaningful subset (hosts, file manager, snippets, terminal history, fleets, automations, tunnel presets, workspaces/open tabs, alerts, several admin settings) verified live against a real instance - see [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) for exactly what's confirmed versus still auto-derived from an incomplete spec. |
| < 2.7.1        | Untested  | Likely mostly compatible; no committed spec or CI coverage yet.                                                                                                                                                                                                                                                                                                                                |
| 2.8.0-beta.*   | Untested  | Rolling beta; not tracked until it stabilizes into a release.                                                                                                                                                                                                                                                                                                                                  |

A newer Termix version than any row above still gets every tool registered (nothing withholds it), with a
startup warning that the version is unvalidated. See `spec-drift.yml` in `.github/workflows/` for how new
releases are detected and turned into a PR against this table.
