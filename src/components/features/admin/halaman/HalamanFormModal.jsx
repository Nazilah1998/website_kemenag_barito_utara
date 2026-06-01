"use client";

import { useMemo } from "react";

const SLUG_FIELDS = {
  "visi-misi": {
    title: { value: "Visi & Misi", label: "Visi & Misi" },
    desc: "Visi dan misi Kementerian Agama Kabupaten Barito Utara dalam membangun pelayanan keagamaan yang profesional dan berintegritas.",
    template: JSON.stringify({ vision: "", missions: [""] }),
    fields: [
      { key: "vision", label: "Visi", type: "textarea", placeholder: "Tulis kalimat visi di sini..." },
      { key: "missions", label: "Misi (tambah sesuai kebutuhan)", type: "list", placeholder: "Tulis misi..." },
    ],
  },
  "sejarah": {
    title: { value: "Sejarah", label: "Sejarah" },
    desc: "Sejarah berdirinya Kementerian Agama Kabupaten Barito Utara dari masa ke masa.",
    template: JSON.stringify({ timeline: [{ year: "", title: "", description: "" }] }),
    fields: [
      { key: "timeline", label: "Linimasa Sejarah", type: "group", subFields: [
        { key: "year", label: "Tahun", type: "text", placeholder: "cth: 1960" },
        { key: "title", label: "Judul Peristiwa", type: "text", placeholder: "cth: Awal Berdirinya Kemenag" },
        { key: "description", label: "Deskripsi", type: "textarea", placeholder: "Ceritakan peristiwanya..." },
      ]},
    ],
  },
  "tujuan": {
    title: { value: "Tujuan", label: "Tujuan" },
    desc: "Tujuan strategis Kementerian Agama Kabupaten Barito Utara dalam meningkatkan kualitas layanan keagamaan.",
    template: JSON.stringify({ goals: [{ title: "", description: "" }] }),
    fields: [
      { key: "goals", label: "Daftar Tujuan", type: "group", subFields: [
        { key: "title", label: "Judul Tujuan", type: "text", placeholder: "cth: Meningkatkan Kualitas Layanan" },
        { key: "description", label: "Penjelasan", type: "textarea", placeholder: "Penjelasan tujuan..." },
      ]},
    ],
  },
  "tugas-fungsi": {
    title: { value: "Tugas & Fungsi", label: "Tugas & Fungsi" },
    desc: "Tugas pokok dan fungsi Kementerian Agama Kabupaten Barito Utara dalam penyelenggaraan urusan keagamaan.",
    template: JSON.stringify({ indikator: [""], tugasUtama: [""], orientasiKerja: [""], fungsiLayanan: [{ title: "", description: "" }] }),
    fields: [
      { key: "indikator", label: "Prinsip Layanan (Indikator)", type: "list", placeholder: "cth: Responsif" },
      { key: "tugasUtama", label: "Tugas Utama", type: "list", placeholder: "cth: Melaksanakan pelayanan..." },
      { key: "orientasiKerja", label: "Orientasi Kerja", type: "list", placeholder: "cth: Pelayanan Publik" },
      { key: "fungsiLayanan", label: "Fungsi Kelembagaan", type: "group", subFields: [
        { key: "title", label: "Nama Fungsi", type: "text", placeholder: "cth: Perumusan Kebijakan" },
        { key: "description", label: "Penjelasan", type: "textarea", placeholder: "Penjelasan fungsi..." },
      ]},
    ],
  },
  "nilai-budaya-kerja": {
    title: { value: "Nilai Budaya Kerja", label: "Nilai Budaya Kerja" },
    desc: "Nilai-nilai budaya kerja aparatur Kementerian Agama Kabupaten Barito Utara.",
    template: JSON.stringify({ values: [{ title: "", description: "" }] }),
    fields: [
      { key: "values", label: "Daftar Nilai", type: "group", subFields: [
        { key: "title", label: "Nama Nilai", type: "text", placeholder: "cth: Integritas" },
        { key: "description", label: "Penjelasan", type: "textarea", placeholder: "Penjelasan nilai..." },
      ]},
    ],
  },
};

const SLUG_OPTIONS = [
  { value: "", label: "-- Pilih Jenis Halaman --" },
  ...Object.entries(SLUG_FIELDS).map(([slug, cfg]) => ({
    value: slug,
    label: cfg.title.label || cfg.title.value,
  })),
];

