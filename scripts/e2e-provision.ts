#!/usr/bin/env tsx
/**
 * Provisions a fresh Termix instance (started by test/e2e/docker-compose.yml)
 * for the e2e suite: creates the first (admin) user, logs in, and mints an
 * API key for termix-mcp to use. Writes TERMIX_URL/TERMIX_API_KEY into
 * test/e2e/.env.e2e for the smoke suite (and CI) to load.
 *
 * Verified against src/backend/database/routes/users.ts and
 * user-api-key-routes.ts in Termix-SSH/Termix @ release-2.7.1-tag:
 *  - POST /users/create {username, password} -> first user becomes admin,
 *    does not log in.
 *  - POST /users/login {username, password} -> sets a `jwt` httpOnly cookie
 *    (the API key endpoint below accepts either that cookie or a bearer
 *    token, so we just reuse the cookie).
 *  - GET /users/me -> { userId, ... } for the now-authenticated user.
 *  - POST /users/api-keys {name, userId} (admin only) -> { token: "tmx_..." }.
 */
import { writeFile } from "node:fs/promises";

const BASE_URL = process.env.TERMIX_E2E_URL ?? "http://localhost:8080";
const USERNAME = "termix-mcp-e2e";
const PASSWORD = `E2e-${Math.random().toString(36).slice(2)}!Aa1`;

function extractJwtCookie(response: Response): string {
  const setCookie = response.headers.get("set-cookie");
  const match = setCookie?.match(/jwt=([^;]+)/);
  if (!match) {
    throw new Error(`Login response had no jwt cookie (set-cookie: ${setCookie ?? "<none>"})`);
  }
  return match[1] ?? "";
}

async function waitForReady(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    if (Date.now() > deadline)
      throw new Error(`Termix at ${BASE_URL} did not become healthy in time`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function main(): Promise<void> {
  console.error(`Waiting for Termix at ${BASE_URL} ...`);
  await waitForReady();

  console.error(`Creating first user "${USERNAME}" ...`);
  const createRes = await fetch(`${BASE_URL}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  if (!createRes.ok) {
    throw new Error(`POST /users/create failed: ${createRes.status} ${await createRes.text()}`);
  }
  const created = (await createRes.json()) as { is_admin: boolean };
  if (!created.is_admin) {
    throw new Error("Created user is not admin - was Termix's database not actually empty?");
  }

  console.error("Logging in ...");
  const loginRes = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  if (!loginRes.ok) {
    throw new Error(`POST /users/login failed: ${loginRes.status} ${await loginRes.text()}`);
  }
  const jwt = extractJwtCookie(loginRes);

  console.error("Fetching own user id ...");
  const meRes = await fetch(`${BASE_URL}/users/me`, { headers: { Cookie: `jwt=${jwt}` } });
  if (!meRes.ok) {
    throw new Error(`GET /users/me failed: ${meRes.status} ${await meRes.text()}`);
  }
  const me = (await meRes.json()) as { userId: string };

  console.error("Creating an API key ...");
  const keyRes = await fetch(`${BASE_URL}/users/api-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `jwt=${jwt}` },
    body: JSON.stringify({ name: "termix-mcp-e2e", userId: me.userId }),
  });
  if (!keyRes.ok) {
    throw new Error(`POST /users/api-keys failed: ${keyRes.status} ${await keyRes.text()}`);
  }
  const key = (await keyRes.json()) as { token: string };

  await writeFile(
    "test/e2e/.env.e2e",
    `TERMIX_URL=${BASE_URL}\nTERMIX_API_KEY=${key.token}\n`,
    "utf-8",
  );
  console.error("Wrote test/e2e/.env.e2e");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
