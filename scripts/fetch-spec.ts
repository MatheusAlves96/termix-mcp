#!/usr/bin/env tsx
/**
 * Downloads the Termix OpenAPI spec and writes it to specs/termix-<version>.openapi.json.
 *
 * Termix's spec doesn't carry its own version (info.version is always "0.0.0"), so the
 * Termix release tag is what identifies which spec this is. The spec itself lives in the
 * separate Termix-SSH/Docs repo (built by `npm run generate:openapi` in Termix's own repo
 * and checked into Docs' static/openapi.json), not in a release asset - so there is no
 * per-tag spec to fetch; `main` on Docs tracks whatever Termix release most recently ran
 * that script. Passing --version only controls the output filename.
 *
 * Usage:
 *   tsx scripts/fetch-spec.ts --version 2.7.1
 *   tsx scripts/fetch-spec.ts --version 2.7.1 --ref main   (branch/tag on Termix-SSH/Docs)
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

function arg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
}

async function main(): Promise<void> {
  const version = arg("version");
  const ref = arg("ref", "main");
  if (!version) {
    console.error("Usage: tsx scripts/fetch-spec.ts --version <termix-version> [--ref <docs-ref>]");
    process.exitCode = 1;
    return;
  }

  const url = `https://raw.githubusercontent.com/Termix-SSH/Docs/${ref}/static/openapi.json`;
  console.error(`Fetching ${url} ...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec: HTTP ${response.status}`);
  }
  const spec: unknown = await response.json();

  const outPath = path.join("specs", `termix-${version}.openapi.json`);
  await writeFile(outPath, JSON.stringify(spec, null, 2) + "\n", "utf-8");
  console.error(`Wrote ${outPath}`);
  console.error("Next: npm run spec:generate -- --version " + version);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
