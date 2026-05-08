"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const baseInput =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export function KontakFormFields({ form, onChange, getFieldError }) {
  const { t } = useLanguage();

  return (
    <>
      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={onChange}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormInput
          id="nama"
          label={t("contact.fullName")}
          value={form.nama}
          onChange={onChange}
          error={getFieldError("nama")}
          placeholder={t("contact.placeholderName")}
          required
        />
        <FormInput
          id="whatsapp"
          label={t("contact.whatsapp")}
          type="tel"
          value={form.whatsapp}
          onChange={onChange}
          error={getFieldError("whatsapp")}
          placeholder="Contoh: 081234567890"
          required
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="subjek"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {t("contact.messageCategory")}
        </label>
        <select
          id="subjek"
          name="subjek"
          value={form.subjek}
          onChange={onChange}
          className={`${baseInput} border-slate-200`}
        >
          <option value="Pertanyaan">{t("contact.categories.Pertanyaan")}</option>
          <option value="Masukan">{t("contact.categories.Masukan")}</option>
          <option value="Pengaduan">{t("contact.categories.Pengaduan")}</option>
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="pesan"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {t("contact.message")}
        </label>
        <textarea
          id="pesan"
          name="pesan"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          value={form.pesan}
          onChange={onChange}
          className={`${baseInput} ${getFieldError("pesan") ? "border-rose-400" : "border-slate-200"}`}
          placeholder={t("contact.placeholderMessage")}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-rose-600">{getFieldError("pesan") || ""}</span>
          <span className="text-slate-400">{form.pesan.length}/4000</span>
        </div>
      </div>
    </>
  );
}

function FormInput({ id, label, type = "text", value, onChange, error, placeholder, required }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={`${baseInput} ${error ? "border-rose-400" : "border-slate-200"}`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
