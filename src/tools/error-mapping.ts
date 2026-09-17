import { ZodError } from "zod";
import { TermixApiError, TermixConnectionError } from "../termix/errors.js";
import type { ToolResult } from "../catalog/types.js";

/** Turns any error thrown by a tool handler into a CallToolResult-shaped, redacted text result. */
export function toErrorResult(error: unknown): ToolResult {
  if (error instanceof TermixApiError) {
    const codePart = error.code ? ` (${error.code})` : "";
    return { text: `Termix API error ${error.status}${codePart}: ${error.message}`, isError: true };
  }
  if (error instanceof TermixConnectionError) {
    return { text: `Could not reach Termix: ${error.message}`, isError: true };
  }
  if (error instanceof ZodError) {
    return { text: `Invalid input: ${error.message}`, isError: true };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { text: `Unexpected error: ${message}`, isError: true };
}
