import React from "react";
import YoutubeManager from "@/components/features/admin/youtube/YoutubeManager";
import { siteInfo } from "@/data/site";

export const metadata = {
  title: `Manajemen YouTube - Admin ${siteInfo.name}`,
};

export default function AdminYoutubePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <YoutubeManager />
    </div>
  );
}
