/**
 * Retrieves the Authorization Bearer token from the environment.
 *
 * - In Node.js (backend):  process.env.LOG_AUTH_TOKEN
 * - In Vite (frontend):    import.meta.env.VITE_LOG_AUTH_TOKEN
 *
 * The token is read at call-time (not module load time) so that test
 * environments can set the variable after the module is imported.
 *
 * @returns {string} The Bearer token string, or empty string if not set.
 */
export function resolveAuthToken() {
  // Node.js environment
  if (typeof process !== "undefined" && process.env?.LOG_AUTH_TOKEN) {
    return process.env.LOG_AUTH_TOKEN;
  }

  // Vite / browser environment
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_LOG_AUTH_TOKEN) {
    return import.meta.env.VITE_LOG_AUTH_TOKEN;
  }

  return "";
}
