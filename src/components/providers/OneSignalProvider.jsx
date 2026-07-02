"use client";

import Script from "next/script";
import React from "react";

export default function OneSignalProvider() {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            try {
              await OneSignal.init({
                appId: "7dc65184-fec0-4fd4-bb2a-5e274891c8b5",
                safari_web_id: "web.onesignal.auto.0c986762-0fae-40b1-a5f6-ee95f7275a97",
                notifyButton: {
                  enable: false,
                },
                allowLocalhostAsSecureOrigin: true,
              });
            } catch (err) {
              console.warn("OneSignal Initialization skipped:", err.message);
            }
          });
        `}
      </Script>
    </>
  );
}
