import { loadConfig, ConfigError } from "./config/load.js";
import { createLogger } from "./util/logger.js";
import { renderToolCatalog } from "./print-tools.js";
import { createServer } from "./server.js";
import { runStdio } from "./transports/stdio.js";
import { runHttp } from "./transports/http.js";

async function main(): Promise<void> {
  let config;
  try {
    config = loadConfig(process.argv.slice(2), process.env);
  } catch (error) {
    if (error instanceof ConfigError) {
      process.stderr.write(`termix-mcp: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }

  const logger = createLogger(config.logLevel);

  if (config.printTools) {
    process.stdout.write(renderToolCatalog(config) + "\n");
    return;
  }

  try {
    const { server } = await createServer(config, logger);
    if (config.transport === "stdio") {
      await runStdio(server);
    } else {
      await runHttp(server, config, logger);
    }
  } catch (error) {
    logger.error(`Fatal error during startup: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

void main();
