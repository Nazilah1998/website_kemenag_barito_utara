import React from "react";
import { db } from "@/lib/drizzle";
import { youtube_videos } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import PageBanner from "@/components/common/PageBanner";
import VideoPageClient from "@/components/features/video/VideoPageClient";
import { messagesId } from "@/data/i18n-id";

export const metadata = {
  title: "Video Youtube - Kementerian Agama Kabupaten Barito Utara",
  description: "Dokumentasi visual video kegiatan dan pelayanan dari channel YouTube resmi Kementerian Agama Kabupaten Barito Utara.",
};

export default async function VideoPage() {
  const m = messagesId;

  // Fetch videos from DB
  const videosData = await db
    .select()
    .from(youtube_videos)
    .where(eq(youtube_videos.is_published, true))
    .orderBy(asc(youtube_videos.sort_order), desc(youtube_videos.updated_at));

  // Serialize BigInt if needed or transform dates
  const serializedVideos = videosData.map((v) => ({
    ...v,
    id: String(v.id), // handle UUIDs safely
    created_at: v.created_at ? new Date(v.created_at).toISOString() : null,
    updated_at: v.updated_at ? new Date(v.updated_at).toISOString() : null,
  }));

  return (
    <>
      <PageBanner
        breadcrumb={[
          { label: "Beranda", href: "/beranda" },
          { label: "Video", href: "/video" },
        ]}
        title="Dokumentasi Video Youtube"
        eyebrow="MEDIA CENTER"
        description="Saksikan berbagai liputan, kegiatan, dan inovasi Kementerian Agama Barito Utara secara eksklusif langsung dari kanal YouTube resmi."
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <section className="relative overflow-hidden bg-white py-16 dark:bg-slate-900 sm:py-24">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-100 to-sky-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:from-emerald-900/40 dark:to-sky-900/40"></div>
        </div>

        <div className="mx-auto w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <VideoPageClient videos={serializedVideos} />
        </div>
      </section>
    </main>
    </>
  );
}
