import { describe, expect, it } from "vitest";
import { renderToolCatalog } from "../../src/print-tools.js";
import { DEFAULT_CONFIG } from "../../src/config/types.js";
import { NEWEST_VALIDATED_VERSION } from "../../src/termix/version.js";

describe("renderToolCatalog", () => {
  it("notes it's showing the newest validated version when none is forced", () => {
    const output = renderToolCatalog(DEFAULT_CONFIG);
    expect(output).toContain(`Termix ${NEWEST_VALIDATED_VERSION}`);
    expect(output).toContain("no version forced or detected");
    expect(output).toContain("Toolsets:");
  });

  it("notes an explicitly forced version", () => {
    const output = renderToolCatalog({ ...DEFAULT_CONFIG, version: "2.5.0" });
    expect(output).toContain("Termix 2.5.0");
    expect(output).toContain("forced via --version/TERMIX_VERSION");
  });

  it("lists which static toolsets register now vs. are just available", () => {
    const output = renderToolCatalog({ ...DEFAULT_CONFIG, toolsets: ["hosts"] });
    expect(output).toMatch(/## hosts \(\d+ tool\(s\), registers now\)/);
    expect(output).toMatch(/## credentials \(\d+ tool\(s\), available, not selected\)/);
  });

  it("describes dynamic mode", () => {
    const output = renderToolCatalog({ ...DEFAULT_CONFIG, dynamicToolsets: true });
    expect(output).toContain("Mode: dynamic toolsets (only meta-tools register at startup)");
  });

  it("lists excluded tools with their reasons under read-only mode", () => {
    const output = renderToolCatalog({ ...DEFAULT_CONFIG, readOnly: true, toolsets: "all" });
    expect(output).toMatch(/## Excluded \(\d+\)/);
    expect(output).toContain("TERMIX_READ_ONLY is set");
  });
});
