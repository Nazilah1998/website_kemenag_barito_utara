"use client";

import { useEffect, useState } from "react";
import PageBanner from "../../components/PageBanner";
import {
  buildWhatsAppLink,
  contactFaq,
  contactUnits,
  quickContactActions,
  siteInfo,
  siteLinks,
} from "../../data/site";

const INITIAL_FORM = {
  nama: "",
  email: "",
  nomor: "",
  tujuan: contactUnits[0]?.title || "",
  pesan: "",
};

const WEEKDAY_LABELS = {
  Mon: "Senin",
  Tue: "Selasa",
  Wed: "Rabu",
  Thu: "Kamis",
  Fri: "Jumat",
  Sat: "Sabtu",
  Sun: "Minggu",
};

function getOfficeStatus() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((item) => item.type === "weekday")?.value || "Mon";
  const hour = Number(parts.find((item) => item.type === "hour")?.value || 0);
  const minute = Number(parts.find((item) => item.type === "minute")?.value || 0);

  const currentMinutes = hour * 60 + minute;
  const openMinutes = 8 * 60;
  const closeMinutes = 16 * 60;

  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
  const isOpen = isWeekday && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  let detail = "";

  if (isOpen) {
    detail = "Layanan tatap muka sedang berjalan hingga pukul 16.00 WIB.";
  } else if (isWeekday && currentMinutes < openMinutes) {
    detail = "Layanan akan dibuka hari ini pukul 08.00 WIB.";
  } else {
    const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentIndex = dayOrder.indexOf(weekday);

    for (let i = 1; i <= 7; i += 1) {
      const nextDay = dayOrder[(currentIndex + i) % 7];

      if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(nextDay)) {
        detail = `Layanan akan dibuka kembali ${WEEKDAY_LABELS[nextDay]} pukul 08.00 WIB.`;
        break;
      }
    }
  }

  return {
    label: isOpen ? "Sedang Buka" : "Sedang Tutup",
    detail,
    nowText: `${WEEKDAY_LABELS[weekday]}, ${String(hour).padStart(2, "0")}.${String(
      minute
    ).padStart(2, "0")} WIB`,
    isOpen,
  };
}

function validateForm(values) {
  const errors = {};

  if (!values.nama.trim()) {
    errors.nama = "Nama wajib diisi.";
  } else if (values.nama.trim().length < 3) {
    errors.nama = "Nama minimal 3 karakter.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Format email belum valid.";
  }

  if (!values.tujuan.trim()) {
    errors.tujuan = "Pilih tujuan pesan.";
  }

  if (!values.pesan.trim()) {
    errors.pesan = "Pesan wajib diisi.";
  } else if (values.pesan.trim().length < 10) {
    errors.pesan = "Pesan minimal 10 karakter.";
  }

  return errors;
}

function QuickActionCard({ title, description, href, badge, external = false }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        {badge}
      </div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
        Buka layanan →
      </p>
    </a>
  );
}

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

