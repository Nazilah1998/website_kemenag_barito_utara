import { getLatestBeritaHome } from "../../lib/berita-home";
import { getLatestGaleriHome } from "../../lib/galeri-home";
import { getPublicHomepageSlides } from "../../lib/homepage-slides";
import HomeHeroSection from "@/components/features/home/HomeHeroSection";
import HomeNewsSection from "@/components/features/home/HomeNewsSection";
import HomeGallerySection from "@/components/features/home/HomeGallerySection";
import ApaKataMerekaSection from "@/components/features/home/ApaKataMerekaSection";
import HomepageSlidesSection from "@/components/features/home/HomepageSlidesSection";
import ExternalAppsSection from "@/components/features/home/ExternalAppsSection";
import { siteInfo } from "@/data/site";

export const revalidate = 300;

export const metadata = {
  title: "Kementerian Agama Kabupaten Barito Utara",
  description: siteInfo.description,
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

export default async function HomePage() {
  const [latestBerita, latestGaleri, homepageSlides] = await Promise.all([
    getLatestBeritaHome(),
    getLatestGaleriHome(),
    getPublicHomepageSlides(),
  ]);

  return (
    <main className="theme-page min-h-screen">
      <HomeHeroSection />

      <div className="pt-8 lg:pt-10">
        <SectionDivider />
      </div>

      <ApaKataMerekaSection />

      <SectionDivider />

      <HomeNewsSection latestBerita={latestBerita} />

      <SectionDivider />

      <HomeGallerySection latestGaleri={latestGaleri} />

      <SectionDivider />

      <HomepageSlidesSection slides={homepageSlides} />

      <SectionDivider />

      <ExternalAppsSection />
    </main>
  );
}
