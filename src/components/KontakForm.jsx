"use client";

import { useState } from "react";

const INITIAL = {
  nama: "",
  email: "",
  subjek: "",
  pesan: "",
  website: "", // honeypot
};

function getFieldError(errors, field) {
  if (!errors) return null;
  const match = errors.find((e) => e.field === field);
  return match ? match.message : null;
}

export default function KontakForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState([]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setFieldErrors([]);

    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFieldErrors(data.errors || []);
        setResult({
          ok: false,
          message:
            data.message ||
            "Pesan gagal dikirim. Silakan coba lagi beberapa saat lagi.",
        });
        return;
      }

      setResult({
        ok: true,
        message:
          data.message ||
          "Pesan berhasil dikirim. Tim kami akan menindaklanjuti pada jam layanan.",
      });
      setForm(INITIAL);
    } catch {
      setResult({
        ok: false,
        message: "Terjadi kesalahan jaringan. Silakan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  }

  const baseInput =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Formulir Pesan
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Kirim pertanyaan atau masukan Anda
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pesan akan diterima tim humas pada jam layanan kantor.
        </p>
      </div>

      {/* Honeypot: disembunyikan dari user, wajib kosong. */}
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
        <div>
          <label
            htmlFor="nama"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Nama lengkap
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            required
            minLength={3}
            maxLength={120}
            value={form.nama}
            onChange={onChange}
            className={`${baseInput} ${getFieldError(fieldErrors, "nama") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="Nama Anda"
          />
          {getFieldError(fieldErrors, "nama") ? (
            <p className="mt-1 text-xs text-rose-600">
              {getFieldError(fieldErrors, "nama")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={180}
            value={form.email}
            onChange={onChange}
            className={`${baseInput} ${getFieldError(fieldErrors, "email") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="nama@email.com"
          />
          {getFieldError(fieldErrors, "email") ? (
            <p className="mt-1 text-xs text-rose-600">
              {getFieldError(fieldErrors, "email")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="subjek"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Subjek <span className="text-slate-400">(opsional)</span>
        </label>
        <input
          id="subjek"
          name="subjek"
          type="text"
          maxLength={160}
          value={form.subjek}
          onChange={onChange}
          className={`${baseInput} border-slate-200`}
          placeholder="Ringkasan singkat pesan Anda"
        />
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
          className={`${baseInput} ${getFieldError(fieldErrors, "pesan") ? "border-rose-400" : "border-slate-200"}`}
          placeholder="Tulis pertanyaan, masukan, atau pengaduan Anda di sini."
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-rose-600">
            {getFieldError(fieldErrors, "pesan") || ""}
          </span>
          <span className="text-slate-400">{form.pesan.length}/4000</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Dengan mengirim formulir ini, Anda setuju pesan Anda diproses oleh tim
          kantor untuk keperluan tindak lanjut.
        </p>
      </div>

      {result ? (
        <div
          role="status"
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {result.message}
        </div>
      ) : null}
    </form>
  );
}