function parseContent(raw) {
  try {
    const parsed = JSON.parse(raw || "{}");
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function ListEditor({ value = [], onChange, placeholder }) {
  const items = Array.isArray(value) ? value : [""];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
              title="Hapus"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-700 dark:text-emerald-400"
      >
        + Tambah Item
      </button>
    </div>
  );
}

function GroupEditor({ value = [], onChange, subFields }) {
  const items = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {subFields[0]?.label || "Item"} #{i + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-[11px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700"
              >
                Hapus
              </button>
            )}
          </div>
          <div className="space-y-3">
            {subFields.map((sf) => (
              <div key={sf.key}>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{sf.label}</label>
                {sf.type === "textarea" ? (
                  <textarea
                    value={item[sf.key] || ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sf.key]: e.target.value };
                      onChange(next);
                    }}
                    placeholder={sf.placeholder}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={item[sf.key] || ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sf.key]: e.target.value };
                      onChange(next);
                    }}
                    placeholder={sf.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const blank = {};
          subFields.forEach((sf) => { blank[sf.key] = ""; });
          onChange([...items, blank]);
        }}
        className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-700 dark:text-emerald-400"
      >
        + Tambah {subFields[0]?.label || "Item"}
      </button>
    </div>
  );
}

export default function HalamanFormModal({
  open, onClose, form, onUpdate, onSave, saving, dirty, editingId,
}) {
  const slugConfig = useMemo(() => SLUG_FIELDS[form.slug], [form.slug]);
  const contentData = useMemo(() => parseContent(form.content), [form.content]);
  const isSlugKnown = !!slugConfig;

  function updateContentField(key, value) {
    const next = { ...contentData, [key]: value };
    onUpdate("content", JSON.stringify(next));
  }

  function handleSlugChange(slug) {
    const cfg = SLUG_FIELDS[slug];
    if (cfg) {
      onUpdate("slug", slug);
      onUpdate("title", cfg.title.value);
      onUpdate("description", cfg.desc);
      onUpdate("content", cfg.template);
    } else {
      onUpdate("slug", slug);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {editingId ? "Edit" : "Buat"} Halaman Statis
            </h2>
            {form.slug && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Slug: <span className="font-mono font-bold text-emerald-700">{form.slug}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-600 dark:border-slate-700 dark:hover:border-slate-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Jenis Halaman
            </label>
            <select
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
            >
              {SLUG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {!editingId && !form.slug && (
              <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                Pilih jenis halaman untuk mengisi konten secara otomatis
              </p>
            )}
          </div>

          {isSlugKnown && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Judul Halaman
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onUpdate("title", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Deskripsi untuk SEO
                  <span className="ml-1.5 font-normal normal-case text-slate-400">(tampil di hasil pencarian Google)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => onUpdate("description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdate("is_published", !form.is_published)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_published ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_published ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {form.is_published ? "Published — Langsung tampil" : "Draft — Disimpan tapi belum tampil"}
                </span>
              </div>

              <div className="space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/10">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Konten Halaman — {slugConfig.title.value}
                  </h3>
                </div>
                {slugConfig.fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {field.label}
                    </label>
                    {field.type === "textarea" && (
                      <textarea
                        value={contentData[field.key] || ""}
                        onChange={(e) => updateContentField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                      />
                    )}
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={contentData[field.key] || ""}
                        onChange={(e) => updateContentField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
                      />
                    )}
                    {field.type === "list" && (
                      <ListEditor
                        value={contentData[field.key]}
                        onChange={(val) => updateContentField(field.key, val)}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.type === "group" && (
                      <GroupEditor
                        value={contentData[field.key]}
                        onChange={(val) => updateContentField(field.key, val)}
                        subFields={field.subFields}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!isSlugKnown && form.slug && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Konten (JSON manual)</label>
              <textarea
                value={form.content}
                onChange={(e) => onUpdate("content", e.target.value)}
                placeholder='{"key": "value"}'
                rows={8}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
              />
              <p className="mt-1 text-[11px] text-amber-600">Slug tidak dikenali. Gunakan format JSON manual.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800">
          {dirty && (
            <span className="mr-auto text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Ada perubahan belum disimpan
            </span>
          )}
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.slug}
            className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 active:scale-95"
          >
            {saving ? "Menyimpan..." : editingId ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}