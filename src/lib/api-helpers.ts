export function serializeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(serializeData);
  }

  if (typeof data === "object") {
    if (data instanceof Date) return data;

    const entries = Object.entries(data as Record<string, unknown>).map(([key, value]) => {
      if (typeof value === "bigint") {
        return [key, Number(value)];
      }
      if (typeof value === "object" && value !== null) {
        return [key, serializeData(value)];
      }
      return [key, value];
    });

    return Object.fromEntries(entries);
  }

  return data;
}

export function apiResponse(data: unknown, status = 200): Response {
  return Response.json(serializeData(data), {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export async function getSafeIdFromContext(context: RouteContext): Promise<string> {
  const params = await context.params;
  const id = params?.id;
  if (!id) throw new Error("ID parameter is missing");
  return id;
}
