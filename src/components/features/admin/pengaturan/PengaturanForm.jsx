"use client";

import React, { useState } from "react";
import { FloatingFeedback } from "@/components/features/admin/slides/SlidesUI";

export default function PengaturanForm({ initialSettings }) {
  const [formData, setFormData] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan pengaturan");
      }

      setFeedback({ type: "success", message: "Pengaturan identitas berhasil disimpan." });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <FloatingFeedback 
          type={feedback.type} 
          message={feedback.message} 
          onClose={() => setFeedback(null)} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Informasi Utama */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-slate-900">
          <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Informasi Utama
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Nama Kantor / Instansi
              </label>
              <input
                type="text"
                name="nama_kantor"
                value={formData.nama_kantor}
                onChange={handleChange}
                placeholder="Contoh: Kementerian Agama Kabupaten Barito Utara"
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Jl. Yetro Sinseng No. 12, Muara Teweh..."
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-8 border-t border-slate-100 pt-8 dark:border-white/5">
            <label className="mb-4 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Jam Layanan Operasional
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
              {[
                { key: 'senin', label: 'Senin' },
                { key: 'selasa', label: 'Selasa' },
                { key: 'rabu', label: 'Rabu' },
                { key: 'kamis', label: 'Kamis' },
                { key: 'jumat', label: 'Jumat' }
              ].map(day => (
                <div key={day.key} className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{day.label}</span>
                  <input
                    type="text"
                    name={`jam_layanan_${day.key}`}
                    value={formData[`jam_layanan_${day.key}`] || ""}
                    onChange={handleChange}
                    placeholder="08:00 - 16:00"
                    className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-indigo-500 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Kontak Dasar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-slate-900">
          <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Kontak Publik
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                placeholder="(0519) 123456"
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="kemenagbarut@kemenag.go.id"
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Sosial Media */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-slate-900">
          <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Tautan Sosial Media
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-rose-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-rose-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-rose-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Youtube URL
              </label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full rounded-xl border-2 border-slate-200 bg-transparent px-4 py-3 text-slate-900 transition-colors focus:border-rose-500 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 rounded-3xl bg-slate-50 p-6 dark:bg-white/5">
          {initialSettings.updatedAt && (
            <p className="text-xs font-medium text-slate-500">
              Terakhir diubah: {new Date(initialSettings.updatedAt).toLocaleString("id-ID")}
            </p>
          )}
          <div className="flex-1" />
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan Pengaturan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
