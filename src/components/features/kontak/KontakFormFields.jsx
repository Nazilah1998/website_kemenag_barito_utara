import React from "react";

const baseInput =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export function KontakFormFields({ form, onChange, getFieldError }) {
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
          label="Nama lengkap"
          value={form.nama}
          onChange={onChange}
          error={getFieldError("nama")}
          placeholder="Nama Anda"
          required
        />
        <FormInput
          id="whatsapp"
          label="No. WhatsApp"
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
          Kategori Pesan
        </label>
        <select
          id="subjek"
          name="subjek"
          value={form.subjek}
          onChange={onChange}
          className={`${baseInput} border-slate-200`}
        >
          <option value="Pertanyaan">Pertanyaan</option>
          <option value="Masukan">Masukan</option>
          <option value="Pengaduan">Pengaduan</option>
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="pesan"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Pesan
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
          placeholder="Tulis pertanyaan, masukan, atau pengaduan Anda di sini."
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
