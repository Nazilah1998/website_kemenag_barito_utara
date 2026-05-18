"use client";

import React, { useEffect, useRef } from "react";

/**
 * Custom Cloudflare Turnstile Component
 * Works seamlessly in React 19 / Next.js without third-party npm packages.
 */
export default function Turnstile({ siteKey, onVerify, theme = "light" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!siteKey) {
      console.warn("Turnstile Site Key is missing.");
      return;
    }

    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId);

    // Load Turnstile script dynamically if not present
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme,
            callback: (token) => {
              onVerify(token);
            },
            "expired-callback": () => {
              onVerify(null);
            },
            "error-callback": () => {
              onVerify(null);
            },
          });
        } catch (error) {
          console.error("Failed to render Turnstile widget:", error);
        }
      }
    };

    // If Turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    } else {
      // Wait until script loads and Turnstile is initialized
      const interval = setInterval(() => {
        if (window.turnstile) {
          renderWidget();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }

    // Cleanup widget on unmount
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, theme]);

  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile min-h-[70px] flex justify-center items-center" 
    />
  );
}
