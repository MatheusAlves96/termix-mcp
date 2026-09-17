import { McpServer } from "@modelcontextprotocol/server";
import { describe, expect, it } from "vitest";
import { CATALOG } from "../../src/catalog/index.js";
import {
  diagnoseHostPrompt,
  registerPrompts,
  reviewRecentAlertsPrompt,
} from "../../src/prompts/index.js";
import { registerResources } from "../../src/resources/index.js";
import type { TermixClient } from "../../src/termix/client.js";

/** Every catalog tool name a prompt's static instructions tell the model to call. Kept in sync by hand - this test is what catches drift. */
const DIAGNOSE_HOST_TOOL_NAMES = [
  "termix_hosts_get_ssh_host_id",
  "termix_metrics_get_host_status_id",
  "termix_metrics_get_host_metrics",
  "termix_alerts_get_active_alerts",
  "termix_terminal_history_get_command_history",
];

const REVIEW_ALERTS_TOOL_NAMES = [
  "termix_alerts_get_active_alerts",
  "termix_alerts_get_dismissed_alerts",
];

const TOOL_NAMES_REFERENCED_BY_PROMPTS = [
  ...new Set([...DIAGNOSE_HOST_TOOL_NAMES, ...REVIEW_ALERTS_TOOL_NAMES]),
];

const RESOURCE_BACKING_TOOL_NAMES = [
  "termix_hosts_get_all_ssh_hosts",
  "termix_snippets_get_all_snippets",
  "termix_fleets_list_current_users_fleets",
  "termix_metrics_get_all_host_statuses",
];

describe("prompts and resources reference real catalog tools", () => {
  const names = new Set(CATALOG.map((t) => t.name));

  it("every tool a prompt tells the model to call actually exists", () => {
    const missing = TOOL_NAMES_REFERENCED_BY_PROMPTS.filter((n) => !names.has(n));
    expect(missing).toEqual([]);
  });

  it("every resource's backing tool actually exists", () => {
    const missing = RESOURCE_BACKING_TOOL_NAMES.filter((n) => !names.has(n));
    expect(missing).toEqual([]);
  });

  it("registers without throwing", () => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    const client = {} as TermixClient;
    expect(() => registerResources(server, client)).not.toThrow();
    expect(() => registerPrompts(server)).not.toThrow();
  });

  it("diagnose-host prompt mentions every tool it tells the model to call", () => {
    const result = diagnoseHostPrompt({ hostId: "42" });
    const text = result.messages[0]?.content.text ?? "";
    for (const name of DIAGNOSE_HOST_TOOL_NAMES) {
      expect(text).toContain(name);
    }
    expect(text).toContain("42");
  });

  it("review-recent-alerts prompt defaults to 24 hours and mentions its tools", () => {
    const result = reviewRecentAlertsPrompt({});
    const text = result.messages[0]?.content.text ?? "";
    expect(text).toContain("24 hours");
    for (const name of REVIEW_ALERTS_TOOL_NAMES) {
      expect(text).toContain(name);
    }
  });
});
