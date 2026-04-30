import React from "react";

export function KontakFormHeader() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Formulir Pesan
      </p>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        Kirim pertanyaan, masukan, atau pengaduan Anda
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pesan akan diterima tim kami dan ditindaklanjuti pada jam layanan.
      </p>
    </div>
  );
}

export function KontakFormStatus({ result }) {
  if (!result) return null;
  return (
    <div
      role="status"
      className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${result.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
        }`}
    >
      {result.message}
    </div>
  );
}

export function KontakFormActions({ loading }) {
  return (
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
  );
}
