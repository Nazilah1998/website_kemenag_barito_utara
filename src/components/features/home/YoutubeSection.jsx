import React from "react";
import { getPublicYoutubeVideos } from "@/lib/youtube";
import YoutubeSectionClient from "./YoutubeSectionClient";

export default async function YoutubeSection() {
  const videos = await getPublicYoutubeVideos();
  
  if (!videos || videos.length === 0) {
    return null;
  }

  return <YoutubeSectionClient initialVideos={videos} />;
}
