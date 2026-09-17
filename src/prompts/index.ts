import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

const diagnoseHostArgs = z.object({
  hostId: z
    .string()
    .describe(
      "The Termix host id to diagnose (see termix://hosts or termix_hosts_get_all_ssh_hosts).",
    ),
});

export function diagnoseHostPrompt({ hostId }: z.infer<typeof diagnoseHostArgs>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            `Diagnose the health of Termix host ${hostId}.`,
            "",
            `1. Call termix_hosts_get_ssh_host_id with id=${hostId} to confirm it exists and see its configuration.`,
            `2. Call termix_metrics_get_host_status_id (or termix_metrics_get_host_metrics) with id=${hostId} for live status and resource usage.`,
            "3. Call termix_alerts_get_active_alerts and filter for this host, to see if anything is already firing.",
            `4. Call termix_terminal_history_get_command_history with hostId=${hostId} for its recent command history, if it looks relevant.`,
            "",
            "Summarize: is it reachable, is anything abnormal in CPU/memory/disk, and are there open alerts? Recommend next steps only if something looks wrong.",
          ].join("\n"),
        },
      },
    ],
  };
}

const reviewRecentAlertsArgs = z.object({
  hours: z.string().optional().describe("How far back to look. Defaults to 24."),
});

export function reviewRecentAlertsPrompt({ hours }: z.infer<typeof reviewRecentAlertsArgs>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            `Review Termix alert activity from the last ${hours ?? "24"} hours.`,
            "",
            "1. Call termix_alerts_get_active_alerts for anything currently firing.",
            "2. Call termix_alerts_get_dismissed_alerts to see what's already been acknowledged.",
            "3. Cross-reference with termix://hosts to name which host each alert belongs to.",
            "",
            "Group the result by host, call out anything still unacknowledged, and note any host with more than one active alert.",
          ].join("\n"),
        },
      },
    ],
  };
}

/**
 * Prompts are conversation starters, not automations - each just returns text
 * telling the model which tools to call and in what order. Kept small and
 * composable rather than trying to script a whole workflow, since the model
 * still decides based on what it actually finds at each step. The callbacks
 * are exported as plain functions above (diagnoseHostPrompt,
 * reviewRecentAlertsPrompt) so they're unit-testable without going through
 * the MCP transport plumbing.
 */
export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "diagnose-host",
    {
      title: "Diagnose a host",
      description:
        "Checks a host's connectivity, live metrics, and recent alerts, then summarizes its health.",
      argsSchema: diagnoseHostArgs,
    },
    diagnoseHostPrompt,
  );

  server.registerPrompt(
    "review-recent-alerts",
    {
      title: "Review recent alerts",
      description:
        "Summarizes alert firings from the last N hours and flags any that still need attention.",
      argsSchema: reviewRecentAlertsArgs,
    },
    reviewRecentAlertsPrompt,
  );
}
