type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMeta {
  [key: string]: unknown;
  file?: string;
  error?: { name?: string; message?: string; stack?: string };
}

const BLOCKED_KEYS = new Set([
  "password", "token", "access_token", "refresh_token",
  "authorization", "cookie", "cookies", "file", "buffer",
]);

function redactMeta(meta: LogMeta = {}): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (BLOCKED_KEYS.has(key.toLowerCase())) {
      output[key] = "[REDACTED]";
      continue;
    }

    if (value instanceof Error) {
      output[key] = {
        name: value.name,
        message: value.message,
        ...(process.env.NODE_ENV === "development" && { stack: value.stack }),
      };
      continue;
    }

    output[key] = value;
  }

  return output;
}

function writeLog(level: LogLevel, event: string, meta: LogMeta = {}): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...redactMeta(meta),
  };

  const line = JSON.stringify(payload);

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export function logInfo(event: string, meta?: LogMeta): void {
  writeLog("info", event, meta);
}

export function logWarn(event: string, meta?: LogMeta): void {
  writeLog("warn", event, meta);
}

export function logError(event: string, meta?: LogMeta): void {
  writeLog("error", event, meta);
}

export function logDebug(event: string, meta?: LogMeta): void {
  if (process.env.NODE_ENV !== "development") return;
  writeLog("debug", event, meta);
}

export function logTiming<T>(
  event: string,
  fn: () => T,
  meta?: LogMeta,
): T {
  const start = Date.now();

  try {
    const result = fn();

    if (result instanceof Promise) {
      return result
        .then((val: T) => {
          const durationMs = Date.now() - start;
          logInfo(`⏱ ${event}`, { durationMs, success: true, ...meta });
          return val;
        })
        .catch((err: Error) => {
          const durationMs = Date.now() - start;
          logError(`⏱ ${event}`, { durationMs, success: false, error: err, ...meta });
          throw err;
        }) as T;
    }

    const durationMs = Date.now() - start;
    logInfo(`⏱ ${event}`, { durationMs, success: true, ...meta });
    return result;
  } catch (err) {
    const durationMs = Date.now() - start;
    logError(`⏱ ${event}`, { durationMs, success: false, error: err as Error, ...meta });
    throw err;
  }
}

export type { LogLevel, LogMeta };
