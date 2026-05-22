// src/components/VercelSpeedInsights.jsx
"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useState } from "react";

export default function VercelSpeedInsights() {
    const [isLocal, setIsLocal] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLocal) return null;

    return (
        <SpeedInsights
            beforeSend={(data) => {
                const pathname = new URL(data.url).pathname;

                if (pathname.startsWith("/admin")) {
                    return null;
                }

                return data;
            }}
        />
    );
}