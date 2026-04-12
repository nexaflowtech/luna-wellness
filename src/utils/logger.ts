/**
 * Lightweight structured logging utility for Expo Router applications.
 *
 * Designed to provide organized console output during development while
 * compiling to absolute-zero-op silences in production environments to protect
 * user data and maximize JavaScript thread performance.
 */

// Native React Native / Expo global dev-environment flag
const isDevelopment = __DEV__;

/**
 * Standard informational event logging.
 *
 * @param message Description of the event
 * @param meta Optional structured metadata payload
 */
export function logInfo(message: string, meta?: Record<string, unknown>): void {
  if (!isDevelopment) return;

  if (meta !== undefined) {
    console.info(`[INFO] ${message}`, meta);
  } else {
    console.info(`[INFO] ${message}`);
  }
}

/**
 * System warning logging for retries or degraded, non-fatal states.
 *
 * @param message Description of the warning
 * @param meta Optional structured metadata payload
 */
export function logWarn(message: string, meta?: Record<string, unknown>): void {
  if (!isDevelopment) return;

  if (meta !== undefined) {
    console.warn(`[WARN] ${message}`, meta);
  } else {
    console.warn(`[WARN] ${message}`);
  }
}

/**
 * Hard failure logging.
 *
 * @param message Context of what was structurally disrupted
 * @param error Native Error object (preserves stack trace naturally via console.error)
 */
export function logError(message: string, error?: unknown): void {
  if (!isDevelopment) return;

  if (error !== undefined) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    console.error(`[ERROR] ${message}`);
  }
}
