import { db } from "./drizzle";
import { ptspServices } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getPtspServicesHome = unstable_cache(
  async () => {
    try {
      const services = await db
        .select({
          id: ptspServices.id,
          name: ptspServices.name,
          slug: ptspServices.slug,
        })
        .from(ptspServices)
        .where(and(eq(ptspServices.isActive, true), eq(ptspServices.category, 'public')))
        .orderBy(asc(ptspServices.sortOrder));
      return services.map(s => ({ ...s, id: s.id.toString() }));
    } catch (error) {
      console.error("Error fetching PTSP services:", error);
      return [];
    }
  },
  ["ptsp-services-home"],
  { revalidate: 3600 }
);