export default function KontakPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [officeStatus, setOfficeStatus] = useState(getOfficeStatus());

  useEffect(() => {
    const updateStatus = () => setOfficeStatus(getOfficeStatus());

    updateStatus();
    const intervalId = setInterval(updateStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        type: "error",
        message: "Mohon periksa kembali data pada form.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: "loading",
      message: "Mengirim pesan...",
    });

    try {
      const response = await fetch("/api/kontak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Pesan belum berhasil dikirim.");
      }

      setStatus({
        type: "success",
        message: result.message || "Pesan berhasil dikirim. Terima kasih.",
      });
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Terjadi kendala saat mengirim pesan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusClassName =
    status?.type === "success"
      ? "rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      : status?.type === "error"
      ? "rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
      : "rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700";

  return (
    <>
      <PageBanner
        title="Kontak"
        description="Pilih kanal komunikasi yang paling sesuai, temukan lokasi kantor, dan kirim pesan dengan cara yang lebih cepat dan jelas."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]}
      />

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-950 p-8 text-white shadow-sm">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90">
              Pusat Kontak Resmi
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Hubungi kantor dengan cepat, rapi, dan sesuai kebutuhan.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 md:text-base">
              Halaman ini dirancang untuk memudahkan pengunjung menghubungi kantor,
              melihat status layanan, menemukan lokasi, dan memilih jalur komunikasi
              yang paling tepat.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {quickContactActions.map((action) => (
                <QuickActionCard key={action.title} {...action} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Status Layanan
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {officeStatus.label}
                  </h2>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    officeStatus.isOpen
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {officeStatus.isOpen ? "Online" : "Offline"}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-600">{officeStatus.detail}</p>

              <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Waktu kantor saat ini</p>
                  <p className="mt-1">{officeStatus.nowText}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Jam layanan</p>
                  <p className="mt-1">{siteInfo.officeHours}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Kontak Utama
              </p>

              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Nama Instansi</p>
                  <p className="mt-1">{siteInfo.name}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Alamat</p>
                  <p className="mt-1 leading-6">{siteInfo.address}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">WhatsApp</p>
                  <a
                    href={siteLinks.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-emerald-700 hover:text-emerald-800"
                  >
                    {siteInfo.whatsapp}
                  </a>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Telepon</p>
                  <a
                    href={siteLinks.phoneHref}
                    className="mt-1 inline-block text-emerald-700 hover:text-emerald-800"
                  >
                    {siteInfo.phone}
                  </a>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <a
                    href={siteLinks.emailHref}
                    className="mt-1 inline-block text-emerald-700 hover:text-emerald-800"
                  >
                    {siteInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Lokasi Kantor
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Temukan kami di peta
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Gunakan peta di bawah ini untuk melihat lokasi kantor, lalu buka
                petunjuk arah jika ingin datang langsung.
              </p>
            </div>

            <iframe
              src={siteLinks.mapEmbedUrl}
              title="Peta lokasi kantor"
              className="h-[360px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="flex flex-wrap gap-3 p-6">
              <a
                href={siteLinks.mapDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Petunjuk Arah
              </a>
              <a
                href={siteLinks.mapDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Kontak per Unit
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Pilih jalur komunikasi yang paling sesuai
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Semua tombol di bawah tetap mengarah ke kanal resmi yang sama,
              tetapi dengan pesan awal yang sudah disesuaikan agar lebih mudah
              diproses oleh admin.
            </p>

            <div className="mt-6 space-y-4">
              {contactUnits.map((unit) => (
                <div
                  key={unit.title}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300"
                >
                  <h3 className="text-base font-bold text-slate-900">{unit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {unit.description}
                  </p>

                  <a
                    href={buildWhatsAppLink(siteInfo.whatsappRaw, unit.prompt)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Hubungi Unit
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Form Pesan
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Kirim pesan ke kantor
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Form ini tetap ringan, tetapi sudah lebih jelas dan nyaman dipakai,
              terutama di perangkat mobile.
            </p>

            <form className="mt-6" onSubmit={handleSubmit} noValidate>
              <fieldset disabled={isSubmitting} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nama"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="nama"
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.nama
                          ? "border-rose-300 focus:border-rose-500"
                          : "border-slate-300 focus:border-emerald-600"
                      }`}
                    />
                    <FieldError message={errors.nama} />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.email
                          ? "border-rose-300 focus:border-rose-500"
                          : "border-slate-300 focus:border-emerald-600"
                      }`}
                    />
                    <FieldError message={errors.email} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nomor"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Nomor WhatsApp / Telepon
                    </label>
                    <input
                      id="nomor"
                      type="text"
                      name="nomor"
                      value={form.nomor}
                      onChange={handleChange}
                      placeholder="Opsional"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tujuan"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Tujuan Pesan
                    </label>
                    <select
                      id="tujuan"
                      name="tujuan"
                      value={form.tujuan}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.tujuan
                          ? "border-rose-300 focus:border-rose-500"
                          : "border-slate-300 focus:border-emerald-600"
                      }`}
                    >
                      {contactUnits.map((unit) => (
                        <option key={unit.title} value={unit.title}>
                          {unit.title}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.tujuan} />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="pesan"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    rows={6}
                    value={form.pesan}
                    onChange={handleChange}
                    placeholder="Tulis keperluan atau pesan Anda"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      errors.pesan
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-slate-300 focus:border-emerald-600"
                    }`}
                  />
                  <FieldError message={errors.pesan} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  </button>

                  <a
                    href={siteLinks.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Atau via WhatsApp
                  </a>
                </div>

                {status && <div className={statusClassName}>{status.message}</div>}
              </fieldset>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              FAQ Singkat
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Pertanyaan yang sering muncul
            </h2>

            <div className="mt-6 space-y-3">
              {contactFaq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <span>{item.question}</span>
                      <span className="text-slate-400 transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}