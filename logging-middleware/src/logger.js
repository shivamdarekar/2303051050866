import axios from "axios";
import { LOG_ENDPOINT } from "./constants.js";
import { validateLogArgs } from "./validator.js";
import { resolveAuthToken } from "./config.js";

/**
 * @typedef {Object} LogPayload
 * @property {string} stack   - "backend" | "frontend"
 * @property {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @property {string} package - The originating package/layer
 * @property {string} message - Human-readable log message
 */

/**
 * @typedef {Object} LogResult
 * @property {boolean} success       - Whether the log was accepted by the remote service.
 * @property {number|null} status    - HTTP status code returned, or null on network failure.
 * @property {string|null} error     - Error description when success is false, else null.
 */

/**
 * Sends a structured log entry to the remote evaluation logging service.
 *
 * Usage:
 *   import { Log } from "logging-middleware";
 *   await Log("backend", "info", "service", "Fetched notifications successfully");
 *
 * @param {string} stack   - Originating stack: "backend" | "frontend"
 * @param {string} level   - Severity: "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg     - Originating package/layer (stack-specific set + shared set)
 * @param {string} message - Log message
 * @returns {Promise<LogResult>}
 */
export async function Log(stack, level, pkg, message) {
  const validation = validateLogArgs(stack, level, pkg, message);

  if (!validation.valid) {
    return { success: false, status: null, error: validation.error };
  }

  const token = resolveAuthToken();

  if (!token || token === 'your_bearer_token_here' || token.length > 48) {
    return {
      success: false,
      status: null,
      error:
        "LOG_AUTH_TOKEN is invalid (the real service expects a short ID, not a full JWT). Skipping logs.",
    };
  }

  /** @type {LogPayload} */
  const payload = {
    stack,
    level,
    package: pkg,
    message: message.trim(),
  };

  try {
    const response = await axios.post(LOG_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Do not let a slow logging service block application logic.
      timeout: 5000,
    });

    return { success: true, status: response.status, error: null };
  } catch (err) {
    // Network failures, timeouts, or non-2xx responses must never propagate.
    // The application continues to work even if the logging service is down.
    const status = err?.response?.status ?? null;
    const message =
      err?.response?.data?.message ??
      err?.message ??
      "Unknown error contacting logging service.";

    return { success: false, status, error: message };
  }
}
