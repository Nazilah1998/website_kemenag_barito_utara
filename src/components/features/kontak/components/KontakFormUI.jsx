"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function KontakFormHeader() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {t("contact.formTitle")}
      </p>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {t("contact.formSubtitle")}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {t("contact.formDesc")}
      </p>
    </div>
  );
}

import { motion } from "framer-motion";

export function KontakFormStatus({ result }) {
  if (!result) return null;
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${result.ok
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-rose-200 bg-rose-50 text-rose-800"
        }`}
    >
      {result.message}
    </motion.div>
  );
}

export function KontakFormActions({ loading }) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("actions.loading") : t("contact.sendButton")}
      </motion.button>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t("contact.consentText")}
      </p>
    </div>
  );
}
