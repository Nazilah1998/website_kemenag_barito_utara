import { logInfo, logWarn, logError, logTiming } from "@/lib/logger";

interface ApiHandlerContext {
  params: Promise<Record<string, string>> | Record<string, string>;
}

type ApiHandler = (
  request: Request,
  context: ApiHandlerContext,
) => Promise<Response>;

function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.password = "[REDACTED]";
    return u.toString();
  } catch {
    return url;
  }
}

export function withApiLogging(
  handler: ApiHandler,
  routeName: string,
): ApiHandler {
  return async (request: Request, context: ApiHandlerContext): Promise<Response> => {
    const method = request.method;
    const url = sanitizeUrl(request.url);
    const requestId = crypto.randomUUID().slice(0, 8);

    logInfo(`api_request ${routeName}`, {
      requestId,
      method,
      url,
      route: routeName,
    });

    try {
      const response = await logTiming(`api_handler ${routeName}`, () =>
        handler(request, context),
      );

      const status = response.status;
      const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
      const logFn = level === "error" ? logError : level === "warn" ? logWarn : logInfo;

      logFn(`api_response ${routeName}`, {
        requestId,
        method,
        route: routeName,
        status,
      });

      return response;
    } catch (error) {
      logError(`api_unhandled_error ${routeName}`, {
        requestId,
        method,
        route: routeName,
        error: error as Error,
      });

      return new Response(
        JSON.stringify({ message: "Internal Server Error", code: "INTERNAL_ERROR" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };
}
