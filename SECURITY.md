# Security Policy

## Supported Versions

`termix-mcp` follows semantic versioning. Only the latest minor release on the
current major version receives security fixes.

| Version             | Supported   |
| ------------------- | ----------- |
| latest 1.x          | yes         |
| < 1.0 (pre-release) | best effort |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, use GitHub's private vulnerability reporting:
https://github.com/MatheusAlves96/termix-mcp/security/advisories/new

Include:

- A description of the vulnerability and its impact.
- Steps to reproduce, or a proof-of-concept.
- The version of `termix-mcp` and of Termix you tested against.

You should expect an initial response within 5 business days. We will keep
you updated as the issue is triaged, fixed, and released, and will credit you
in the release notes unless you prefer to stay anonymous.

## Scope Notes

`termix-mcp` is a client that talks to a Termix instance you already trust and
control using credentials you provide. It does not itself store or proxy your
Termix credentials anywhere except to the Termix instance configured via
`TERMIX_URL`. Vulnerabilities in Termix itself should be reported to the
[Termix project](https://github.com/Termix-SSH/Termix/security) directly.

Areas we consider in scope here:

- Credential or secret leakage (logs, error messages, tool outputs).
- Authentication/authorization bypass of the safety gates described in
  [`docs/security.md`](docs/security.md) (read-only mode, destructive-action
  gate, secret-exposure gate).
- Injection or path-traversal issues in file manager, snippet, or automation
  tools.
- Supply-chain issues in this package's build or release pipeline.
