import semver from "semver";
import type { Logger } from "../util/logger.js";
import type { TermixClient } from "./client.js";

/** The newest Termix release this project's catalog has been validated against. See COMPATIBILITY.md. */
export const NEWEST_VALIDATED_VERSION = "2.7.1";

interface VersionResponse {
  localVersion?: string;
}

/**
 * Resolves the Termix version to use for tool gating: an explicit override,
 * otherwise a live probe of `GET /version?checkRemote=false`, otherwise (if
 * probing is disabled or fails) the newest validated version, so gating still
 * behaves sensibly instead of registering nothing.
 */
export async function detectTermixVersion(options: {
  client: TermixClient;
  override: string | undefined;
  probe: boolean;
  logger: Logger;
}): Promise<string> {
  const { client, override, probe, logger } = options;

  if (override) {
    if (!semver.valid(semver.coerce(override))) {
      throw new Error(`TERMIX_VERSION is not a valid version: ${override}`);
    }
    logger.info(`Using forced Termix version ${override} for tool gating.`);
    return override;
  }

  if (!probe) {
    logger.info(
      `TERMIX_VERSION_CHECK=false: assuming Termix ${NEWEST_VALIDATED_VERSION} (the newest validated version) for tool gating.`,
    );
    return NEWEST_VALIDATED_VERSION;
  }

  try {
    const response = await client.request<VersionResponse>({
      method: "GET",
      path: "/version",
      query: { checkRemote: "false" },
    });
    const detected = response.localVersion
      ? semver.coerce(response.localVersion)?.version
      : undefined;
    if (!detected) {
      throw new Error(
        `/version returned an unparseable localVersion: ${JSON.stringify(response.localVersion)}`,
      );
    }
    logger.info(`Detected Termix version ${detected}.`);
    if (semver.gt(detected, NEWEST_VALIDATED_VERSION)) {
      logger.warn(
        `Termix ${detected} is newer than the newest version this catalog was validated against ` +
          `(${NEWEST_VALIDATED_VERSION}). All tools will be registered; some may not work as expected. ` +
          "See COMPATIBILITY.md.",
      );
    }
    return detected;
  } catch (error) {
    logger.warn(
      `Could not detect Termix version (${(error as Error).message}). Assuming ${NEWEST_VALIDATED_VERSION}. ` +
        "Set TERMIX_VERSION to silence this or TERMIX_VERSION_CHECK=false to skip probing.",
    );
    return NEWEST_VALIDATED_VERSION;
  }
}

/** Whether `version` satisfies a tool's gating: within `versions` (default "*") and not matching any `disabledIn` range. */
export function versionSatisfies(
  version: string,
  versions: string | undefined,
  disabledIn: string[] | undefined,
): boolean {
  const range = versions ?? "*";
  if (!semver.satisfies(version, range, { includePrerelease: true })) return false;
  if (
    disabledIn?.some((disabledRange) =>
      semver.satisfies(version, disabledRange, { includePrerelease: true }),
    )
  ) {
    return false;
  }
  return true;
}
