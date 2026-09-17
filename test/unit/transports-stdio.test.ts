import { describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/server";

const transportInstance = { __fake: "stdio-transport" };
const StdioServerTransportMock = vi.fn().mockImplementation(function () {
  return transportInstance;
});

vi.mock("@modelcontextprotocol/server/stdio", () => ({
  StdioServerTransport: StdioServerTransportMock,
}));

const { runStdio } = await import("../../src/transports/stdio.js");

describe("runStdio", () => {
  it("connects the server to a fresh StdioServerTransport", async () => {
    const connect = vi.fn().mockResolvedValue(undefined);
    const server = { connect } as unknown as McpServer;

    await runStdio(server);

    expect(StdioServerTransportMock).toHaveBeenCalledTimes(1);
    expect(connect).toHaveBeenCalledWith(transportInstance);
  });
});
