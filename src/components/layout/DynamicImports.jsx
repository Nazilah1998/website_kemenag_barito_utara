"use client";

import dynamic from "next/dynamic";

const PwaRegister = dynamic(() => import("@/components/layout/PwaRegister"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/features/chat/ChatWidget"), { ssr: false });
const RealtimeSync = dynamic(() => import("@/components/common/RealtimeSync"), { ssr: false });
const PageViewTracker = dynamic(() => import("@/components/common/PageViewTracker"), { ssr: false });

export default function DynamicImports() {
  return (
    <>
      <ChatWidget />
      <RealtimeSync />
      <PwaRegister />
      <PageViewTracker />
    </>
  );
}
