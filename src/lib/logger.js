function redactMeta(meta = {}) {
  const blockedKeys = [
    "password",
    "token",
    "access_token",
    "refresh_token",
    "authorization",
    "cookie",
    "cookies",
    "file",
    "buffer",
  ];

  const output = {};

  for (const [key, value] of Object.entries(meta || {})) {
    if (blockedKeys.includes(key.toLowerCase())) {
      output[key] = "[REDACTED]";
      continue;
    }

    if (value instanceof Error) {
      output[key] = {
        name: value.name,
        message: value.message,
      };
      continue;
    }

    output[key] = value;
  }

  return output;
}

function writeLog(level, event, meta = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...redactMeta(meta),
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logInfo(event, meta = {}) {
  writeLog("info", event, meta);
}

export function logWarn(event, meta = {}) {
  writeLog("warn", event, meta);
}

export function logError(event, meta = {}) {
  writeLog("error", event, meta);
}
