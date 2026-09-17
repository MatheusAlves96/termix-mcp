// GENERATED FILE - do not edit by hand.
// Regenerate with: npm run spec:generate -- --version 2.7.1
// Source: specs/termix-2.7.1.openapi.json (413 operations)

export interface JsonSchema {
  type?: "string" | "number" | "integer" | "boolean" | "array" | "object";
  format?: string;
  enum?: unknown[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  description?: string;
  nullable?: boolean;
  default?: unknown;
  additionalProperties?: boolean | JsonSchema;
}

export interface RawParam {
  name: string;
  in: "path" | "query";
  required: boolean;
  schema: JsonSchema;
  description?: string;
}

export interface RawOperation {
  operationKey: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  tag: string;
  summary: string;
  description?: string;
  parameters: RawParam[];
  requestBody?: JsonSchema;
}

export const TERMIX_SPEC_VERSION = "2.7.1";

export const OPERATIONS: RawOperation[] = [
  {
    operationKey: "DELETE /activity/reset",
    method: "DELETE",
    path: "/activity/reset",
    tag: "Dashboard",
    summary: "Reset recent activity",
    description: "Clears all recent activity for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "DELETE /ai/conversations/{id}",
    method: "DELETE",
    path: "/ai/conversations/{id}",
    tag: "AI",
    summary: "Delete a conversation",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /ai/providers/{id}",
    method: "DELETE",
    path: "/ai/providers/{id}",
    tag: "AI",
    summary: "Delete an AI provider",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /alert-rules/{id}",
    method: "DELETE",
    path: "/alert-rules/{id}",
    tag: "Alerts",
    summary: "Delete an alert rule",
    parameters: [],
  },
  {
    operationKey: "DELETE /alerts/dismiss",
    method: "DELETE",
    path: "/alerts/dismiss",
    tag: "Alerts",
    summary: "Undismiss an alert",
    description: "Removes an alert from the dismissed list for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        alertId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /automations/{id}",
    method: "DELETE",
    path: "/automations/{id}",
    tag: "Automations",
    summary: "Delete an automation",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /c2s-tunnel-presets/{id}",
    method: "DELETE",
    path: "/c2s-tunnel-presets/{id}",
    tag: "Tunnel Presets",
    summary: "Delete a client tunnel preset",
    description: "Deletes one of the authenticated user's tunnel presets.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /credentials/{id}",
    method: "DELETE",
    path: "/credentials/{id}",
    tag: "Credentials",
    summary: "Delete a credential",
    description: "Deletes a specific credential by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /docker/containers/{sessionId}/{containerId}/remove",
    method: "DELETE",
    path: "/docker/containers/{sessionId}/{containerId}/remove",
    tag: "Docker",
    summary: "Remove container",
    description: "Removes a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "force",
        in: "query",
        required: false,
        schema: {
          type: "boolean",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /fleets/{id}",
    method: "DELETE",
    path: "/fleets/{id}",
    tag: "Fleets",
    summary: "Delete a fleet",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /fleets/{id}/members/{hostId}",
    method: "DELETE",
    path: "/fleets/{id}/members/{hostId}",
    tag: "Fleets",
    summary: "Remove a host from a fleet's static membership",
    description:
      "Only removes the static membership row - a host still matched by the fleet's tag rules remains an effective member.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /homepage/items/{id}",
    method: "DELETE",
    path: "/homepage/items/{id}",
    tag: "Homepage",
    summary: "Delete homepage item",
    description: "Deletes a homepage widget item and cascades deletion to children if a folder.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /host/autostart/disable",
    method: "DELETE",
    path: "/host/autostart/disable",
    tag: "SSH",
    summary: "Disable autostart for SSH configuration",
    description: "Disables autostart for a specific SSH configuration.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sshConfigId: {
          type: "number",
        },
      },
    },
  },
  {
    operationKey: "DELETE /host/command-history",
    method: "DELETE",
    path: "/host/command-history",
    tag: "SSH",
    summary: "Delete command from history",
    description: "Deletes a specific command from the history of a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        command: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /host/db/host/{id}",
    method: "DELETE",
    path: "/host/db/host/{id}",
    tag: "SSH",
    summary: "Delete SSH host",
    description: "Deletes an SSH host by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /host/file_manager/pinned",
    method: "DELETE",
    path: "/host/file_manager/pinned",
    tag: "SSH",
    summary: "Remove pinned file",
    description: "Removes a file from the list of pinned files for a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /host/file_manager/recent",
    method: "DELETE",
    path: "/host/file_manager/recent",
    tag: "SSH",
    summary: "Remove recent file",
    description: "Removes a file from the list of recent files for a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /host/file_manager/shortcuts",
    method: "DELETE",
    path: "/host/file_manager/shortcuts",
    tag: "SSH",
    summary: "Remove shortcut",
    description: "Removes a shortcut for a specific host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /host/folders/{name}/hosts",
    method: "DELETE",
    path: "/host/folders/{name}/hosts",
    tag: "SSH",
    summary: "Delete all hosts in folder",
    description: "Deletes all SSH hosts within a specific folder.",
    parameters: [
      {
        name: "name",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /host/opkssh/token/{hostId}",
    method: "DELETE",
    path: "/host/opkssh/token/{hostId}",
    tag: "SSH",
    summary: "Delete OPKSSH token for a host",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
        description: "Host ID",
      },
    ],
  },
  {
    operationKey: "DELETE /notification-channels/{id}",
    method: "DELETE",
    path: "/notification-channels/{id}",
    tag: "Alerts",
    summary: "Delete a notification channel",
    parameters: [],
  },
  {
    operationKey: "DELETE /open-tabs/{id}",
    method: "DELETE",
    path: "/open-tabs/{id}",
    tag: "Open Tabs",
    summary: "Delete a single open tab",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /rbac/host/{id}/access/{accessId}",
    method: "DELETE",
    path: "/rbac/host/{id}/access/{accessId}",
    tag: "RBAC",
    summary: "Revoke host access",
    description: "Revokes a user's or role's access to a host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "accessId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /rbac/roles/{id}",
    method: "DELETE",
    path: "/rbac/roles/{id}",
    tag: "RBAC",
    summary: "Delete a role",
    description: "Deletes a role by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /rbac/snippet/{id}/access/{accessId}",
    method: "DELETE",
    path: "/rbac/snippet/{id}/access/{accessId}",
    tag: "RBAC",
    summary: "Revoke snippet access",
    description: "Revokes a user's or role's access to a snippet.",
    parameters: [],
  },
  {
    operationKey: "DELETE /rbac/users/{userId}/roles/{roleId}",
    method: "DELETE",
    path: "/rbac/users/{userId}/roles/{roleId}",
    tag: "RBAC",
    summary: "Remove a role from a user",
    description: "Removes a role from a user.",
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "roleId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /service-links/{id}",
    method: "DELETE",
    path: "/service-links/{id}",
    tag: "Dashboard",
    summary: "Delete service link",
    description: "Deletes a dashboard service link by ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /session_logs/{id}",
    method: "DELETE",
    path: "/session_logs/{id}",
    tag: "Session Logs",
    summary: "Delete session log",
    description: "Deletes a session recording and its log file.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /session-sharing/{shareId}",
    method: "DELETE",
    path: "/session-sharing/{shareId}",
    tag: "Session Sharing",
    summary: "Revoke a session share",
    description:
      "Revokes a share. Owner or admin only. Best-effort kick of live SSH participants; guac joins are not force-disconnected in v1.",
    parameters: [
      {
        name: "shareId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /snippets/{id}",
    method: "DELETE",
    path: "/snippets/{id}",
    tag: "Snippets",
    summary: "Delete a snippet",
    description: "Deletes a specific snippet by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /snippets/folders/{name}",
    method: "DELETE",
    path: "/snippets/folders/{name}",
    tag: "Snippets",
    summary: "Delete a snippet folder",
    description: "Deletes a snippet folder and moves its snippets to the root.",
    parameters: [
      {
        name: "name",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /ssh/file_manager/ssh/deleteItem",
    method: "DELETE",
    path: "/ssh/file_manager/ssh/deleteItem",
    tag: "File Manager",
    summary: "Delete a file or directory",
    description: "Deletes a file or directory on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        isDirectory: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "DELETE /terminal/command_history/{hostId}",
    method: "DELETE",
    path: "/terminal/command_history/{hostId}",
    tag: "Terminal",
    summary: "Clear command history",
    description: "Clears the entire command history for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /termix-id",
    method: "DELETE",
    path: "/termix-id",
    tag: "Termix ID",
    summary: "Delete Termix ID and all associated keys",
    parameters: [],
  },
  {
    operationKey: "DELETE /termix-id/ca",
    method: "DELETE",
    path: "/termix-id/ca",
    tag: "Termix ID",
    summary: "Delete the certificate authority",
    parameters: [],
  },
  {
    operationKey: "DELETE /termix-id/keys/{id}",
    method: "DELETE",
    path: "/termix-id/keys/{id}",
    tag: "Termix ID",
    summary: "Revoke and delete a published key",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /users/api-keys/{keyId}",
    method: "DELETE",
    path: "/users/api-keys/{keyId}",
    tag: "API Keys",
    summary: "Delete an API key (admin only)",
    description: "Permanently deletes an API key. It can no longer be used to authenticate.",
    parameters: [
      {
        name: "keyId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "The ID of the API key to delete.",
      },
    ],
  },
  {
    operationKey: "DELETE /users/delete-account",
    method: "DELETE",
    path: "/users/delete-account",
    tag: "Users",
    summary: "Delete user account",
    description: "Deletes the authenticated user's account.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /users/delete-user",
    method: "DELETE",
    path: "/users/delete-user",
    tag: "Users",
    summary: "Delete user (admin only)",
    description: "Allows an admin to delete another user and all related data.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "DELETE /users/oidc-config",
    method: "DELETE",
    path: "/users/oidc-config",
    tag: "Users",
    summary: "Disable OIDC configuration",
    description: "Disables the OIDC provider configuration.",
    parameters: [],
  },
  {
    operationKey: "DELETE /users/sessions/{sessionId}",
    method: "DELETE",
    path: "/users/sessions/{sessionId}",
    tag: "Users",
    summary: "Revoke a specific session",
    description: "Revokes a specific session by ID.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "The session ID to revoke",
      },
    ],
  },
  {
    operationKey: "DELETE /users/sso-providers/{id}",
    method: "DELETE",
    path: "/users/sso-providers/{id}",
    tag: "SSO",
    summary: "Delete SSO provider",
    description: "Deletes an SSO provider. Blocked if users are associated.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /users/webauthn/credentials/{credentialId}",
    method: "DELETE",
    path: "/users/webauthn/credentials/{credentialId}",
    tag: "WebAuthn",
    summary: "Delete a passkey",
    description: "Removes one of the authenticated user's passkeys.",
    parameters: [
      {
        name: "credentialId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /vault/profiles/{id}",
    method: "DELETE",
    path: "/vault/profiles/{id}",
    tag: "Vault",
    summary: "Delete a Vault profile",
    description: "Permanently deletes a Vault signer profile. Only the owner may delete it.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "DELETE /workspaces/{id}",
    method: "DELETE",
    path: "/workspaces/{id}",
    tag: "Workspaces",
    summary: "Delete a workspace",
    description: "Rejects the Last Session workspace, which is not user-deletable.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /activity/recent",
    method: "GET",
    path: "/activity/recent",
    tag: "Dashboard",
    summary: "Get recent activity",
    description: "Fetches the most recent activities for the authenticated user.",
    parameters: [
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
        description: "The maximum number of activities to return.",
      },
    ],
  },
  {
    operationKey: "GET /ai/conversations",
    method: "GET",
    path: "/ai/conversations",
    tag: "AI",
    summary: "List the user's AI conversations",
    parameters: [],
  },
  {
    operationKey: "GET /ai/conversations/{id}",
    method: "GET",
    path: "/ai/conversations/{id}",
    tag: "AI",
    summary: "Get one conversation with its messages and proposals",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /ai/providers",
    method: "GET",
    path: "/ai/providers",
    tag: "AI",
    summary: "List the user's configured AI providers",
    parameters: [],
  },
  {
    operationKey: "GET /ai/providers/{id}/models",
    method: "GET",
    path: "/ai/providers/{id}/models",
    tag: "AI",
    summary: "List models available from a provider",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /ai/status",
    method: "GET",
    path: "/ai/status",
    tag: "AI",
    summary: "Whether the AI assistant is available to this user",
    description:
      "Deliberately not behind the AI gate: the frontend calls this to decide whether to render any AI surface at all, and needs a plain answer rather than a 403 when the feature is off.\n",
    parameters: [],
  },
  {
    operationKey: "GET /alert-firings",
    method: "GET",
    path: "/alert-firings",
    tag: "Alerts",
    summary: "List alert firings for the current user",
    parameters: [],
  },
  {
    operationKey: "GET /alert-rules",
    method: "GET",
    path: "/alert-rules",
    tag: "Alerts",
    summary: "List alert rules for the current user",
    parameters: [],
  },
  {
    operationKey: "GET /alerts",
    method: "GET",
    path: "/alerts",
    tag: "Alerts",
    summary: "Get active alerts",
    description:
      "Fetches active alerts for the authenticated user, excluding those that have been dismissed.",
    parameters: [],
  },
  {
    operationKey: "GET /alerts/dismissed",
    method: "GET",
    path: "/alerts/dismissed",
    tag: "Alerts",
    summary: "Get dismissed alerts",
    description: "Fetches a list of alerts that have been dismissed by the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /audit-logs",
    method: "GET",
    path: "/audit-logs",
    tag: "Audit",
    summary: "List audit logs",
    description: "Returns paginated, filterable audit log entries. Admin only.",
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          default: 1,
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          default: 50,
        },
      },
      {
        name: "userId",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "action",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "resourceType",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "success",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: [true, false],
        },
      },
      {
        name: "startDate",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
      {
        name: "endDate",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
    ],
  },
  {
    operationKey: "GET /audit-logs/actions",
    method: "GET",
    path: "/audit-logs/actions",
    tag: "Audit",
    summary: "List distinct audit log action types",
    description:
      "Returns all distinct action values in the audit log for filter dropdowns. Admin only.",
    parameters: [],
  },
  {
    operationKey: "GET /audit-logs/export",
    method: "GET",
    path: "/audit-logs/export",
    tag: "Audit",
    summary: "Export audit logs",
    description:
      "Streams the full filtered result set as CSV or NDJSON. Accepts the same filters as GET /audit-logs. Admin only. The export is itself audited.",
    parameters: [
      {
        name: "format",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: ["csv", "ndjson"],
          default: "csv",
        },
      },
      {
        name: "userId",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "action",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "resourceType",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "success",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: [true, false],
        },
      },
      {
        name: "startDate",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
      {
        name: "endDate",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
    ],
  },
  {
    operationKey: "GET /automations",
    method: "GET",
    path: "/automations",
    tag: "Automations",
    summary: "List the current user's automations",
    description:
      "Returns every automation the caller owns, with its parsed definition and linked notification channels.",
    parameters: [],
  },
  {
    operationKey: "GET /automations/{id}",
    method: "GET",
    path: "/automations/{id}",
    tag: "Automations",
    summary: "Fetch a single automation",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /automations/runs",
    method: "GET",
    path: "/automations/runs",
    tag: "Automations",
    summary: "List automation runs",
    parameters: [
      {
        name: "automationId",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /automations/runs/{runId}/steps",
    method: "GET",
    path: "/automations/runs/{runId}/steps",
    tag: "Automations",
    summary: "Step-by-step results for a run",
    parameters: [
      {
        name: "runId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /c2s-tunnel-presets",
    method: "GET",
    path: "/c2s-tunnel-presets",
    tag: "Tunnel Presets",
    summary: "List client tunnel presets",
    description: "Returns the authenticated user's saved client-to-server tunnel presets.",
    parameters: [],
  },
  {
    operationKey: "GET /credential-sidebar/preferences",
    method: "GET",
    path: "/credential-sidebar/preferences",
    tag: "Credential Sidebar",
    summary: "Get the credential sidebar preferences for the current user",
    description:
      "Returns the current user's saved credential sidebar preferences (sort, filters, open folders, display settings). Unlike /host-sidebar/preferences, there is no legacy-column migration to perform here — credentials never had exploded preference columns on userPreferences — so a first-time GET simply returns the defaults without writing a row; a row is only created once the user actually changes something via PUT.",
    parameters: [],
  },
  {
    operationKey: "GET /credentials",
    method: "GET",
    path: "/credentials",
    tag: "Credentials",
    summary: "Get all credentials",
    description: "Retrieves all SSH credentials for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /credentials/{id}",
    method: "GET",
    path: "/credentials/{id}",
    tag: "Credentials",
    summary: "Get a specific credential",
    description: "Retrieves a specific credential by its ID, including secrets.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /credentials/{id}/hosts",
    method: "GET",
    path: "/credentials/{id}/hosts",
    tag: "Credentials",
    summary: "Get hosts using a credential",
    description: "Retrieves a list of hosts that are using a specific credential.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /credentials/folders",
    method: "GET",
    path: "/credentials/folders",
    tag: "Credentials",
    summary: "Get credential folders",
    description: "Retrieves all unique credential folders for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /docker/containers/{sessionId}",
    method: "GET",
    path: "/docker/containers/{sessionId}",
    tag: "Docker",
    summary: "List all containers",
    description: "Lists all Docker containers on the host.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "all",
        in: "query",
        required: false,
        schema: {
          type: "boolean",
        },
      },
    ],
  },
  {
    operationKey: "GET /docker/containers/{sessionId}/{containerId}",
    method: "GET",
    path: "/docker/containers/{sessionId}/{containerId}",
    tag: "Docker",
    summary: "Get container details",
    description: "Retrieves detailed information about a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /docker/containers/{sessionId}/{containerId}/logs",
    method: "GET",
    path: "/docker/containers/{sessionId}/{containerId}/logs",
    tag: "Docker",
    summary: "Get container logs",
    description: "Retrieves logs for a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "tail",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
      },
      {
        name: "timestamps",
        in: "query",
        required: false,
        schema: {
          type: "boolean",
        },
      },
      {
        name: "since",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "until",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /docker/containers/{sessionId}/{containerId}/stats",
    method: "GET",
    path: "/docker/containers/{sessionId}/{containerId}/stats",
    tag: "Docker",
    summary: "Get container stats",
    description: "Retrieves stats for a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /docker/ssh/status",
    method: "GET",
    path: "/docker/ssh/status",
    tag: "Docker",
    summary: "Check SSH session status",
    description: "Checks the status of an active SSH session.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /docker/validate/{sessionId}",
    method: "GET",
    path: "/docker/validate/{sessionId}",
    tag: "Docker",
    summary: "Validate Docker availability",
    description: "Validates if Docker is available on the host.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /fleets",
    method: "GET",
    path: "/fleets",
    tag: "Fleets",
    summary: "List the current user's fleets",
    parameters: [],
  },
  {
    operationKey: "GET /fleets/{id}/inventory",
    method: "GET",
    path: "/fleets/{id}/inventory",
    tag: "Fleets",
    summary: "Read the last-known inventory snapshot for a fleet's members",
    description:
      "No live connection - reads back whatever the most recent POST refresh stored. Latest-only per host, no history.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /fleets/{id}/members",
    method: "GET",
    path: "/fleets/{id}/members",
    tag: "Fleets",
    summary: "List the resolved effective members of a fleet",
    description:
      "Returns the union of statically-added hosts and hosts matched by the fleet's tag rules, each annotated with the caller's permission level on that host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /global-settings",
    method: "GET",
    path: "/global-settings",
    tag: "Host Metrics",
    summary: "Get global monitoring defaults",
    parameters: [],
  },
  {
    operationKey: "GET /global-settings/history",
    method: "GET",
    path: "/global-settings/history",
    tag: "Host Metrics",
    summary: "Get metrics history retention setting",
    parameters: [],
  },
  {
    operationKey: "GET /homepage/favicon",
    method: "GET",
    path: "/homepage/favicon",
    tag: "Homepage",
    summary: "Proxy favicon fetch",
    description: "Fetches and caches a site favicon server-side to avoid CORS issues.",
    parameters: [
      {
        name: "url",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /homepage/items",
    method: "GET",
    path: "/homepage/items",
    tag: "Homepage",
    summary: "Get homepage items",
    description: "Returns all homepage widget items for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /homepage/layout",
    method: "GET",
    path: "/homepage/layout",
    tag: "Homepage",
    summary: "Get homepage layout",
    description:
      "Returns the homepage canvas layout (widget positions, pan, zoom) for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /homepage/ping",
    method: "GET",
    path: "/homepage/ping",
    tag: "Homepage",
    summary: "Check the HTTP reachability and latency of a URL",
    parameters: [
      {
        name: "url",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "ttl",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          description: "Cache TTL in seconds (min 10)",
        },
      },
    ],
  },
  {
    operationKey: "GET /homepage/proxy",
    method: "GET",
    path: "/homepage/proxy",
    tag: "Homepage",
    summary: "Proxy a JSON API URL and return the parsed response",
    parameters: [
      {
        name: "url",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "ttl",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          description: "Cache TTL in seconds (min 10, default 60)",
        },
      },
    ],
  },
  {
    operationKey: "GET /homepage/rss",
    method: "GET",
    path: "/homepage/rss",
    tag: "Homepage",
    summary: "Proxy and parse an RSS/Atom feed",
    parameters: [
      {
        name: "url",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "max",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          default: 10,
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/managers/processes/{id}",
    method: "GET",
    path: "/host-metrics/managers/processes/{id}",
    tag: "Host Metrics",
    summary: "List processes (rich, sortable, filterable client-side)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/managers/services/{id}",
    method: "GET",
    path: "/host-metrics/managers/services/{id}",
    tag: "Host Metrics",
    summary: "List systemd services",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/managers/tailscale/{id}",
    method: "GET",
    path: "/host-metrics/managers/tailscale/{id}",
    tag: "Host Metrics",
    summary: "Get Tailscale status and IPs",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/managers/wireguard/{id}",
    method: "GET",
    path: "/host-metrics/managers/wireguard/{id}",
    tag: "Host Metrics",
    summary: "Get WireGuard interfaces and peers",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/platform/{id}",
    method: "GET",
    path: "/host-metrics/platform/{id}",
    tag: "Host Metrics",
    summary: "Detect available management tooling on a host",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-metrics/preferences/{id}",
    method: "GET",
    path: "/host-metrics/preferences/{id}",
    tag: "Host Metrics",
    summary: "Get the Host Metrics layout for a host",
    description:
      "Returns the current user's saved card layout for the host, or a default layout derived from the host's enabled widgets when none is saved.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host-sidebar/preferences",
    method: "GET",
    path: "/host-sidebar/preferences",
    tag: "Host Sidebar",
    summary: "Get the host sidebar preferences for the current user",
    description:
      "Returns the current user's saved sidebar preferences (sort, group, filters, open folders, display settings). On first access, seeds the preferences from the legacy per-column user-preferences fields (showHostTags, hostTrayOnClick, compactHostView, statusColorScheme) so existing settings are not lost.",
    parameters: [],
  },
  {
    operationKey: "GET /host/autostart/status",
    method: "GET",
    path: "/host/autostart/status",
    tag: "SSH",
    summary: "Get autostart status",
    description: "Retrieves the autostart status for the user's SSH configurations.",
    parameters: [],
  },
  {
    operationKey: "GET /host/command-history/{hostId}",
    method: "GET",
    path: "/host/command-history/{hostId}",
    tag: "SSH",
    summary: "Get command history",
    description: "Retrieves the command history for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/db/host",
    method: "GET",
    path: "/host/db/host",
    tag: "SSH",
    summary: "Get all SSH hosts",
    description: "Retrieves all SSH hosts for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /host/db/host/{id}",
    method: "GET",
    path: "/host/db/host/{id}",
    tag: "SSH",
    summary: "Get SSH host by ID",
    description: "Retrieves a specific SSH host by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/db/host/{id}/export",
    method: "GET",
    path: "/host/db/host/{id}/export",
    tag: "SSH",
    summary: "Export SSH host",
    description: "Exports a specific SSH host with decrypted credentials.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/db/host/{id}/password",
    method: "GET",
    path: "/host/db/host/{id}/password",
    tag: "SSH",
    summary: "Get host password for clipboard copy",
    description: "Returns the password for a specific host. Used by the copy-password feature.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "field",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: [
            "password",
            "sudoPassword",
            "rdpPassword",
            "vncPassword",
            "telnetPassword",
            "key",
            "keyPassword",
          ],
        },
      },
    ],
  },
  {
    operationKey: "GET /host/db/host/internal",
    method: "GET",
    path: "/host/db/host/internal",
    tag: "SSH",
    summary: "Get internal SSH host data",
    description:
      "Returns internal SSH host data for autostart tunnels. Requires internal auth token.",
    parameters: [],
  },
  {
    operationKey: "GET /host/db/host/internal/all",
    method: "GET",
    path: "/host/db/host/internal/all",
    tag: "SSH",
    summary: "Get all internal SSH host data",
    description: "Returns all internal SSH host data. Requires internal auth token.",
    parameters: [],
  },
  {
    operationKey: "GET /host/db/hosts/export",
    method: "GET",
    path: "/host/db/hosts/export",
    tag: "SSH",
    summary: "Export all SSH hosts",
    description:
      "Exports all SSH hosts for the current user. By default credentials are decrypted and embedded. With `share=1`, secrets are omitted and credential-authenticated hosts instead reference a scrubbed `credentials` array by alias, suitable for handing off to another user.",
    parameters: [
      {
        name: "share",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
        description: 'Set to "1" to export without embedded secrets.',
      },
    ],
  },
  {
    operationKey: "GET /host/file_manager/pinned",
    method: "GET",
    path: "/host/file_manager/pinned",
    tag: "SSH",
    summary: "Get pinned files",
    description: "Retrieves a list of pinned files for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "query",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/file_manager/recent",
    method: "GET",
    path: "/host/file_manager/recent",
    tag: "SSH",
    summary: "Get recent files",
    description: "Retrieves a list of recent files for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "query",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/file_manager/shortcuts",
    method: "GET",
    path: "/host/file_manager/shortcuts",
    tag: "SSH",
    summary: "Get shortcuts",
    description: "Retrieves a list of shortcuts for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "query",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /host/folders",
    method: "GET",
    path: "/host/folders",
    tag: "SSH",
    summary: "Get all folders",
    description: "Retrieves all folders for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /host/opkssh-callback",
    method: "GET",
    path: "/host/opkssh-callback",
    tag: "SSH",
    summary: "Static OAuth callback from OIDC provider for OPKSSH authentication",
    parameters: [],
  },
  {
    operationKey: "GET /host/opkssh-callback/{requestId}",
    method: "GET",
    path: "/host/opkssh-callback/{requestId}",
    tag: "SSH",
    summary: "OAuth callback from OIDC provider for OPKSSH authentication (handles all sub-paths)",
    parameters: [
      {
        name: "requestId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "Authentication request ID",
      },
    ],
  },
  {
    operationKey: "GET /host/opkssh-chooser/{requestId}",
    method: "GET",
    path: "/host/opkssh-chooser/{requestId}",
    tag: "SSH",
    summary: "Proxy OPKSSH provider chooser page and all related resources",
    parameters: [
      {
        name: "requestId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "Authentication request ID",
      },
    ],
  },
  {
    operationKey: "GET /host/opkssh/token/{hostId}",
    method: "GET",
    path: "/host/opkssh/token/{hostId}",
    tag: "SSH",
    summary: "Get OPKSSH token status for a host",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
        description: "Host ID",
      },
    ],
  },
  {
    operationKey: "GET /metrics/{id}",
    method: "GET",
    path: "/metrics/{id}",
    tag: "Host Metrics",
    summary: "Get host metrics",
    description:
      "Retrieves current metrics for a specific host including CPU, memory, disk, network, processes, and system information.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /metrics/history/{id}",
    method: "GET",
    path: "/metrics/history/{id}",
    tag: "Host Metrics",
    summary: "Get historical metrics for a host",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "range",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: ["1h", "6h", "24h", "7d", "30d"],
        },
      },
      {
        name: "from",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
      {
        name: "to",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
    ],
  },
  {
    operationKey: "GET /network-topology",
    method: "GET",
    path: "/network-topology",
    tag: "Network Topology",
    summary: "Get network topology for authenticated user",
    description:
      "Retrieves the saved network topology graph (nodes and edges) for the current user. Returns null if no topology exists.",
    parameters: [],
  },
  {
    operationKey: "GET /notification-channels",
    method: "GET",
    path: "/notification-channels",
    tag: "Alerts",
    summary: "List notification channels for the current user",
    parameters: [],
  },
  {
    operationKey: "GET /open-tabs",
    method: "GET",
    path: "/open-tabs",
    tag: "Open Tabs",
    summary: "Get all open tabs for the current user",
    parameters: [],
  },
  {
    operationKey: "GET /open-tabs/active-sessions",
    method: "GET",
    path: "/open-tabs/active-sessions",
    tag: "Open Tabs",
    summary: "Get all active backend sessions for the current user",
    description:
      "Returns live terminal sessions from the session manager, both sessions the caller owns and SSH sessions shared to the caller by another user (via an in-app session share). Used by the Active Connections panel and tab restore logic.\n",
    parameters: [],
  },
  {
    operationKey: "GET /proxmox-stats/{id}",
    method: "GET",
    path: "/proxmox-stats/{id}",
    tag: "Proxmox Stats",
    summary: "Get cached Proxmox node stats for a host",
    description:
      "Returns the most recently polled Proxmox Stats snapshot for a host, or an empty skeleton if none has been collected yet.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /proxmox-stats/history/{hostId}",
    method: "GET",
    path: "/proxmox-stats/history/{hostId}",
    tag: "Proxmox Stats",
    summary: "Get historical Proxmox node stats for a host",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "range",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: ["1h", "6h", "24h", "7d", "30d"],
        },
      },
      {
        name: "from",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
      {
        name: "to",
        in: "query",
        required: false,
        schema: {
          type: "string",
          format: "date-time",
        },
      },
    ],
  },
  {
    operationKey: "GET /rbac/host-access/{hostId}/auth/{protocol}",
    method: "GET",
    path: "/rbac/host-access/{hostId}/auth/{protocol}",
    tag: "RBAC",
    summary: "Get the current recipient's shared-host protocol authentication override",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/host/{id}/access",
    method: "GET",
    path: "/rbac/host/{id}/access",
    tag: "RBAC",
    summary: "Get host access list",
    description: "Retrieves the list of users and roles that have access to a host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /rbac/permissions/catalog",
    method: "GET",
    path: "/rbac/permissions/catalog",
    tag: "RBAC",
    summary: "Get the role permissions catalog",
    description:
      "Returns the grouped catalog of role permission strings used by the role permissions editor.",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/roles",
    method: "GET",
    path: "/rbac/roles",
    tag: "RBAC",
    summary: "Get all roles",
    description: "Retrieves a list of all roles.",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/shared-hosts",
    method: "GET",
    path: "/rbac/shared-hosts",
    tag: "RBAC",
    summary: "Get shared hosts",
    description: "Retrieves the list of hosts that have been shared with the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/shared-snippets",
    method: "GET",
    path: "/rbac/shared-snippets",
    tag: "RBAC",
    summary: "Get shared snippets",
    description: "Retrieves snippets shared with the current user.",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/snippet/{id}/access",
    method: "GET",
    path: "/rbac/snippet/{id}/access",
    tag: "RBAC",
    summary: "Get snippet access list",
    description: "Retrieves the list of users and roles with access to a snippet.",
    parameters: [],
  },
  {
    operationKey: "GET /rbac/users/{userId}/roles",
    method: "GET",
    path: "/rbac/users/{userId}/roles",
    tag: "RBAC",
    summary: "Get user's roles",
    description: "Retrieves a list of roles for a specific user.",
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /service-links",
    method: "GET",
    path: "/service-links",
    tag: "Dashboard",
    summary: "Get service links",
    description: "Returns all dashboard service links for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /session_logs",
    method: "GET",
    path: "/session_logs",
    tag: "Session Logs",
    summary: "List session logs",
    description: "Returns all terminal session recordings for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /session_logs/{id}",
    method: "GET",
    path: "/session_logs/{id}",
    tag: "Session Logs",
    summary: "Get session log metadata",
    description: "Returns metadata for a single session recording.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /session_logs/{id}/content",
    method: "GET",
    path: "/session_logs/{id}/content",
    tag: "Session Logs",
    summary: "Get session log content",
    description: "Returns the raw text content of a session log file.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /session-sharing/host/{hostId}/active",
    method: "GET",
    path: "/session-sharing/host/{hostId}/active",
    tag: "Session Sharing",
    summary: "List active session shares for a host",
    description:
      "Returns active (non-revoked, non-expired) shares owned by the caller for the given host.",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /session-sharing/resolve/{linkToken}",
    method: "GET",
    path: "/session-sharing/resolve/{linkToken}",
    tag: "Session Sharing",
    summary: "Resolve a guest share link",
    description:
      "Public, unauthenticated endpoint for anonymous share-link guests. Never returns host name, IP, username, or hostId. Rate-limited per IP.",
    parameters: [
      {
        name: "linkToken",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /snippets",
    method: "GET",
    path: "/snippets",
    tag: "Snippets",
    summary: "Get all snippets",
    description: "Retrieves all snippets for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /snippets/{id}",
    method: "GET",
    path: "/snippets/{id}",
    tag: "Snippets",
    summary: "Get a specific snippet",
    description: "Retrieves a specific snippet by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /snippets/export",
    method: "GET",
    path: "/snippets/export",
    tag: "Snippets",
    summary: "Export all snippets and folders as JSON",
    description:
      "Returns all snippets and snippet folders for the authenticated user as a JSON export.",
    parameters: [],
  },
  {
    operationKey: "GET /snippets/folders",
    method: "GET",
    path: "/snippets/folders",
    tag: "Snippets",
    summary: "Get all snippet folders",
    description: "Retrieves all snippet folders for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /ssh/file_manager/ssh/identifySymlink",
    method: "GET",
    path: "/ssh/file_manager/ssh/identifySymlink",
    tag: "File Manager",
    summary: "Identify symbolic link",
    description: "Identifies the target of a symbolic link.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "path",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /ssh/file_manager/ssh/listFiles",
    method: "GET",
    path: "/ssh/file_manager/ssh/listFiles",
    tag: "File Manager",
    summary: "List files in a directory",
    description: "Lists the files and directories in a given path on the remote host.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "path",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /ssh/file_manager/ssh/readFile",
    method: "GET",
    path: "/ssh/file_manager/ssh/readFile",
    tag: "File Manager",
    summary: "Read a file",
    description: "Reads the content of a file from the remote host.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "path",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /ssh/file_manager/ssh/resolvePath",
    method: "GET",
    path: "/ssh/file_manager/ssh/resolvePath",
    tag: "File Manager",
    summary: "Resolve a path with environment variables",
    description: "Expands environment variables and ~ in a path via the SSH session.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "path",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /ssh/file_manager/ssh/status",
    method: "GET",
    path: "/ssh/file_manager/ssh/status",
    tag: "File Manager",
    summary: "Get SSH connection status",
    description: "Checks the status of an SSH connection for file manager.",
    parameters: [
      {
        name: "sessionId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /ssh/tunnel/status",
    method: "GET",
    path: "/ssh/tunnel/status",
    tag: "SSH Tunnels",
    summary: "Get all tunnel statuses",
    description: "Retrieves the status of all SSH tunnels.",
    parameters: [],
  },
  {
    operationKey: "GET /ssh/tunnel/status/{tunnelName}",
    method: "GET",
    path: "/ssh/tunnel/status/{tunnelName}",
    tag: "SSH Tunnels",
    summary: "Get tunnel status by name",
    description: "Retrieves the status of a specific SSH tunnel by its name.",
    parameters: [
      {
        name: "tunnelName",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /status",
    method: "GET",
    path: "/status",
    tag: "Host Metrics",
    summary: "Get all host statuses",
    description: "Retrieves the status of all hosts for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /status/{id}",
    method: "GET",
    path: "/status/{id}",
    tag: "Host Metrics",
    summary: "Get host status by ID",
    description: "Retrieves the status of a specific host by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /sync/{entityType}",
    method: "GET",
    path: "/sync/{entityType}",
    tag: "Sync",
    summary: "Pull synced rows for an entity type",
    description:
      "Returns rows owned by the authenticated user whose updatedAt is newer than `since` (or all rows if omitted). Used by the desktop app's remote sync engine to reconcile the embedded backend against a connected remote server.",
    parameters: [
      {
        name: "entityType",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "since",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /sync/{entityType}/tombstones",
    method: "GET",
    path: "/sync/{entityType}/tombstones",
    tag: "Sync",
    summary: "Pull deletion tombstones for an entity type",
    description:
      "Returns tombstones recorded since `since` so the other side of a sync pair can apply the same deletions.",
    parameters: [
      {
        name: "entityType",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "since",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /tailscale/devices",
    method: "GET",
    path: "/tailscale/devices",
    tag: "Tailscale",
    summary: "List Tailscale devices",
    description: "Returns the list of devices in the configured tailnet using the stored API key.",
    parameters: [],
  },
  {
    operationKey: "GET /terminal/command_history/{hostId}",
    method: "GET",
    path: "/terminal/command_history/{hostId}",
    tag: "Terminal",
    summary: "Get command history",
    description: "Retrieves the command history for a specific host.",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "GET /terminal/session_settings",
    method: "GET",
    path: "/terminal/session_settings",
    tag: "Terminal",
    summary: "Get session persistence settings",
    description: "Returns the session timeout and persistence enabled flag.",
    parameters: [],
  },
  {
    operationKey: "GET /termix-id/ca",
    method: "GET",
    path: "/termix-id/ca",
    tag: "Termix ID",
    summary: "Get current user's certificate authority",
    parameters: [],
  },
  {
    operationKey: "GET /termix-id/check/{handle}",
    method: "GET",
    path: "/termix-id/check/{handle}",
    tag: "Termix ID",
    summary: "Check if a handle is available",
    parameters: [
      {
        name: "handle",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /termix-id/linked-credentials",
    method: "GET",
    path: "/termix-id/linked-credentials",
    tag: "Termix ID",
    summary: "Get credential IDs that have at least one enabled published Termix ID key",
    parameters: [],
  },
  {
    operationKey: "GET /termix-id/me",
    method: "GET",
    path: "/termix-id/me",
    tag: "Termix ID",
    summary: "Get current user's Termix ID and keys",
    parameters: [],
  },
  {
    operationKey: "GET /ui-preferences",
    method: "GET",
    path: "/ui-preferences",
    tag: "UI Preferences",
    summary: "Get the UI complexity preferences for the current user",
    description:
      "Returns the current user's interface preset (simple, balanced, advanced or custom), their per-area overrides, and their onboarding state. A first-time GET returns defaults without writing a row; a row is only created once the user actually changes something via PUT. Users who registered before this feature existed are returned an already-completed onboarding state so they are never shown the first-run flow.",
    parameters: [],
  },
  {
    operationKey: "GET /uptime",
    method: "GET",
    path: "/uptime",
    tag: "Dashboard",
    summary: "Get server uptime",
    description: "Returns the uptime of the server in various formats.",
    parameters: [],
  },
  {
    operationKey: "GET /user-preferences",
    method: "GET",
    path: "/user-preferences",
    tag: "User Preferences",
    summary: "Get preferences for the current user",
    description:
      "showHostTags, hostTrayOnClick, compactHostView, statusColorScheme and foldersCollapsed are legacy fields, kept here read-only for backward compatibility. The authoritative copy is GET /host-sidebar/preferences.",
    parameters: [],
  },
  {
    operationKey: "GET /users/acme-ssl-settings",
    method: "GET",
    path: "/users/acme-ssl-settings",
    tag: "Users",
    summary: "Get ACME SSL settings",
    description: "Returns current ACME/Let's Encrypt configuration and certificate status.",
    parameters: [],
  },
  {
    operationKey: "GET /users/admin/export/{userId}",
    method: "GET",
    path: "/users/admin/export/{userId}",
    tag: "Users",
    summary: "Export a user's data (admin only)",
    description:
      "Downloads a JSON export of another user's data (hosts, credentials, file manager bookmarks). Secrets are decrypted server-side, so handle the file carefully.",
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /users/ai-enabled",
    method: "GET",
    path: "/users/ai-enabled",
    tag: "Users",
    summary: "Get whether the AI assistant is enabled instance-wide",
    parameters: [],
  },
  {
    operationKey: "GET /users/ai-private-endpoints",
    method: "GET",
    path: "/users/ai-private-endpoints",
    tag: "Users",
    summary: "Get the allowlist of private AI endpoint hosts",
    parameters: [],
  },
  {
    operationKey: "GET /users/analytics-enabled",
    method: "GET",
    path: "/users/analytics-enabled",
    tag: "Users",
    summary: "Get analytics enabled setting",
    description:
      "Returns whether anonymous usage telemetry is enabled, and whether the value is locked by the ENABLE_TELEMETRY environment variable.",
    parameters: [],
  },
  {
    operationKey: "GET /users/api-keys",
    method: "GET",
    path: "/users/api-keys",
    tag: "API Keys",
    summary: "List all API keys (admin only)",
    description: "Returns all API keys with associated usernames. Token hashes are never returned.",
    parameters: [],
  },
  {
    operationKey: "GET /users/command-history-enabled",
    method: "GET",
    path: "/users/command-history-enabled",
    tag: "Users",
    summary: "Get command history enabled setting",
    description: "Returns whether command history recording is globally enabled.",
    parameters: [],
  },
  {
    operationKey: "GET /users/count",
    method: "GET",
    path: "/users/count",
    tag: "Users",
    summary: "Count users",
    description: "Returns the total number of users in the system.",
    parameters: [],
  },
  {
    operationKey: "GET /users/data-status",
    method: "GET",
    path: "/users/data-status",
    tag: "Users",
    summary: "Check user data unlock status",
    description: "Checks if user data is currently unlocked.",
    parameters: [],
  },
  {
    operationKey: "GET /users/db-health",
    method: "GET",
    path: "/users/db-health",
    tag: "Users",
    summary: "Database health check",
    description: "Checks if the database is accessible.",
    parameters: [],
  },
  {
    operationKey: "GET /users/guacamole-settings",
    method: "GET",
    path: "/users/guacamole-settings",
    tag: "Users",
    summary: "Get Guacamole settings",
    description:
      "Returns current guacd enabled status and host:port URL. No authentication required.",
    parameters: [],
  },
  {
    operationKey: "GET /users/host-defaults",
    method: "GET",
    path: "/users/host-defaults",
    tag: "Users",
    summary: "Get host creation defaults",
    description: "Returns the global default settings applied when creating a new host.",
    parameters: [],
  },
  {
    operationKey: "GET /users/list",
    method: "GET",
    path: "/users/list",
    tag: "Users",
    summary: "List users",
    description:
      "Retrieves users in the system. Without `limit` the full list is returned, which is what the sharing pickers rely on. Pass `limit` (and optionally `offset`/`search`) to page through large directories.\n",
    parameters: [
      {
        name: "search",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
        description: "Case-insensitive username substring filter.",
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
        description: "Page size. Omit to return every user.",
      },
      {
        name: "offset",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
        description: "Number of users to skip. Requires `limit`.",
      },
    ],
  },
  {
    operationKey: "GET /users/log-level",
    method: "GET",
    path: "/users/log-level",
    tag: "Users",
    summary: "Get log level setting",
    description: "Returns the configured log verbosity level.",
    parameters: [],
  },
  {
    operationKey: "GET /users/me",
    method: "GET",
    path: "/users/me",
    tag: "Users",
    summary: "Get current user's info",
    description: "Retrieves information about the currently authenticated user.",
    parameters: [],
  },
  {
    operationKey: "GET /users/me/token",
    method: "GET",
    path: "/users/me/token",
    tag: "Users",
    summary: "Get current session token",
    description:
      "Returns the JWT for the currently authenticated session. Intended for mobile WebView clients that cannot read HTTP-only cookies.",
    parameters: [],
  },
  {
    operationKey: "GET /users/oidc-config",
    method: "GET",
    path: "/users/oidc-config",
    tag: "Users",
    summary: "Get OIDC configuration",
    description: "Returns the public OIDC configuration.",
    parameters: [],
  },
  {
    operationKey: "GET /users/oidc-config/admin",
    method: "GET",
    path: "/users/oidc-config/admin",
    tag: "Users",
    summary: "Get OIDC configuration for admin",
    description: "Returns the full OIDC configuration for an admin.",
    parameters: [],
  },
  {
    operationKey: "GET /users/oidc-silent-login-default",
    method: "GET",
    path: "/users/oidc-silent-login-default",
    tag: "Users",
    summary: "Get OIDC silent login default setting",
    description:
      "Returns whether silent OIDC login is enabled as the default behavior. Can be pinned via the OIDC_SILENT_LOGIN_DEFAULT env var.",
    parameters: [],
  },
  {
    operationKey: "GET /users/oidc/authorize",
    method: "GET",
    path: "/users/oidc/authorize",
    tag: "Users",
    summary: "Get OIDC authorization URL",
    description: "Returns the OIDC authorization URL.",
    parameters: [
      {
        name: "rememberMe",
        in: "query",
        required: false,
        schema: {
          type: "boolean",
        },
        description: "Whether to extend the session to 30 days instead of 2 hours.",
      },
    ],
  },
  {
    operationKey: "GET /users/oidc/callback",
    method: "GET",
    path: "/users/oidc/callback",
    tag: "Users",
    summary: "OIDC callback",
    description:
      "Handles the OIDC callback, exchanges the code for a token, and creates or logs in the user.",
    parameters: [],
  },
  {
    operationKey: "GET /users/password-login-allowed",
    method: "GET",
    path: "/users/password-login-allowed",
    tag: "Users",
    summary: "Get password login status",
    description: "Checks if password-based login is currently allowed.",
    parameters: [],
  },
  {
    operationKey: "GET /users/password-reset-allowed",
    method: "GET",
    path: "/users/password-reset-allowed",
    tag: "Users",
    summary: "Get password reset status",
    description: "Checks if password reset is currently allowed.",
    parameters: [],
  },
  {
    operationKey: "GET /users/registration-allowed",
    method: "GET",
    path: "/users/registration-allowed",
    tag: "Users",
    summary: "Get registration status",
    description: "Checks if user registration is currently allowed.",
    parameters: [],
  },
  {
    operationKey: "GET /users/session-sharing-enabled",
    method: "GET",
    path: "/users/session-sharing-enabled",
    tag: "Users",
    summary: "Get session sharing globally enabled setting",
    description:
      "Returns whether live session sharing (terminal/RDP/VNC/Telnet share links and in-app joins) is allowed instance-wide. Overrides every per-host toggle when false.",
    parameters: [],
  },
  {
    operationKey: "GET /users/session-timeout",
    method: "GET",
    path: "/users/session-timeout",
    tag: "Users",
    summary: "Get session timeout setting",
    description: "Returns the configured session timeout in hours.",
    parameters: [],
  },
  {
    operationKey: "GET /users/sessions",
    method: "GET",
    path: "/users/sessions",
    tag: "Users",
    summary: "Get sessions",
    description: "Retrieves all sessions for authenticated user (or all sessions for admins).",
    parameters: [],
  },
  {
    operationKey: "GET /users/setup-required",
    method: "GET",
    path: "/users/setup-required",
    tag: "Users",
    summary: "Check if setup is required",
    description: "Checks if the system requires initial setup (i.e., no users exist).",
    parameters: [],
  },
  {
    operationKey: "GET /users/sso-providers",
    method: "GET",
    path: "/users/sso-providers",
    tag: "SSO",
    summary: "List enabled SSO providers (public)",
    description: "Returns public info for all enabled SSO providers for the login page.",
    parameters: [],
  },
  {
    operationKey: "GET /users/sso-providers/admin",
    method: "GET",
    path: "/users/sso-providers/admin",
    tag: "SSO",
    summary: "List all SSO providers (admin)",
    description: "Returns full SSO provider list with decrypted configs for the admin panel.",
    parameters: [],
  },
  {
    operationKey: "GET /users/tailscale-settings",
    method: "GET",
    path: "/users/tailscale-settings",
    tag: "Users",
    summary: "Get Tailscale settings",
    description: "Returns whether a Tailscale API key is configured (value is masked).",
    parameters: [],
  },
  {
    operationKey: "GET /users/terminal-image-storage-settings",
    method: "GET",
    path: "/users/terminal-image-storage-settings",
    tag: "Users",
    summary: "Get terminal image storage settings (admin only)",
    description:
      "Returns the effective terminal image storage settings. The backend-internal localDir is never exposed; only the agent-visible hostPath is returned.",
    parameters: [],
  },
  {
    operationKey: "GET /users/webauthn/credentials",
    method: "GET",
    path: "/users/webauthn/credentials",
    tag: "WebAuthn",
    summary: "List passkeys",
    description: "Lists the authenticated user's registered passkeys.",
    parameters: [],
  },
  {
    operationKey: "GET /vault/oidc/callback",
    method: "GET",
    path: "/vault/oidc/callback",
    tag: "Vault",
    summary: "Vault OIDC callback",
    description:
      "Unauthenticated endpoint the IdP redirects to after login. Correlates the authorization code to a pending session via the Vault-issued state parameter.",
    parameters: [
      {
        name: "state",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "code",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "error",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "GET /vault/profiles",
    method: "GET",
    path: "/vault/profiles",
    tag: "Vault",
    summary: "List Vault profiles",
    description:
      "Returns all Vault signer profiles owned by the authenticated user or marked as shared.",
    parameters: [],
  },
  {
    operationKey: "GET /workspaces",
    method: "GET",
    path: "/workspaces",
    tag: "Workspaces",
    summary: "List the current user's saved workspaces",
    description:
      'Returns every manual workspace plus the single auto-maintained "Last Session" workspace, each with a computed tabCount.',
    parameters: [],
  },
  {
    operationKey: "GET /workspaces/last-session",
    method: "GET",
    path: "/workspaces/last-session",
    tag: "Workspaces",
    summary: 'Fetch the auto-maintained "Last Session" workspace',
    description: "Returns null if the current session has never been auto-saved yet.",
    parameters: [],
  },
  {
    operationKey: "PATCH /ai/providers/{id}",
    method: "PATCH",
    path: "/ai/providers/{id}",
    tag: "AI",
    summary: "Update an AI provider",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PATCH /fleets/{id}",
    method: "PATCH",
    path: "/fleets/{id}",
    tag: "Fleets",
    summary: "Update a fleet",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PATCH /host/bulk-update",
    method: "PATCH",
    path: "/host/bulk-update",
    tag: "SSH",
    summary: "Bulk update partial fields on multiple SSH hosts",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostIds: {
          type: "array",
          items: {
            type: "number",
          },
        },
        updates: {
          type: "object",
          description:
            "Partial fields to apply. Setting folder clears parentHostId and vice versa, since a host is either in a folder or nested under a parent host.",
          properties: {
            folder: {
              type: "string",
            },
            parentHostId: {
              type: "integer",
              nullable: true,
            },
          },
        },
      },
    },
  },
  {
    operationKey: "PATCH /open-tabs/{id}",
    method: "PATCH",
    path: "/open-tabs/{id}",
    tag: "Open Tabs",
    summary: "Update a single open tab",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "PATCH /rbac/host/{id}/access/{accessId}",
    method: "PATCH",
    path: "/rbac/host/{id}/access/{accessId}",
    tag: "RBAC",
    summary: "Update a host access grant",
    description:
      "Changes the permission level and/or expiry of an existing host access grant. Allowed for the host owner or recipients holding the manage level.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "accessId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        permissionLevel: {
          type: "string",
          enum: ["connect", "view", "edit", "manage"],
        },
        durationHours: {
          type: "number",
          description: "Hours from now until the grant expires; null clears the expiry.",
          nullable: true,
        },
      },
    },
  },
  {
    operationKey: "PATCH /termix-id/keys/{id}",
    method: "PATCH",
    path: "/termix-id/keys/{id}",
    tag: "Termix ID",
    summary: "Update key metadata (enabled state or label)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
        label: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/acme-ssl-settings",
    method: "PATCH",
    path: "/users/acme-ssl-settings",
    tag: "Users",
    summary: "Update ACME SSL settings (admin only)",
    description: "Saves ACME/Let's Encrypt configuration.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
        domain: {
          type: "string",
        },
        email: {
          type: "string",
        },
        challengeType: {
          type: "string",
          enum: ["http-webroot", "dns-cloudflare", "manual"],
        },
        cloudflareToken: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/ai-enabled",
    method: "PATCH",
    path: "/users/ai-enabled",
    tag: "Users",
    summary: "Update the instance-wide AI assistant setting (admin only)",
    description:
      "Turning this off hides and blocks the assistant for every user, whatever their own preference says.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/ai-private-endpoints",
    method: "PATCH",
    path: "/users/ai-private-endpoints",
    tag: "Users",
    summary: "Replace the allowlist of private AI endpoint hosts (admin only)",
    description:
      "Providers on private or loopback addresses, such as a self-hosted Ollama, are refused unless their host appears here. Without this an ordinary user could point a provider at an internal service and use the server as a probe of its own network.\n",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hosts: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/analytics-enabled",
    method: "PATCH",
    path: "/users/analytics-enabled",
    tag: "Users",
    summary: "Update analytics enabled setting (admin only)",
    description: "Enables or disables the daily anonymous usage telemetry heartbeat.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/command-history-enabled",
    method: "PATCH",
    path: "/users/command-history-enabled",
    tag: "Users",
    summary: "Update command history enabled setting (admin only)",
    description: "Globally enables or disables command history recording for all hosts.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/guacamole-settings",
    method: "PATCH",
    path: "/users/guacamole-settings",
    tag: "Users",
    summary: "Update Guacamole settings",
    description: "Admin-only. Updates guacd enabled status and/or host:port URL.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
        url: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/host-defaults",
    method: "PATCH",
    path: "/users/host-defaults",
    tag: "Users",
    summary: "Update host creation defaults (admin only)",
    description: "Sets global default settings applied when a new host is created.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "PATCH /users/log-level",
    method: "PATCH",
    path: "/users/log-level",
    tag: "Users",
    summary: "Update log level setting (admin only)",
    description: "Sets the log verbosity level.",
    parameters: [],
  },
  {
    operationKey: "PATCH /users/oidc-silent-login-default",
    method: "PATCH",
    path: "/users/oidc-silent-login-default",
    tag: "Users",
    summary: "Set OIDC silent login default setting",
    description: "Enables or disables silent OIDC login as the default behavior on the login page.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/password-login-allowed",
    method: "PATCH",
    path: "/users/password-login-allowed",
    tag: "Users",
    summary: "Set password login status",
    description: "Enables or disables password-based login.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        allowed: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/password-reset-allowed",
    method: "PATCH",
    path: "/users/password-reset-allowed",
    tag: "Users",
    summary: "Set password reset status",
    description: "Enables or disables password reset.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        allowed: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/registration-allowed",
    method: "PATCH",
    path: "/users/registration-allowed",
    tag: "Users",
    summary: "Set registration status",
    description: "Enables or disables user registration.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        allowed: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/session-sharing-enabled",
    method: "PATCH",
    path: "/users/session-sharing-enabled",
    tag: "Users",
    summary: "Update session sharing globally enabled setting (admin only)",
    description:
      "Enables or disables live session sharing instance-wide, overriding every per-host allowSessionSharing toggle.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/session-timeout",
    method: "PATCH",
    path: "/users/session-timeout",
    tag: "Users",
    summary: "Update session timeout setting (admin only)",
    description: "Sets the session timeout in hours.",
    parameters: [],
  },
  {
    operationKey: "PATCH /users/tailscale-settings",
    method: "PATCH",
    path: "/users/tailscale-settings",
    tag: "Users",
    summary: "Update Tailscale settings (admin only)",
    description: "Saves or clears the Tailscale API key used for device discovery.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        apiKey: {
          type: "string",
        },
        apiBaseUrl: {
          type: "string",
          description:
            "Optional custom control-plane API base URL (e.g. a Headscale instance). Leave empty to use the Tailscale default.",
        },
      },
    },
  },
  {
    operationKey: "PATCH /users/terminal-image-storage-settings",
    method: "PATCH",
    path: "/users/terminal-image-storage-settings",
    tag: "Users",
    summary: "Update terminal image storage settings (admin only)",
    description:
      "Persists a partial update. Accepts only mode (auto, local, remote-sftp), localDir, hostPath, ttlMs, maxCount and maxBytes; invalid values are rejected with a 400.",
    parameters: [],
  },
  {
    operationKey: "PATCH /workspaces/{id}",
    method: "PATCH",
    path: "/workspaces/{id}",
    tag: "Workspaces",
    summary: "Rename or recolor a workspace",
    description:
      "Does not accept a payload - use PUT /workspaces/{id}/content to overwrite a workspace's saved tab arrangement. Rejects the Last Session workspace.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /activity/log",
    method: "POST",
    path: "/activity/log",
    tag: "Dashboard",
    summary: "Log a new activity",
    description:
      "Logs a new user activity, such as accessing a terminal or file manager. This endpoint is rate-limited.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [
            "terminal",
            "file_manager",
            "server_stats",
            "tunnel",
            "docker",
            "telnet",
            "vnc",
            "rdp",
          ],
        },
        hostId: {
          type: "integer",
        },
        hostName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ai/chat/stream",
    method: "POST",
    path: "/ai/chat/stream",
    tag: "AI",
    summary: "Send a message and stream the assistant's reply",
    description:
      "Server-sent events. Emits token, tool_call, tool_result, proposal, done and error frames.\n",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        conversationId: {
          type: "integer",
        },
        providerId: {
          type: "integer",
        },
        model: {
          type: "string",
        },
        message: {
          type: "string",
        },
        activeTab: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ai/probe-models",
    method: "POST",
    path: "/ai/probe-models",
    tag: "AI",
    summary: "List models for a provider that has not been saved yet",
    description:
      "Lets the add-provider form fill its model picker before the provider exists, so nobody has to go and look up model names by hand.\n",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        providerType: {
          type: "string",
        },
        baseUrl: {
          type: "string",
        },
        apiKey: {
          type: "string",
        },
        providerId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /ai/proposals/{id}/apply",
    method: "POST",
    path: "/ai/proposals/{id}/apply",
    tag: "AI",
    summary: "Apply a pending proposal",
    description:
      "Re-validates the stored payload and dispatches it through the same repository logic a manual action uses.\n",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /ai/proposals/{id}/reject",
    method: "POST",
    path: "/ai/proposals/{id}/reject",
    tag: "AI",
    summary: "Reject a pending proposal",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /ai/providers",
    method: "POST",
    path: "/ai/providers",
    tag: "AI",
    summary: "Add an AI provider",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        providerType: {
          type: "string",
        },
        label: {
          type: "string",
        },
        baseUrl: {
          type: "string",
        },
        apiKey: {
          type: "string",
        },
        defaultModel: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /alert-firings/{id}/acknowledge",
    method: "POST",
    path: "/alert-firings/{id}/acknowledge",
    tag: "Alerts",
    summary: "Acknowledge an alert firing",
    parameters: [],
  },
  {
    operationKey: "POST /alert-firings/acknowledge-all",
    method: "POST",
    path: "/alert-firings/acknowledge-all",
    tag: "Alerts",
    summary: "Acknowledge all alert firings for the current user",
    parameters: [],
  },
  {
    operationKey: "POST /alert-rules",
    method: "POST",
    path: "/alert-rules",
    tag: "Alerts",
    summary: "Create an alert rule",
    parameters: [],
  },
  {
    operationKey: "POST /alerts/dismiss",
    method: "POST",
    path: "/alerts/dismiss",
    tag: "Alerts",
    summary: "Dismiss an alert",
    description: "Marks an alert as dismissed for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        alertId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /automations",
    method: "POST",
    path: "/automations",
    tag: "Automations",
    summary: "Create an automation",
    description:
      "Validates the trigger and every step before storing the definition. A schedule trigger also registers its next due time.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        definition: {
          type: "object",
        },
      },
    },
  },
  {
    operationKey: "POST /automations/{id}/run",
    method: "POST",
    path: "/automations/{id}/run",
    tag: "Automations",
    summary: "Run an automation now",
    description:
      "Runs immediately, as the automation's owner. Pass dryRun to record what each step would do without touching anything outside Termix.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        dryRun: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "POST /automations/webhook/{token}",
    method: "POST",
    path: "/automations/webhook/{token}",
    tag: "Automations",
    summary: "Trigger an automation from an external system",
    description:
      "Unauthenticated by design; the 32-byte token in the path is the credential and is compared against a stored hash in constant time.",
    parameters: [
      {
        name: "token",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /c2s-tunnel-presets",
    method: "POST",
    path: "/c2s-tunnel-presets",
    tag: "Tunnel Presets",
    summary: "Create a client tunnel preset",
    description: "Saves a named client-to-server tunnel configuration for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        config: {
          type: "array",
          items: {
            type: "object",
          },
        },
      },
    },
  },
  {
    operationKey: "POST /clear-connections",
    method: "POST",
    path: "/clear-connections",
    tag: "Host Metrics",
    summary: "Clear all SSH connections",
    description: "Clears all SSH connections from the connection pool.",
    parameters: [],
  },
  {
    operationKey: "POST /credentials",
    method: "POST",
    path: "/credentials",
    tag: "Credentials",
    summary: "Create a new credential",
    description: "Creates a new SSH credential for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        folder: {
          type: "string",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
        authType: {
          type: "string",
          enum: ["password", "key"],
        },
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        key: {
          type: "string",
        },
        keyPassword: {
          type: "string",
        },
        keyType: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/{id}/apply-to-host/{hostId}",
    method: "POST",
    path: "/credentials/{id}/apply-to-host/{hostId}",
    tag: "Credentials",
    summary: "Apply a credential to a host",
    description: "Applies a credential to an SSH host for quick application.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /credentials/{id}/deploy-to-host",
    method: "POST",
    path: "/credentials/{id}/deploy-to-host",
    tag: "Credentials",
    summary: "Deploy SSH key to a host",
    description: "Deploys an SSH public key to a target host's authorized_keys file.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        targetHostId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/{id}/duplicate",
    method: "POST",
    path: "/credentials/{id}/duplicate",
    tag: "Credentials",
    summary: "Duplicate a credential",
    description:
      "Creates a new credential from an existing one, optionally overriding fields (e.g. password), leaving the original credential untouched.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        key: {
          type: "string",
        },
        keyPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/detect-key-type",
    method: "POST",
    path: "/credentials/detect-key-type",
    tag: "Credentials",
    summary: "Detect SSH key type",
    description: "Detects the type of an SSH private key.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        privateKey: {
          type: "string",
        },
        keyPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/detect-public-key-type",
    method: "POST",
    path: "/credentials/detect-public-key-type",
    tag: "Credentials",
    summary: "Detect SSH public key type",
    description: "Detects the type of an SSH public key.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        publicKey: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/generate-key-pair",
    method: "POST",
    path: "/credentials/generate-key-pair",
    tag: "Credentials",
    summary: "Generate new SSH key pair",
    description: "Generates a new SSH key pair.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        keyType: {
          type: "string",
        },
        keySize: {
          type: "integer",
        },
        passphrase: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/generate-public-key",
    method: "POST",
    path: "/credentials/generate-public-key",
    tag: "Credentials",
    summary: "Generate public key from private key",
    description: "Generates a public key from a given private key.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        privateKey: {
          type: "string",
        },
        keyPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /credentials/validate-key-pair",
    method: "POST",
    path: "/credentials/validate-key-pair",
    tag: "Credentials",
    summary: "Validate SSH key pair",
    description: "Validates if a given SSH private key and public key match.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        privateKey: {
          type: "string",
        },
        publicKey: {
          type: "string",
        },
        keyPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /docker/containers/{sessionId}/{containerId}/pause",
    method: "POST",
    path: "/docker/containers/{sessionId}/{containerId}/pause",
    tag: "Docker",
    summary: "Pause container",
    description: "Pauses a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /docker/containers/{sessionId}/{containerId}/restart",
    method: "POST",
    path: "/docker/containers/{sessionId}/{containerId}/restart",
    tag: "Docker",
    summary: "Restart container",
    description: "Restarts a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /docker/containers/{sessionId}/{containerId}/start",
    method: "POST",
    path: "/docker/containers/{sessionId}/{containerId}/start",
    tag: "Docker",
    summary: "Start container",
    description: "Starts a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /docker/containers/{sessionId}/{containerId}/stop",
    method: "POST",
    path: "/docker/containers/{sessionId}/{containerId}/stop",
    tag: "Docker",
    summary: "Stop container",
    description: "Stops a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /docker/containers/{sessionId}/{containerId}/unpause",
    method: "POST",
    path: "/docker/containers/{sessionId}/{containerId}/unpause",
    tag: "Docker",
    summary: "Unpause container",
    description: "Unpauses a specific container.",
    parameters: [
      {
        name: "sessionId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "containerId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /docker/ssh/connect",
    method: "POST",
    path: "/docker/ssh/connect",
    tag: "Docker",
    summary: "Establish SSH session for Docker",
    description: "Establishes an SSH session to a host for Docker operations.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "POST /docker/ssh/connect-totp",
    method: "POST",
    path: "/docker/ssh/connect-totp",
    tag: "Docker",
    summary: "Verify TOTP and complete connection",
    description: "Verifies the TOTP code and completes the SSH connection.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        totpCode: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /docker/ssh/connect-warpgate",
    method: "POST",
    path: "/docker/ssh/connect-warpgate",
    tag: "Docker",
    summary: "Complete Warpgate authentication",
    description:
      "Submits empty response to complete Warpgate authentication after user completes browser auth.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Session ID from initial connection attempt",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    operationKey: "POST /docker/ssh/disconnect",
    method: "POST",
    path: "/docker/ssh/disconnect",
    tag: "Docker",
    summary: "Disconnect SSH session",
    description: "Closes an active SSH session for Docker operations.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /docker/ssh/keepalive",
    method: "POST",
    path: "/docker/ssh/keepalive",
    tag: "Docker",
    summary: "Keep SSH session alive",
    description: "Keeps an active SSH session alive.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets",
    method: "POST",
    path: "/fleets",
    tag: "Fleets",
    summary: "Create a fleet",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        color: {
          type: "string",
        },
        icon: {
          type: "string",
        },
        tagRules: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/execute",
    method: "POST",
    path: "/fleets/{id}/execute",
    tag: "Fleets",
    summary: "Run a command across every host in a fleet",
    description:
      "Fans out concurrently to every effective member host the caller has edit-level access to. $HOST/$USER/$PORT/$NAME/$INPUT_n substitution is applied per host, same grammar as snippet execution. One host failing does not stop the others.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        command: {
          type: "string",
        },
        inputValues: {
          type: "object",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/inventory",
    method: "POST",
    path: "/fleets/{id}/inventory",
    tag: "Fleets",
    summary: "Refresh the inventory snapshot for every host in a fleet",
    description:
      "Connects to every effective member host the caller has view-level access to, collects OS/kernel/arch/hostname/uptime, and overwrites the stored latest-only snapshot per host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /fleets/{id}/members",
    method: "POST",
    path: "/fleets/{id}/members",
    tag: "Fleets",
    summary: "Add a host to a fleet's static membership",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "number",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/packages",
    method: "POST",
    path: "/fleets/{id}/packages",
    tag: "Fleets",
    summary: "Run a package action across every host in a fleet",
    description:
      "Auto-detects each host's package manager (apt/dnf/yum/pacman) and runs install/remove/upgrade-all, elevating with the host's stored sudo password. Requires manage-level access per host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["install", "remove", "upgrade-all"],
        },
        package: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/share",
    method: "POST",
    path: "/fleets/{id}/share",
    tag: "Fleets",
    summary: "Share a fleet's current member hosts with users or roles",
    description:
      "Snapshot at share time - grants hostAccess for every current member host to each target. Hosts added to the fleet later are not automatically shared; re-run this route to extend sharing to new members.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        targets: {
          type: "array",
          items: {
            type: "object",
          },
        },
        permissionLevel: {
          type: "string",
        },
        durationHours: {
          type: "number",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/transfer/pull",
    method: "POST",
    path: "/fleets/{id}/transfer/pull",
    tag: "Fleets",
    summary: "Pull the same remote path from every host in a fleet",
    description:
      "Fans out concurrently to every effective member host the caller has edit-level access to, reads remotePath via SFTP from each, and returns a single zip archive with one entry per successful host (<hostName>/<filename>). Single file only (v1).",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        remotePath: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /fleets/{id}/transfer/push",
    method: "POST",
    path: "/fleets/{id}/transfer/push",
    tag: "Fleets",
    summary: "Push an uploaded file to the same remote path on every host in a fleet",
    description:
      "Fans out concurrently to every effective member host the caller has edit-level access to. Single file only (v1) - the file is buffered once server-side and written to each host via SFTP.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /global-settings",
    method: "POST",
    path: "/global-settings",
    tag: "Host Metrics",
    summary: "Update global monitoring defaults",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        statusCheckInterval: {
          type: "integer",
        },
        metricsInterval: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /global-settings/history",
    method: "POST",
    path: "/global-settings/history",
    tag: "Host Metrics",
    summary: "Update metrics history retention setting",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        metricsHistoryRetentionDays: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /guacamole/connect-host/{hostId}",
    method: "POST",
    path: "/guacamole/connect-host/{hostId}",
    tag: "Guacamole",
    summary: "Generate Guacamole connection token from host configuration",
    description:
      "Fetches host configuration from database and generates a connection token for RDP/VNC/Telnet",
    parameters: [
      {
        name: "hostId",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
        description: "Host ID to connect to",
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        protocol: {
          type: "string",
          enum: ["rdp", "vnc", "telnet"],
          description: "Override the host's default connection type",
        },
        promptedUsername: {
          type: "string",
          description:
            'Username for this connection only, used when the host\'s RDP auth type is "none". Not persisted.',
        },
        promptedPassword: {
          type: "string",
          description:
            'Password for this connection only, used when the host\'s RDP auth type is "none". Not persisted.',
        },
      },
    },
  },
  {
    operationKey: "POST /guacamole/token",
    method: "POST",
    path: "/guacamole/token",
    tag: "Guacamole",
    summary: "Generate an encrypted Guacamole connection token",
    description:
      "Creates an AES-256-CBC encrypted token for guacamole-lite with the given connection parameters",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["rdp", "vnc", "telnet"],
        },
        hostname: {
          type: "string",
        },
        port: {
          type: "integer",
        },
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        domain: {
          type: "string",
        },
      },
      required: ["type", "hostname"],
    },
  },
  {
    operationKey: "POST /homepage/items",
    method: "POST",
    path: "/homepage/items",
    tag: "Homepage",
    summary: "Create homepage item",
    description: "Creates a new homepage widget item for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        typeId: {
          type: "string",
        },
        title: {
          type: "string",
        },
        config: {
          type: "object",
        },
      },
      required: ["typeId"],
    },
  },
  {
    operationKey: "POST /host-deleted",
    method: "POST",
    path: "/host-deleted",
    tag: "Host Metrics",
    summary: "Stop polling for deleted host",
    description: "Stops polling for a specific host after it has been deleted.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/managers/processes/{id}/signal",
    method: "POST",
    path: "/host-metrics/managers/processes/{id}/signal",
    tag: "Host Metrics",
    summary: "Send a signal to a process (TERM/KILL/HUP/INT)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        pid: {
          type: "integer",
        },
        signal: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/managers/services/{id}/action",
    method: "POST",
    path: "/host-metrics/managers/services/{id}/action",
    tag: "Host Metrics",
    summary: "Start/stop/restart/enable/disable a systemd service",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        unit: {
          type: "string",
        },
        action: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/managers/ssl/{id}/revoke",
    method: "POST",
    path: "/host-metrics/managers/ssl/{id}/revoke",
    tag: "Host Metrics",
    summary: "Revoke and remove an issued certificate (certbot or acme.sh)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        client: {
          type: "string",
          enum: ["certbot", "acme.sh"],
        },
        name: {
          type: "string",
          description: "certbot cert name or acme.sh domain",
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/managers/tailscale/{id}/action",
    method: "POST",
    path: "/host-metrics/managers/tailscale/{id}/action",
    tag: "Host Metrics",
    summary: "Connect or disconnect Tailscale",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["up", "down"],
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/managers/wireguard/{id}/action",
    method: "POST",
    path: "/host-metrics/managers/wireguard/{id}/action",
    tag: "Host Metrics",
    summary: "Bring a WireGuard interface up or down",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        interface: {
          type: "string",
        },
        action: {
          type: "string",
          enum: ["up", "down"],
        },
      },
    },
  },
  {
    operationKey: "POST /host-metrics/preferences/{id}",
    method: "POST",
    path: "/host-metrics/preferences/{id}",
    tag: "Host Metrics",
    summary: "Save the Host Metrics layout for a host",
    description:
      "Persists the current user's card layout for the host and keeps statsConfig.enabledWidgets in sync (for hosts the user owns) so the mobile app keeps working.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        slots: {
          type: "array",
        },
        columns: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /host-updated",
    method: "POST",
    path: "/host-updated",
    tag: "Host Metrics",
    summary: "Start polling for updated host",
    description: "Starts polling for a specific host after it has been updated.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /host/autostart/enable",
    method: "POST",
    path: "/host/autostart/enable",
    tag: "SSH",
    summary: "Enable autostart for SSH configuration",
    description: "Enables autostart for a specific SSH configuration.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sshConfigId: {
          type: "number",
        },
      },
    },
  },
  {
    operationKey: "POST /host/bulk-import",
    method: "POST",
    path: "/host/bulk-import",
    tag: "SSH",
    summary: "Bulk import SSH hosts",
    description: "Bulk imports multiple SSH hosts.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hosts: {
          type: "array",
          items: {
            type: "object",
          },
        },
      },
    },
  },
  {
    operationKey: "POST /host/db/host",
    method: "POST",
    path: "/host/db/host",
    tag: "SSH",
    summary: "Create SSH host",
    description: "Creates a new SSH host configuration.",
    parameters: [],
  },
  {
    operationKey: "POST /host/db/proxy/test",
    method: "POST",
    path: "/host/db/proxy/test",
    tag: "SSH",
    summary: "Test proxy connectivity",
    description: "Tests connectivity through a proxy configuration to a target host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        singleProxy: {
          type: "object",
          properties: {
            host: {
              type: "string",
            },
            port: {
              type: "number",
            },
            type: {
              type: "string",
            },
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
        proxyChain: {
          type: "array",
          items: {
            type: "object",
          },
        },
        testTarget: {
          type: "object",
          properties: {
            host: {
              type: "string",
            },
            port: {
              type: "number",
            },
          },
        },
      },
    },
  },
  {
    operationKey: "POST /host/enroll",
    method: "POST",
    path: "/host/enroll",
    tag: "Host Enrollment",
    summary: "Enroll a host with an API key",
    description:
      "Creates a host owned by the user assigned to the API key. The user's encrypted data must be unlocked by an active sign-in.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        ip: {
          type: "string",
        },
        port: {
          type: "integer",
          default: 22,
        },
        username: {
          type: "string",
        },
        authType: {
          type: "string",
          enum: ["none", "password", "key", "credential", "agent"],
          default: "none",
        },
        password: {
          type: "string",
        },
        folder: {
          type: "string",
        },
        tags: {},
        enableTerminal: {
          type: "boolean",
        },
        enableFileManager: {
          type: "boolean",
        },
        enableTunnel: {
          type: "boolean",
        },
      },
      required: ["ip"],
    },
  },
  {
    operationKey: "POST /host/file_manager/pinned",
    method: "POST",
    path: "/host/file_manager/pinned",
    tag: "SSH",
    summary: "Add pinned file",
    description: "Adds a file to the list of pinned files for a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /host/file_manager/recent",
    method: "POST",
    path: "/host/file_manager/recent",
    tag: "SSH",
    summary: "Add recent file",
    description: "Adds a file to the list of recent files for a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /host/file_manager/shortcuts",
    method: "POST",
    path: "/host/file_manager/shortcuts",
    tag: "SSH",
    summary: "Add shortcut",
    description: "Adds a shortcut for a specific host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        path: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /host/quick-connect",
    method: "POST",
    path: "/host/quick-connect",
    tag: "SSH",
    summary: "Create a temporary SSH connection without saving to database",
    description: "Returns a temporary host configuration for immediate use",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        ip: {
          type: "string",
          description: "SSH server IP or hostname",
        },
        port: {
          type: "number",
          description: "SSH server port",
        },
        username: {
          type: "string",
          description: "SSH username",
        },
        authType: {
          type: "string",
          enum: ["password", "key", "credential"],
          description: "Authentication method",
        },
        password: {
          type: "string",
          description: "Password (required if authType is password)",
        },
        key: {
          type: "string",
          description: "SSH private key (required if authType is key)",
        },
        keyPassword: {
          type: "string",
          description: "SSH key password (optional)",
        },
        keyType: {
          type: "string",
          description: "SSH key type",
        },
        credentialId: {
          type: "number",
          description: "Credential ID (required if authType is credential)",
        },
        overrideCredentialUsername: {
          type: "boolean",
          description: "Use provided username instead of credential username",
        },
      },
      required: ["ip", "port", "username", "authType"],
    },
  },
  {
    operationKey: "POST /host/ssh-config-import",
    method: "POST",
    path: "/host/ssh-config-import",
    tag: "SSH",
    summary: "Import hosts from an OpenSSH config file",
    description: "Parses an OpenSSH ~/.ssh/config file and imports the defined hosts.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Raw text content of the SSH config file.",
        },
        overwrite: {
          type: "boolean",
        },
      },
      required: ["content"],
    },
  },
  {
    operationKey: "POST /metrics/connect-totp",
    method: "POST",
    path: "/metrics/connect-totp",
    tag: "Host Metrics",
    summary: "Complete TOTP verification for metrics",
    description: "Verifies the TOTP code and completes the metrics SSH connection.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        totpCode: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /metrics/heartbeat",
    method: "POST",
    path: "/metrics/heartbeat",
    tag: "Host Metrics",
    summary: "Update viewer heartbeat",
    description: "Updates the heartbeat timestamp for a metrics viewer session to keep it alive.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        viewerSessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /metrics/register-viewer",
    method: "POST",
    path: "/metrics/register-viewer",
    tag: "Host Metrics",
    summary: "Register metrics viewer",
    description: "Registers a new viewer session for a host to track who is viewing metrics.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /metrics/start/{id}",
    method: "POST",
    path: "/metrics/start/{id}",
    tag: "Host Metrics",
    summary: "Start metrics collection",
    description: "Establishes an SSH connection and starts collecting metrics for a specific host.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /metrics/stop/{id}",
    method: "POST",
    path: "/metrics/stop/{id}",
    tag: "Host Metrics",
    summary: "Stop metrics collection",
    description: "Stops metrics collection for a specific host and cleans up the SSH session.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        viewerSessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /metrics/unregister-viewer",
    method: "POST",
    path: "/metrics/unregister-viewer",
    tag: "Host Metrics",
    summary: "Unregister metrics viewer",
    description: "Unregisters a viewer session when they stop viewing metrics for a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        viewerSessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /network-topology",
    method: "POST",
    path: "/network-topology",
    tag: "Network Topology",
    summary: "Save network topology for authenticated user",
    description:
      "Saves or updates the network topology graph. Uses upsert logic - creates new record if none exists, updates existing record otherwise.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        topology: {
          type: "object",
          description: "Network topology data containing nodes and edges",
          properties: {
            nodes: {
              type: "array",
              description: "Array of graph nodes (hosts and groups)",
            },
            edges: {
              type: "array",
              description: "Array of graph edges (connections)",
            },
          },
        },
      },
      required: ["topology"],
    },
  },
  {
    operationKey: "POST /notification-channels",
    method: "POST",
    path: "/notification-channels",
    tag: "Alerts",
    summary: "Create a notification channel",
    parameters: [],
  },
  {
    operationKey: "POST /notification-channels/{id}/test",
    method: "POST",
    path: "/notification-channels/{id}/test",
    tag: "Alerts",
    summary: "Send a test notification",
    parameters: [],
  },
  {
    operationKey: "POST /open-tabs",
    method: "POST",
    path: "/open-tabs",
    tag: "Open Tabs",
    summary: "Upsert a single open tab for the current user",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        tabType: {
          type: "string",
        },
        hostId: {
          type: "integer",
          nullable: true,
        },
        label: {
          type: "string",
        },
        tabOrder: {
          type: "integer",
        },
        backendSessionId: {
          type: "string",
          nullable: true,
        },
      },
      required: ["id", "tabType", "label", "tabOrder"],
    },
  },
  {
    operationKey: "POST /proxmox-stats/start/{id}",
    method: "POST",
    path: "/proxmox-stats/start/{id}",
    tag: "Proxmox Stats",
    summary: "Start Proxmox stats collection",
    description:
      "Registers a viewer and starts (or reuses) polling for a host's Proxmox node stats.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /proxmox-stats/stop/{id}",
    method: "POST",
    path: "/proxmox-stats/stop/{id}",
    tag: "Proxmox Stats",
    summary: "Stop Proxmox stats collection",
    description: "Unregisters a viewer session for a host's Proxmox node stats polling.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        viewerSessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /proxmox/discover",
    method: "POST",
    path: "/proxmox/discover",
    tag: "Proxmox",
    summary: "Discover Proxmox guests on a node",
    description:
      "Connects to an existing SSH host (a Proxmox node) using its stored credentials, runs pvesh to enumerate all guests (VMs and LXC containers) in the cluster, and returns them ready to be imported as Termix hosts. No separate Proxmox API token is required.\n",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "number",
          description: "ID of the SSH host that is a Proxmox node.",
        },
      },
      required: ["hostId"],
    },
  },
  {
    operationKey: "POST /rbac/folder/share",
    method: "POST",
    path: "/rbac/folder/share",
    tag: "RBAC",
    summary: "Share all hosts in a folder",
    description:
      "Shares every host within a folder (and its subfolders) with one or more users and/or roles at a permission level. Only hosts owned by the caller are shared; skips hosts the caller may not share.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        folder: {
          type: "string",
        },
        targets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["user", "role"],
              },
              id: {},
            },
          },
        },
        permissionLevel: {
          type: "string",
          enum: ["connect", "view", "edit", "manage"],
        },
        durationHours: {
          type: "number",
        },
      },
      required: ["folder", "targets"],
    },
  },
  {
    operationKey: "POST /rbac/host/{id}/share",
    method: "POST",
    path: "/rbac/host/{id}/share",
    tag: "RBAC",
    summary: "Share a host",
    description:
      "Shares a host with one or more users and/or roles at a permission level (connect, view, edit, manage). SSH authentication remains private to the owner; recipients may select one of their own saved SSH credentials.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        targets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["user", "role"],
              },
              id: {},
            },
          },
        },
        permissionLevel: {
          type: "string",
          enum: ["connect", "view", "edit", "manage"],
        },
        durationHours: {
          type: "number",
        },
      },
      required: ["targets"],
    },
  },
  {
    operationKey: "POST /rbac/roles",
    method: "POST",
    path: "/rbac/roles",
    tag: "RBAC",
    summary: "Create a new role",
    description: "Creates a new role.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        displayName: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /rbac/snippet/{id}/share",
    method: "POST",
    path: "/rbac/snippet/{id}/share",
    tag: "RBAC",
    summary: "Share a snippet",
    description: "Shares a snippet with a user or role.",
    parameters: [],
  },
  {
    operationKey: "POST /rbac/users/{userId}/roles",
    method: "POST",
    path: "/rbac/users/{userId}/roles",
    tag: "RBAC",
    summary: "Assign a role to a user",
    description: "Assigns a role to a user.",
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        roleId: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /refresh",
    method: "POST",
    path: "/refresh",
    tag: "Host Metrics",
    summary: "Refresh polling",
    description: "Refreshes host polling for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "POST /service-links",
    method: "POST",
    path: "/service-links",
    tag: "Dashboard",
    summary: "Create service link",
    description: "Creates a new dashboard service link for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        label: {
          type: "string",
        },
        url: {
          type: "string",
        },
      },
      required: ["label", "url"],
    },
  },
  {
    operationKey: "POST /session-sharing/{shareId}/end",
    method: "POST",
    path: "/session-sharing/{shareId}/end",
    tag: "Session Sharing",
    summary: "End a shared session for all participants",
    description:
      "Owner-only. Terminates the underlying session and notifies joined participants. Guac protocol kick is best-effort in v1.",
    parameters: [
      {
        name: "shareId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /session-sharing/create",
    method: "POST",
    path: "/session-sharing/create",
    tag: "Session Sharing",
    summary: "Create a session share (link or targeted user)",
    description:
      "Mints a share grant for a live terminal/RDP/VNC/Telnet session. Caller must own the live session.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        sessionId: {
          type: "string",
        },
        tabInstanceId: {
          type: "string",
        },
        protocol: {
          type: "string",
          enum: ["ssh", "rdp", "vnc", "telnet"],
        },
        shareType: {
          type: "string",
          enum: ["link", "user"],
        },
        targetUserId: {
          type: "string",
        },
        permissionLevel: {
          type: "string",
          enum: ["read-only", "read-write"],
        },
        expiryHours: {
          type: "number",
        },
      },
      required: ["hostId", "sessionId", "protocol", "shareType", "permissionLevel"],
    },
  },
  {
    operationKey: "POST /snippets",
    method: "POST",
    path: "/snippets",
    tag: "Snippets",
    summary: "Create a new snippet",
    description: "Creates a new snippet for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        content: {
          type: "string",
        },
        description: {
          type: "string",
        },
        folder: {
          type: "string",
        },
        order: {
          type: "integer",
        },
        isNote: {
          type: "boolean",
          description:
            "When true, the snippet is a note (copy/paste only, not directly executable on a host).",
        },
      },
    },
  },
  {
    operationKey: "POST /snippets/bulk-import",
    method: "POST",
    path: "/snippets/bulk-import",
    tag: "Snippets",
    summary: "Bulk import snippets and folders from JSON",
    description:
      "Imports snippets and folders. Existing folders are skipped; existing snippets (matched by name+folder) can be skipped or overwritten.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        snippets: {
          type: "array",
        },
        folders: {
          type: "array",
        },
        overwrite: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "POST /snippets/execute",
    method: "POST",
    path: "/snippets/execute",
    tag: "Snippets",
    summary: "Execute a snippet on a host",
    description: "Executes a snippet on a specified host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        snippetId: {
          type: "integer",
        },
        hostId: {
          type: "integer",
        },
        inputValues: {
          type: "object",
          description:
            'Optional resolved values for $INPUT_n placeholders in the snippet content, keyed by "INPUT_n". Host variables ($HOST, $USER, $PORT, $NAME) are resolved server-side per target host and do not need to be passed here.\n',
          additionalProperties: {
            type: "string",
          },
        },
      },
    },
  },
  {
    operationKey: "POST /snippets/folders",
    method: "POST",
    path: "/snippets/folders",
    tag: "Snippets",
    summary: "Create a new snippet folder",
    description: "Creates a new snippet folder for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        color: {
          type: "string",
        },
        icon: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/changePermissions",
    method: "POST",
    path: "/ssh/file_manager/ssh/changePermissions",
    tag: "File Manager",
    summary: "Change file permissions",
    description: "Changes the permissions of a file on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        permissions: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/compressFiles",
    method: "POST",
    path: "/ssh/file_manager/ssh/compressFiles",
    tag: "File Manager",
    summary: "Compress files",
    description: "Compresses files and/or directories on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        paths: {
          type: "array",
          items: {
            type: "string",
          },
        },
        archiveName: {
          type: "string",
        },
        format: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/connect",
    method: "POST",
    path: "/ssh/file_manager/ssh/connect",
    tag: "File Manager",
    summary: "Connect to SSH for file management",
    description:
      "Establishes an SSH/SFTP connection for file manager operations. Supports password, key-based, and keyboard-interactive authentication, as well as jump hosts and SOCKS5 proxies.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Unique session identifier",
        },
        hostId: {
          type: "number",
          description: "Host ID from database",
        },
        ip: {
          type: "string",
          description: "SSH server IP address",
        },
        port: {
          type: "number",
          description: "SSH server port",
        },
        username: {
          type: "string",
          description: "SSH username",
        },
        password: {
          type: "string",
          description: "SSH password (for password auth)",
        },
        sshKey: {
          type: "string",
          description: "SSH private key (for key-based auth)",
        },
        keyPassword: {
          type: "string",
          description: "Private key passphrase",
        },
        authType: {
          type: "string",
          enum: ["password", "key", "none"],
          description: "Authentication method",
        },
        credentialId: {
          type: "number",
          description: "Credential ID to use from database",
        },
        userProvidedPassword: {
          type: "string",
          description: "User-provided password for keyboard-interactive auth",
        },
        forceKeyboardInteractive: {
          type: "boolean",
          description: "Force keyboard-interactive authentication",
        },
        jumpHosts: {
          type: "array",
          description: "Jump host configuration",
          items: {
            type: "object",
            properties: {
              hostId: {
                type: "number",
              },
            },
          },
        },
        useSocks5: {
          type: "boolean",
          description: "Use SOCKS5 proxy",
        },
        socks5Host: {
          type: "string",
          description: "SOCKS5 proxy host",
        },
        socks5Port: {
          type: "number",
          description: "SOCKS5 proxy port",
        },
        socks5Username: {
          type: "string",
          description: "SOCKS5 proxy username",
        },
        socks5Password: {
          type: "string",
          description: "SOCKS5 proxy password",
        },
        socks5ProxyChain: {
          type: "array",
          description: "Chain of SOCKS5 proxies",
        },
      },
      required: ["sessionId", "ip", "port", "username"],
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/connect-totp",
    method: "POST",
    path: "/ssh/file_manager/ssh/connect-totp",
    tag: "File Manager",
    summary: "Verify TOTP and complete connection",
    description: "Verifies the TOTP code and completes the SSH connection for file manager.",
    parameters: [],
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/connect-warpgate",
    method: "POST",
    path: "/ssh/file_manager/ssh/connect-warpgate",
    tag: "File Manager",
    summary: "Complete Warpgate authentication",
    description:
      "Submits empty response to complete Warpgate authentication after user completes browser auth.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Session ID from initial connection attempt",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/copyItem",
    method: "POST",
    path: "/ssh/file_manager/ssh/copyItem",
    tag: "File Manager",
    summary: "Copy a file or directory",
    description: "Copies a file or directory on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        sourcePath: {
          type: "string",
        },
        targetDir: {
          type: "string",
        },
        hostId: {
          type: "integer",
        },
        userId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/createFile",
    method: "POST",
    path: "/ssh/file_manager/ssh/createFile",
    tag: "File Manager",
    summary: "Create a file",
    description: "Creates an empty file on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        fileName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/createFolder",
    method: "POST",
    path: "/ssh/file_manager/ssh/createFolder",
    tag: "File Manager",
    summary: "Create a folder",
    description: "Creates a new folder on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        folderName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/disconnect",
    method: "POST",
    path: "/ssh/file_manager/ssh/disconnect",
    tag: "File Manager",
    summary: "Disconnect from SSH",
    description: "Closes an active SSH connection for file manager.",
    parameters: [],
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/downloadFile",
    method: "POST",
    path: "/ssh/file_manager/ssh/downloadFile",
    tag: "File Manager",
    summary: "Download a file",
    description:
      "Downloads a file from the remote host. Uses SCP legacy mode (cat over exec) when the host has scpLegacy enabled, otherwise uses SFTP.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        hostId: {
          type: "integer",
        },
        userId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/downloadFileStream",
    method: "POST",
    path: "/ssh/file_manager/ssh/downloadFileStream",
    tag: "File Manager",
    summary: "Stream-download a file",
    description:
      "Downloads a file as a binary stream. Uses SCP legacy mode (cat over exec) when the host has scpLegacy enabled, otherwise uses SFTP.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/executeFile",
    method: "POST",
    path: "/ssh/file_manager/ssh/executeFile",
    tag: "File Manager",
    summary: "Execute a file",
    description: "Executes a file on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        filePath: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/extractArchive",
    method: "POST",
    path: "/ssh/file_manager/ssh/extractArchive",
    tag: "File Manager",
    summary: "Extract archive file",
    description:
      "Extracts an archive file (.tar, .tar.gz, .tgz, .zip, .tar.bz2, .tbz2, .tar.xz, .txz) to a specified or default location on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "SSH session ID",
        },
        archivePath: {
          type: "string",
          description: "Path to the archive file on remote host",
        },
        extractPath: {
          type: "string",
          description: "Optional custom extraction path (defaults to same directory as archive)",
        },
      },
      required: ["sessionId", "archivePath"],
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/keepalive",
    method: "POST",
    path: "/ssh/file_manager/ssh/keepalive",
    tag: "File Manager",
    summary: "Keep SSH session alive",
    description: "Keeps an active SSH session for file manager alive.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/uploadFile",
    method: "POST",
    path: "/ssh/file_manager/ssh/uploadFile",
    tag: "File Manager",
    summary: "Upload a file",
    description: "Uploads a file to the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        content: {
          type: "string",
        },
        fileName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/uploadFileChunk",
    method: "POST",
    path: "/ssh/file_manager/ssh/uploadFileChunk",
    tag: "File Manager",
    summary: "Upload one raw file chunk",
    description:
      "Writes a raw request body to the remote file at the supplied byte offset, allowing browser clients to avoid multipart/FormData 2GB limits.",
    parameters: [],
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/uploadFileStream",
    method: "POST",
    path: "/ssh/file_manager/ssh/uploadFileStream",
    tag: "File Manager",
    summary: "Stream-upload a file via multipart form",
    description:
      "Uploads a file to the remote host by streaming multipart form data directly into an SFTP write stream, avoiding full in-memory buffering.",
    parameters: [],
  },
  {
    operationKey: "POST /ssh/file_manager/ssh/writeFile",
    method: "POST",
    path: "/ssh/file_manager/ssh/writeFile",
    tag: "File Manager",
    summary: "Write to a file",
    description:
      "Writes content to a file on the remote host and preserves the existing permissions when the file already exists.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        path: {
          type: "string",
        },
        content: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/file_manager/sudo-password",
    method: "POST",
    path: "/ssh/file_manager/sudo-password",
    tag: "File Manager",
    summary: "Set sudo password for session",
    description: "Stores sudo password temporarily in session for elevated operations.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/tunnel/cancel",
    method: "POST",
    path: "/ssh/tunnel/cancel",
    tag: "SSH Tunnels",
    summary: "Cancel tunnel retry",
    description: "Cancels the retry mechanism for a failed SSH tunnel connection.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        tunnelName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/tunnel/connect",
    method: "POST",
    path: "/ssh/tunnel/connect",
    tag: "SSH Tunnels",
    summary: "Connect SSH tunnel",
    description: "Establishes an SSH tunnel connection with the specified configuration.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        sourceHostId: {
          type: "integer",
        },
        tunnelIndex: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /ssh/tunnel/disconnect",
    method: "POST",
    path: "/ssh/tunnel/disconnect",
    tag: "SSH Tunnels",
    summary: "Disconnect SSH tunnel",
    description: "Disconnects an active SSH tunnel.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        tunnelName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /sync/{entityType}",
    method: "POST",
    path: "/sync/{entityType}",
    tag: "Sync",
    summary: "Upsert a synced row by syncId",
    description:
      "Creates or updates a row by its syncId. Used by the desktop app's remote sync engine to push local-only or newer rows to the other side of a sync pair.",
    parameters: [
      {
        name: "entityType",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
  {
    operationKey: "POST /sync/tombstones",
    method: "POST",
    path: "/sync/tombstones",
    tag: "Sync",
    summary: "Report a deletion from the other side of a sync pair",
    description:
      "Applies a remote deletion locally (if the row still exists) and records the tombstone so future pulls stay consistent.",
    parameters: [],
  },
  {
    operationKey: "POST /terminal/command_history",
    method: "POST",
    path: "/terminal/command_history",
    tag: "Terminal",
    summary: "Save command to history",
    description: "Saves a command to the command history for a specific host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        command: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /terminal/command_history/delete",
    method: "POST",
    path: "/terminal/command_history/delete",
    tag: "Terminal",
    summary: "Delete a specific command from history",
    description: "Deletes a specific command from the history of a host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        hostId: {
          type: "integer",
        },
        command: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /terminal/session_settings",
    method: "POST",
    path: "/terminal/session_settings",
    tag: "Terminal",
    summary: "Update session persistence settings",
    description: "Saves session timeout and persistence enabled flag.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        timeoutMinutes: {
          type: "integer",
        },
        enabled: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "POST /termix-id",
    method: "POST",
    path: "/termix-id",
    tag: "Termix ID",
    summary: "Create a Termix ID",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        handle: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
      required: ["handle"],
    },
  },
  {
    operationKey: "POST /termix-id/ca",
    method: "POST",
    path: "/termix-id/ca",
    tag: "Termix ID",
    summary: "Create a certificate authority",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        validityDays: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /termix-id/ca/rotate",
    method: "POST",
    path: "/termix-id/ca/rotate",
    tag: "Termix ID",
    summary: "Rotate the certificate authority (revokes all issued certificates)",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        validityDays: {
          type: "integer",
        },
      },
    },
  },
  {
    operationKey: "POST /termix-id/keys",
    method: "POST",
    path: "/termix-id/keys",
    tag: "Termix ID",
    summary: "Publish a public key",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        publicKey: {
          type: "string",
        },
        credentialId: {
          type: "integer",
        },
        label: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /termix-id/keys/{id}/certificate",
    method: "POST",
    path: "/termix-id/keys/{id}/certificate",
    tag: "Termix ID",
    summary: "Issue an SSH certificate for a key (ed25519 only)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        validityDays: {
          type: "integer",
        },
        principals: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  },
  {
    operationKey: "POST /termix-id/keys/generate",
    method: "POST",
    path: "/termix-id/keys/generate",
    tag: "Termix ID",
    summary: "Generate a new key pair and publish the public key",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["ed25519", "rsa"],
        },
        label: {
          type: "string",
        },
        saveCredential: {
          type: "boolean",
        },
        username: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/acme-ssl-request",
    method: "POST",
    path: "/users/acme-ssl-request",
    tag: "Users",
    summary: "Request or renew Let's Encrypt certificate (admin only)",
    description:
      "Triggers certbot to issue or renew a certificate using the configured challenge method.",
    parameters: [],
  },
  {
    operationKey: "POST /users/admin-create",
    method: "POST",
    path: "/users/admin-create",
    tag: "Users",
    summary: "Admin create user",
    description:
      "Allows an admin to create a new user regardless of whether public registration is enabled.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/admin/reset-password",
    method: "POST",
    path: "/users/admin/reset-password",
    tag: "Users",
    summary: "Reset a user's password (admin only)",
    description:
      "Resets another user's password. Data is preserved for users whose encryption key has been migrated to the system wrap. Users who never logged in since the encryption upgrade require confirmDataWipe, which deletes their encrypted data.\n",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
        username: {
          type: "string",
        },
        newPassword: {
          type: "string",
        },
        confirmDataWipe: {
          type: "boolean",
        },
      },
      required: ["newPassword"],
    },
  },
  {
    operationKey: "POST /users/admin/totp/disable",
    method: "POST",
    path: "/users/admin/totp/disable",
    tag: "Users",
    summary: "Disable a user's TOTP (admin only)",
    description:
      "Clears another user's TOTP secret, enabled flag and backup codes so they can log in without 2FA.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/api-keys",
    method: "POST",
    path: "/users/api-keys",
    tag: "API Keys",
    summary: "Create an API key (admin only)",
    description:
      "Creates a new API key scoped to a specific user. The full token is returned only once.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Human-readable name for the key.",
        },
        userId: {
          type: "string",
          description: "ID of the user this key is scoped to.",
        },
        expiresAt: {
          type: "string",
          format: "date-time",
          description: "Optional expiration date. Null means the key never expires.",
        },
      },
      required: ["name", "userId"],
    },
  },
  {
    operationKey: "POST /users/change-password",
    method: "POST",
    path: "/users/change-password",
    tag: "Users",
    summary: "Change user password",
    description: "Changes the authenticated user's password.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        oldPassword: {
          type: "string",
        },
        newPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/complete-reset",
    method: "POST",
    path: "/users/complete-reset",
    tag: "Users",
    summary: "Complete password reset",
    description: "Completes the password reset process with a new password.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        tempToken: {
          type: "string",
        },
        newPassword: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/create",
    method: "POST",
    path: "/users/create",
    tag: "Users",
    summary: "Create a new user",
    description: "Creates a new user with a username and password.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/initiate-reset",
    method: "POST",
    path: "/users/initiate-reset",
    tag: "Users",
    summary: "Initiate password reset",
    description: "Initiates the password reset process for a user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/internal/auto-session",
    method: "POST",
    path: "/users/internal/auto-session",
    tag: "Users",
    summary: "Mint a session for the sole local desktop user",
    description:
      "Used by the Electron desktop app to skip the login form entirely when running standalone against the embedded local backend. Only available over loopback. Logs in as the sole local user regardless of its credentials; if the local database has more than one user (e.g. repeated manual registration), deterministically logs in as the admin account, or the earliest-registered account if none is admin -- a login form must never appear for the local backend under any circumstance. Only declines if zero local users exist at all, which normal desktop provisioning never produces. Provisions the resolved user's data-encryption key if missing before minting the session, matching every other login path -- self-heals an account that previously ended up with a valid session but no usable encryption key.",
    parameters: [],
  },
  {
    operationKey: "POST /users/ldap/login",
    method: "POST",
    path: "/users/ldap/login",
    tag: "SSO",
    summary: "LDAP login",
    description: "Authenticates a user against an LDAP server.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        providerId: {
          type: "integer",
        },
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        rememberMe: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "POST /users/link-oidc-to-password",
    method: "POST",
    path: "/users/link-oidc-to-password",
    tag: "Users",
    summary: "Link OIDC user to password account",
    description: "Merges an OIDC-only account into a password-based account (admin only).",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        oidcUserId: {
          type: "string",
        },
        targetUsername: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/login",
    method: "POST",
    path: "/users/login",
    tag: "Users",
    summary: "User login",
    description: "Authenticates a user and returns a JWT.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/logout",
    method: "POST",
    path: "/users/logout",
    tag: "Users",
    summary: "User logout",
    description: "Logs out the user and clears the JWT cookie.",
    parameters: [],
  },
  {
    operationKey: "POST /users/make-admin",
    method: "POST",
    path: "/users/make-admin",
    tag: "Users",
    summary: "Make user admin",
    description: "Grants admin privileges to a user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "Preferred unique user identifier.",
        },
        username: {
          type: "string",
          description: "Legacy fallback identifier.",
        },
      },
    },
  },
  {
    operationKey: "POST /users/manual-ssl-upload",
    method: "POST",
    path: "/users/manual-ssl-upload",
    tag: "Users",
    summary: "Upload a manual/custom SSL certificate and key (admin only)",
    description:
      "Validates and installs a user-supplied PEM certificate and private key as the active Termix SSL certificate.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        certificate: {
          type: "string",
        },
        privateKey: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/me/dismiss-donation-modal",
    method: "POST",
    path: "/users/me/dismiss-donation-modal",
    tag: "Users",
    summary: "Permanently dismiss the donation reminder modal",
    description:
      "Marks the donation reminder modal as dismissed for the currently authenticated user so it is never shown to them again.",
    parameters: [],
  },
  {
    operationKey: "POST /users/oidc-config",
    method: "POST",
    path: "/users/oidc-config",
    tag: "Users",
    summary: "Configure OIDC provider",
    description: "Creates or updates the OIDC provider configuration.",
    parameters: [],
  },
  {
    operationKey: "POST /users/remove-admin",
    method: "POST",
    path: "/users/remove-admin",
    tag: "Users",
    summary: "Remove admin status",
    description: "Revokes admin privileges from a user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "Preferred unique user identifier.",
        },
        username: {
          type: "string",
          description: "Legacy fallback identifier.",
        },
      },
    },
  },
  {
    operationKey: "POST /users/sessions/revoke-all",
    method: "POST",
    path: "/users/sessions/revoke-all",
    tag: "Users",
    summary: "Revoke all sessions for a user",
    description: "Revokes all sessions with option to exclude current session.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        targetUserId: {
          type: "string",
        },
        exceptCurrent: {
          type: "boolean",
        },
      },
    },
  },
  {
    operationKey: "POST /users/sso-providers",
    method: "POST",
    path: "/users/sso-providers",
    tag: "SSO",
    summary: "Create SSO provider",
    description: "Creates a new SSO provider configuration.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "POST /users/terminal-image-storage-settings/test",
    method: "POST",
    path: "/users/terminal-image-storage-settings/test",
    tag: "Users",
    summary: "Test image storage visibility (admin only)",
    description:
      "Reports which storage mode an upload would take for one of the caller's already-connected terminal sessions. Uses the bounded local-mapping probe only; it never opens new connections.",
    parameters: [],
  },
  {
    operationKey: "POST /users/totp/backup-codes",
    method: "POST",
    path: "/users/totp/backup-codes",
    tag: "Users",
    summary: "Generate new backup codes",
    description: "Generates new TOTP backup codes.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        password: {
          type: "string",
        },
        totp_code: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/totp/disable",
    method: "POST",
    path: "/users/totp/disable",
    tag: "Users",
    summary: "Disable TOTP",
    description: "Disables TOTP for a user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        password: {
          type: "string",
        },
        totp_code: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/totp/enable",
    method: "POST",
    path: "/users/totp/enable",
    tag: "Users",
    summary: "Enable TOTP",
    description: "Enables TOTP after verifying the initial code.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        totp_code: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/totp/setup",
    method: "POST",
    path: "/users/totp/setup",
    tag: "Users",
    summary: "Setup TOTP",
    description: "Initiates TOTP setup by generating a secret and QR code.",
    parameters: [],
  },
  {
    operationKey: "POST /users/totp/verify-login",
    method: "POST",
    path: "/users/totp/verify-login",
    tag: "Users",
    summary: "Verify TOTP during login",
    description: "Verifies the TOTP code during login.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        temp_token: {
          type: "string",
        },
        totp_code: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/unlink-oidc-from-password",
    method: "POST",
    path: "/users/unlink-oidc-from-password",
    tag: "Users",
    summary: "Unlink OIDC from password account",
    description: "Removes OIDC authentication from a dual-auth account (admin only).",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/unlock-data",
    method: "POST",
    path: "/users/unlock-data",
    tag: "Users",
    summary: "Unlock user data",
    description: "Re-authenticates user with password to unlock encrypted data.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        password: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/verify-reset-code",
    method: "POST",
    path: "/users/verify-reset-code",
    tag: "Users",
    summary: "Verify reset code",
    description: "Verifies the password reset code.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        resetCode: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /users/webauthn/authenticate/options",
    method: "POST",
    path: "/users/webauthn/authenticate/options",
    tag: "WebAuthn",
    summary: "Start passkey login",
    description: "Generates WebAuthn authentication options, optionally scoped to a username.",
    parameters: [],
  },
  {
    operationKey: "POST /users/webauthn/authenticate/verify",
    method: "POST",
    path: "/users/webauthn/authenticate/verify",
    tag: "WebAuthn",
    summary: "Finish passkey login",
    description:
      "Verifies the WebAuthn assertion and issues a session token (or a TOTP challenge).",
    parameters: [],
  },
  {
    operationKey: "POST /users/webauthn/register/options",
    method: "POST",
    path: "/users/webauthn/register/options",
    tag: "WebAuthn",
    summary: "Start passkey registration",
    description: "Generates WebAuthn registration options for the authenticated user.",
    parameters: [],
  },
  {
    operationKey: "POST /users/webauthn/register/verify",
    method: "POST",
    path: "/users/webauthn/register/verify",
    tag: "WebAuthn",
    summary: "Finish passkey registration",
    description: "Verifies the WebAuthn registration response and stores the passkey.",
    parameters: [],
  },
  {
    operationKey: "POST /vault/profiles",
    method: "POST",
    path: "/vault/profiles",
    tag: "Vault",
    summary: "Create a Vault profile",
    description:
      "Creates a new Vault signer profile owned by the authenticated user. The shared flag requires admin privileges.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        vaultAddr: {
          type: "string",
        },
        vaultNamespace: {
          type: "string",
        },
        oidcMount: {
          type: "string",
        },
        oidcRole: {
          type: "string",
        },
        sshMount: {
          type: "string",
        },
        sshRole: {
          type: "string",
        },
        validPrincipals: {
          type: "string",
        },
        keyType: {
          type: "string",
        },
        shared: {
          type: "boolean",
        },
      },
      required: ["name", "vaultAddr", "sshRole"],
    },
  },
  {
    operationKey: "POST /workspaces",
    method: "POST",
    path: "/workspaces",
    tag: "Workspaces",
    summary: "Save the current tab arrangement as a new named workspace",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        color: {
          type: "string",
        },
        icon: {
          type: "string",
        },
        payload: {
          type: "object",
        },
      },
    },
  },
  {
    operationKey: "POST /workspaces/{id}/apply",
    method: "POST",
    path: "/workspaces/{id}/apply",
    tag: "Workspaces",
    summary: "Fetch a workspace to apply and mark it as just used",
    description:
      "Returns the full workspace with its payload parsed, and touches lastUsedAt server-side so the caller does not need a second round trip.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /workspaces/{id}/duplicate",
    method: "POST",
    path: "/workspaces/{id}/duplicate",
    tag: "Workspaces",
    summary: "Duplicate a workspace's content and color/icon under a new name",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "POST /workspaces/{id}/set-default",
    method: "POST",
    path: "/workspaces/{id}/set-default",
    tag: "Workspaces",
    summary: "Mark a workspace as the restore-on-login default",
    description:
      "Clears isDefault on any other workspace for the caller. Idempotent if the target is already the default. Rejects the Last Session workspace.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "POST /workspaces/{id}/unset-default",
    method: "POST",
    path: "/workspaces/{id}/unset-default",
    tag: "Workspaces",
    summary: "Remove a workspace as the restore-on-login default",
    description:
      "Idempotent if the target is not currently the default. Rejects the Last Session workspace.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PUT /alert-rules/{id}",
    method: "PUT",
    path: "/alert-rules/{id}",
    tag: "Alerts",
    summary: "Update an alert rule",
    parameters: [],
  },
  {
    operationKey: "PUT /automations/{id}",
    method: "PUT",
    path: "/automations/{id}",
    tag: "Automations",
    summary: "Update an automation",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PUT /c2s-tunnel-presets/{id}",
    method: "PUT",
    path: "/c2s-tunnel-presets/{id}",
    tag: "Tunnel Presets",
    summary: "Update a client tunnel preset",
    description: "Updates the name or config of one of the authenticated user's tunnel presets.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PUT /credential-sidebar/preferences",
    method: "PUT",
    path: "/credential-sidebar/preferences",
    tag: "Credential Sidebar",
    summary: "Update the credential sidebar preferences for the current user",
    description:
      "Persists the current user's credential sidebar preferences (sort, filters, open folders, display settings) as a single JSON document.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "PUT /credentials/{id}",
    method: "PUT",
    path: "/credentials/{id}",
    tag: "Credentials",
    summary: "Update a credential",
    description: "Updates a specific credential by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /credentials/folders/rename",
    method: "PUT",
    path: "/credentials/folders/rename",
    tag: "Credentials",
    summary: "Rename a credential folder",
    description: "Renames a credential folder for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        oldName: {
          type: "string",
        },
        newName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /credentials/reorder",
    method: "PUT",
    path: "/credentials/reorder",
    tag: "Credentials",
    summary: "Reorder credentials",
    description:
      "Sets a manual sortOrder for multiple credentials within the same folder, used by drag-to-reorder in the sidebar's manual sort mode.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        positions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              sortOrder: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  {
    operationKey: "PUT /homepage/items/{id}",
    method: "PUT",
    path: "/homepage/items/{id}",
    tag: "Homepage",
    summary: "Update homepage item",
    description: "Updates a homepage widget item.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        config: {
          type: "object",
        },
      },
    },
  },
  {
    operationKey: "PUT /homepage/layout",
    method: "PUT",
    path: "/homepage/layout",
    tag: "Homepage",
    summary: "Save homepage layout",
    description: "Saves or updates the homepage canvas layout for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        entries: {
          type: "array",
        },
        pan: {
          type: "object",
        },
        zoom: {
          type: "number",
        },
      },
    },
  },
  {
    operationKey: "PUT /host-sidebar/preferences",
    method: "PUT",
    path: "/host-sidebar/preferences",
    tag: "Host Sidebar",
    summary: "Update the host sidebar preferences for the current user",
    description:
      "Persists the current user's sidebar preferences (sort, group, filters, open folders, display settings) as a single JSON document.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "PUT /host/db/host/{id}",
    method: "PUT",
    path: "/host/db/host/{id}",
    tag: "SSH",
    summary: "Update SSH host",
    description: "Updates an existing SSH host configuration.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PUT /host/folders/metadata",
    method: "PUT",
    path: "/host/folders/metadata",
    tag: "SSH",
    summary: "Update folder metadata",
    description: "Updates the metadata (color, icon, assigned credential) of a folder.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        color: {
          type: "string",
        },
        icon: {
          type: "string",
        },
        credentialId: {
          type: "integer",
          nullable: true,
        },
      },
    },
  },
  {
    operationKey: "PUT /host/folders/rename",
    method: "PUT",
    path: "/host/folders/rename",
    tag: "SSH",
    summary: "Rename folder",
    description: "Renames a folder for SSH hosts and credentials.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        oldName: {
          type: "string",
        },
        newName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /host/folders/reorder",
    method: "PUT",
    path: "/host/folders/reorder",
    tag: "SSH",
    summary: "Reorder folders",
    description:
      "Sets a manual sortOrder for multiple sibling folders, used by drag-to-reorder in the sidebar's manual sort mode. Folders with no existing metadata row are created.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        positions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              sortOrder: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  {
    operationKey: "PUT /host/reorder",
    method: "PUT",
    path: "/host/reorder",
    tag: "SSH",
    summary: "Reorder hosts",
    description:
      "Sets a manual sortOrder for multiple hosts within the same folder, used by drag-to-reorder in the sidebar's manual sort mode.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        positions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              sortOrder: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  {
    operationKey: "PUT /notification-channels/{id}",
    method: "PUT",
    path: "/notification-channels/{id}",
    tag: "Alerts",
    summary: "Update a notification channel",
    parameters: [],
  },
  {
    operationKey: "PUT /open-tabs",
    method: "PUT",
    path: "/open-tabs",
    tag: "Open Tabs",
    summary: "Bulk replace all open tabs for the current user",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        tabs: {
          type: "array",
        },
      },
    },
  },
  {
    operationKey: "PUT /rbac/host-access/{hostId}/auth/{protocol}",
    method: "PUT",
    path: "/rbac/host-access/{hostId}/auth/{protocol}",
    tag: "RBAC",
    summary: "Set personal authentication for a shared host protocol",
    description:
      "Selects one of the authenticated recipient's own credentials, or clears the selection with null. Only SSH is currently supported.",
    parameters: [],
  },
  {
    operationKey: "PUT /rbac/roles/{id}",
    method: "PUT",
    path: "/rbac/roles/{id}",
    tag: "RBAC",
    summary: "Update a role",
    description: "Updates a role by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        displayName: {
          type: "string",
        },
        description: {
          type: "string",
        },
        permissions: {
          type: "array",
          description:
            "Permission strings validated against the permissions catalog (wildcards like hosts.* and * allowed).",
          items: {
            type: "string",
          },
        },
      },
    },
  },
  {
    operationKey: "PUT /service-links/{id}",
    method: "PUT",
    path: "/service-links/{id}",
    tag: "Dashboard",
    summary: "Update service link",
    description: "Updates label or url of a dashboard service link.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        label: {
          type: "string",
        },
        url: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /snippets/{id}",
    method: "PUT",
    path: "/snippets/{id}",
    tag: "Snippets",
    summary: "Update a snippet",
    description: "Updates a specific snippet by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        content: {
          type: "string",
        },
        description: {
          type: "string",
        },
        folder: {
          type: "string",
        },
        order: {
          type: "integer",
        },
        isNote: {
          type: "boolean",
          description:
            "When true, the snippet is a note (copy/paste only, not directly executable on a host).",
        },
      },
    },
  },
  {
    operationKey: "PUT /snippets/folders/{name}/metadata",
    method: "PUT",
    path: "/snippets/folders/{name}/metadata",
    tag: "Snippets",
    summary: "Update snippet folder metadata",
    description: "Updates the metadata (color, icon) of a snippet folder.",
    parameters: [
      {
        name: "name",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        color: {
          type: "string",
        },
        icon: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /snippets/folders/rename",
    method: "PUT",
    path: "/snippets/folders/rename",
    tag: "Snippets",
    summary: "Rename a snippet folder",
    description: "Renames a snippet folder for the authenticated user.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        oldName: {
          type: "string",
        },
        newName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /snippets/reorder",
    method: "PUT",
    path: "/snippets/reorder",
    tag: "Snippets",
    summary: "Reorder snippets",
    description:
      "Bulk updates the order and folder of snippets. Accepts `snippets` and the legacy `updates` payload key.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        snippets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              order: {
                type: "integer",
              },
              folder: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    operationKey: "PUT /ssh/file_manager/ssh/moveItem",
    method: "PUT",
    path: "/ssh/file_manager/ssh/moveItem",
    tag: "File Manager",
    summary: "Move a file or directory",
    description: "Moves a file or directory on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        oldPath: {
          type: "string",
        },
        newPath: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /ssh/file_manager/ssh/renameItem",
    method: "PUT",
    path: "/ssh/file_manager/ssh/renameItem",
    tag: "File Manager",
    summary: "Rename a file or directory",
    description: "Renames a file or directory on the remote host.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
        },
        oldPath: {
          type: "string",
        },
        newName: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /termix-id",
    method: "PUT",
    path: "/termix-id",
    tag: "Termix ID",
    summary: "Update Termix ID handle or description",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        handle: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
    },
  },
  {
    operationKey: "PUT /ui-preferences",
    method: "PUT",
    path: "/ui-preferences",
    tag: "UI Preferences",
    summary: "Update the UI complexity preferences for the current user",
    description:
      "Persists the current user's interface preset, per-area overrides and onboarding state as a single JSON document. Overrides are merged two levels deep, so a request only has to send the keys it changes. A null at a key clears that single override; a null at an area clears every override for that area; a null at overrides clears all of them.",
    parameters: [],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "PUT /user-preferences",
    method: "PUT",
    path: "/user-preferences",
    tag: "User Preferences",
    summary: "Update preferences for the current user",
    description:
      "showHostTags, hostTrayOnClick, compactHostView, statusColorScheme and foldersCollapsed are no longer accepted here -- they moved to PUT /host-sidebar/preferences as part of the sidebar redesign.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        reopenTabsOnLogin: {
          type: "boolean",
        },
        theme: {
          type: "string",
        },
        fontSize: {
          type: "string",
        },
        accentColor: {
          type: "string",
        },
        language: {
          type: "string",
        },
        storageMode: {
          type: "string",
        },
        commandAutocomplete: {
          type: "boolean",
        },
        commandPaletteEnabled: {
          type: "boolean",
        },
        pinAppRail: {
          type: "boolean",
        },
        expandAppRailOnHover: {
          type: "boolean",
        },
        confirmSnippetExecution: {
          type: "boolean",
        },
        disableUpdateCheck: {
          type: "boolean",
        },
        confirmTabClose: {
          type: "boolean",
        },
        hiddenRailTabs: {
          type: "string",
        },
        customThemes: {
          type: "string",
          description: "JSON-encoded array of the user's saved global custom terminal themes.",
        },
        customKeybindings: {
          type: "string",
          description: "JSON-encoded array of the user's custom terminal keybindings.",
        },
      },
    },
  },
  {
    operationKey: "PUT /users/sso-providers/{id}",
    method: "PUT",
    path: "/users/sso-providers/{id}",
    tag: "SSO",
    summary: "Update SSO provider",
    description: "Updates an existing SSO provider configuration.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
  },
  {
    operationKey: "PUT /vault/profiles/{id}",
    method: "PUT",
    path: "/vault/profiles/{id}",
    tag: "Vault",
    summary: "Update a Vault profile",
    description:
      "Updates a Vault signer profile. Only the owner may edit; toggling shared to true requires admin privileges.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
    },
  },
  {
    operationKey: "PUT /workspaces/{id}/content",
    method: "PUT",
    path: "/workspaces/{id}/content",
    tag: "Workspaces",
    summary: "Overwrite a workspace's saved tab arrangement with a new payload",
    description:
      'Used by "Update with current" in the Workspaces panel. Rejects the Last Session workspace.',
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    requestBody: {
      type: "object",
      properties: {
        payload: {
          type: "object",
        },
      },
    },
  },
  {
    operationKey: "PUT /workspaces/last-session",
    method: "PUT",
    path: "/workspaces/last-session",
    tag: "Workspaces",
    summary: 'Upsert the auto-maintained "Last Session" workspace',
    description:
      "Always overwrites the single Last Session row for the caller - never creates a second one. Called by the frontend's debounced auto-save effect.",
    parameters: [],
    requestBody: {
      type: "object",
      properties: {
        payload: {
          type: "object",
        },
      },
    },
  },
];
