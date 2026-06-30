import {
  VALID_STACKS,
  VALID_LEVELS,
  VALID_BACKEND_PACKAGES,
  VALID_FRONTEND_PACKAGES,
  Stack,
} from "./constants.js";

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {string|null} error
 */

/**
 * Validates all four Log() arguments against the allowed enum sets.
 *
 * @param {string} stack
 * @param {string} level
 * @param {string} pkg
 * @param {string} message
 * @returns {ValidationResult}
 */
export function validateLogArgs(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    return {
      valid: false,
      error: `Invalid stack "${stack}". Allowed: ${VALID_STACKS.join(", ")}`,
    };
  }

  if (!VALID_LEVELS.includes(level)) {
    return {
      valid: false,
      error: `Invalid level "${level}". Allowed: ${VALID_LEVELS.join(", ")}`,
    };
  }

  const validPackages =
    stack === Stack.BACKEND ? VALID_BACKEND_PACKAGES : VALID_FRONTEND_PACKAGES;

  if (!validPackages.includes(pkg)) {
    return {
      valid: false,
      error: `Invalid package "${pkg}" for stack "${stack}". Allowed: ${validPackages.join(", ")}`,
    };
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return {
      valid: false,
      error: "Message must be a non-empty string.",
    };
  }

  return { valid: true, error: null };
}
