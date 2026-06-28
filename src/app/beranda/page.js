import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { getLatestBeritaHome, getPopularBeritaHome, getBeritaPerBidangHome } from "../../lib/berita-home";
import { getLatestGaleriHome } from "../../lib/galeri-home";
import { getPublicHomepageSlides } from "../../lib/homepage-slides";
import HomeHeroSection from "@/components/features/home/HomeHeroSection";
import LayananPtspSection from "@/components/features/home/LayananPtspSection";
import ApaKataMerekaSection from "@/components/features/home/ApaKataMerekaSection";
import { siteInfo } from "@/data/site";
import { db } from "@/lib/drizzle";
import { testimonials } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { logError } from "@/lib/logger";
import { getPtspServicesHome } from "@/lib/ptsp-services";

const HomeNewsSection = dynamic(() => import("@/components/features/home/HomeNewsSection"));
const HomeNewsPerCategorySection = dynamic(() => import("@/components/features/home/HomeNewsPerCategorySection"));
const HomeGallerySection = dynamic(() => import("@/components/features/home/HomeGallerySection"));
const HomepageSlidesSection = dynamic(() => import("@/components/features/home/HomepageSlidesSection"));
const ExternalAppsSection = dynamic(() => import("@/components/features/home/ExternalAppsSection"));
import ScrollReveal from "@/components/common/ScrollReveal";

// Cache 5 menit — konten jarang berubah
export const revalidate = 300;

export const metadata = {
  title: "Beranda",
  description: siteInfo.description,
  alternates: {
    canonical: siteInfo.siteUrl.replace(/\/$/, "") + "/beranda",
  },
};

function SectionDivider() {
  return (
    <div className="py-4" aria-hidden="true">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="relative h-10">
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.35) 16%, rgba(148,163,184,0.55) 50%, rgba(16,185,129,0.35) 84%, transparent 100%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-3 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/30 blur-xl dark:bg-emerald-300/15" />
        </div>
      </div>
    </div>
  );
}

const getCachedTestimonials = unstable_cache(
  async () => {
    try {
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.is_active, true))
        .orderBy(asc(testimonials.sort_order));
    } catch (err) {
      logError("beranda_testimonials_error", { error: err?.message });
      return [];
    }
  },
  ["home-testimonials"],
  {
    revalidate: 600,
    tags: ["home-testimonials"],
  },
);

export default async function HomePage() {
  const [
    latestBerita,
    popularBerita,
    groupedBerita,
    latestGaleri,
    slidesData,
    ptspServices,
    testimonialData
  ] = await Promise.all([
    getLatestBeritaHome(),
    getPopularBeritaHome(),
    getBeritaPerBidangHome(),
    getLatestGaleriHome(),
    getPublicHomepageSlides(),
    getPtspServicesHome(),
    getCachedTestimonials(),
  ]);

  return (
    <main className="theme-page min-h-screen">
      <HomeHeroSection />

      <ScrollReveal delay={0.1}>
        <div className="pt-8 lg:pt-10">
          <SectionDivider />
        </div>
      </ScrollReveal>

      {/* Layanan PTSP */}
      <ScrollReveal>
        <LayananPtspSection services={ptspServices} />
      </ScrollReveal>

      <SectionDivider />

      {/* Apa Kata Mereka */}
      <ScrollReveal>
        <ApaKataMerekaSection testimonials={testimonialData} />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SectionDivider />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <HomeNewsSection latestBerita={latestBerita} popularBerita={popularBerita} />
      </ScrollReveal>

      {groupedBerita && groupedBerita.length > 0 && (
        <ScrollReveal delay={0.2}>
          <HomeNewsPerCategorySection groupedBerita={groupedBerita} />
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.1}>
        <SectionDivider />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <HomeGallerySection latestGaleri={latestGaleri} />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SectionDivider />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <HomepageSlidesSection slides={slidesData} />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SectionDivider />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <ExternalAppsSection />
      </ScrollReveal>
    </main>
  );
}
