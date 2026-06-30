/**
 * Allowed stack identifiers.
 * @readonly
 * @enum {string}
 */
export const Stack = Object.freeze({
  BACKEND: "backend",
  FRONTEND: "frontend",
});

/**
 * Allowed log severity levels, ordered from least to most severe.
 * @readonly
 * @enum {string}
 */
export const Level = Object.freeze({
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
});

/**
 * Packages exclusive to the backend stack.
 * @readonly
 * @enum {string}
 */
export const BackendPackage = Object.freeze({
  CONTROLLER: "controller",
  ROUTE: "route",
  SERVICE: "service",
  REPOSITORY: "repository",
  HANDLER: "handler",
  CACHE: "cache",
  DB: "db",
  DOMAIN: "domain",
  CRON_JOB: "cron_job",
});

/**
 * Packages exclusive to the frontend stack.
 * @readonly
 * @enum {string}
 */
export const FrontendPackage = Object.freeze({
  PAGE: "page",
  COMPONENT: "component",
  HOOK: "hook",
  STATE: "state",
  API: "api",
});

/**
 * Packages valid on both stacks.
 * @readonly
 * @enum {string}
 */
export const SharedPackage = Object.freeze({
  AUTH: "auth",
  CONFIG: "config",
  MIDDLEWARE: "middleware",
  STYLE: "style",
  UTILS: "utils",
});

/** All valid package values for the backend stack (backend-specific + shared). */
export const VALID_BACKEND_PACKAGES = Object.freeze([
  ...Object.values(BackendPackage),
  ...Object.values(SharedPackage),
]);

/** All valid package values for the frontend stack (frontend-specific + shared). */
export const VALID_FRONTEND_PACKAGES = Object.freeze([
  ...Object.values(FrontendPackage),
  ...Object.values(SharedPackage),
]);

/** All valid stack values. */
export const VALID_STACKS = Object.freeze(Object.values(Stack));

/** All valid level values. */
export const VALID_LEVELS = Object.freeze(Object.values(Level));

/** The remote logging endpoint — never hardcoded in callers. */
export const LOG_ENDPOINT = "http://4.224.186.213/evaluation-service/logs";
