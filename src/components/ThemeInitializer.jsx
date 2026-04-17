"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
    useEffect(() => {
        try {
            const STORAGE_KEY = "site-theme";
            const root = document.documentElement;
            const saved = window.localStorage.getItem(STORAGE_KEY);

            const theme =
                saved === "light" || saved === "dark"
                    ? saved
                    : window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light";

            root.dataset.theme = theme;
            root.classList.toggle("dark", theme === "dark");
            root.style.colorScheme = theme;
        } catch (_) {
            // noop
        }
    }, []);

    return null;
}