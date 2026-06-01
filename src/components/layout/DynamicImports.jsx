"use client";

import dynamic from "next/dynamic";

const VercelAnalytics = dynamic(() => import("@/components/layout/VercelAnalytics"), { ssr: false });
const VercelSpeedInsights = dynamic(() => import("@/components/layout/VercelSpeedInsights"), { ssr: false });
const PwaRegister = dynamic(() => import("@/components/layout/PwaRegister"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/features/chat/ChatWidget"), { ssr: false });
const RealtimeSync = dynamic(() => import("@/components/common/RealtimeSync"), { ssr: false });

export default function DynamicImports() {
  return (
    <>
      <ChatWidget />
      <RealtimeSync />
      <VercelAnalytics />
      <VercelSpeedInsights />
      <PwaRegister />
    </>
  );
}
