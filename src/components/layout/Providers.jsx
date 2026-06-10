"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";

export default function Providers({ children, initialSettings }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider initialSettings={initialSettings}>
          {children}
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}