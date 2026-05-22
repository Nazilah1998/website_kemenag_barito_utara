// src/components/VercelAnalytics.jsx
"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

export default function VercelAnalytics() {
    const [isLocal, setIsLocal] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLocal) return null;

    return (
        <Analytics
            beforeSend={(event) => {
                const pathname = new URL(event.url).pathname;

                if (pathname.startsWith("/admin")) {
                    return null;
                }

                return event;
            }}
        />
    );
}