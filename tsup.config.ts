import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  target: "node22",
  platform: "node",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  shims: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
