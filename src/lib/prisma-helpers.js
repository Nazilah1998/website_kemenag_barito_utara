/**
 * Safely serializes a Prisma result by converting BigInt values to Numbers.
 * This is necessary because JSON.stringify (used in NextResponse.json) doesn't support BigInt.
 */
export function serializePrisma(data) {
  if (data === null || data === undefined) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(serializePrisma);
  }

  // Handle objects
  if (typeof data === "object") {
    // Handle Date objects
    if (data instanceof Date) return data;

    const entries = Object.entries(data).map(([key, value]) => {
      // Recursively handle nested objects/arrays
      if (typeof value === "bigint") {
        return [key, Number(value)];
      }
      if (typeof value === "object" && value !== null) {
        return [key, serializePrisma(value)];
      }
      return [key, value];
    });

    return Object.fromEntries(entries);
  }

  return data;
}

/**
 * Common response creator for consistent API responses
 */
export function apiResponse(data, status = 200) {
  return Response.json(serializePrisma(data), {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

/**
 * Extracts and validates ID from Next.js context
 */
export async function getSafeIdFromContext(context) {
  // context.params can be a Promise in Next.js 15
  const params = await context.params;
  const id = params?.id;
  if (!id) throw new Error("ID parameter is missing");
  return id;
}
