#!/usr/bin/env tsx
/**
 * Fails if README.md's generated Tools/Resources/Prompts section doesn't
 * match what `npm run spec:inventory` would currently generate from
 * src/catalog, src/resources, and src/prompts. This is what CI runs (see
 * .github/workflows/ci.yml) so a tool/resource/prompt added without
 * regenerating the doc fails the build instead of merging silently out of
 * date.
 */
import { execFileSync } from "node:child_process";

// prettier reformats the generator's output (table column widths, in
// particular) - regenerate through the same `format` step the pre-commit
// hook applies, or every run would show a spurious diff.
execFileSync("npm", ["run", "--silent", "spec:inventory"], { stdio: "inherit", shell: true });
execFileSync("npx", ["--no-install", "prettier", "--write", "README.md"], {
  stdio: "inherit",
  shell: true,
});

const diff = execFileSync("git", ["diff", "--name-only", "--", "README.md"], {
  encoding: "utf-8",
}).trim();

if (diff) {
  console.error(
    "\nREADME.md's generated Tools/Resources/Prompts section is out of date relative to src/catalog, " +
      "src/resources, and src/prompts.\nRun `npm run spec:inventory` and commit the result.\n",
  );
  process.exitCode = 1;
} else {
  console.error("README.md's generated section is up to date.");
}
