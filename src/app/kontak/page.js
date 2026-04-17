"use client";

import { useEffect, useState } from "react";
import PageBanner from "../../components/PageBanner";
import KontakForm from "../../components/KontakForm";
import {
  buildWhatsAppLink,
  contactUnits,
  siteInfo,
  siteLinks,
} from "../../data/site";

const WEEKDAY_LABELS = {
  Mon: "Senin",
  Tue: "Selasa",
  Wed: "Rabu",
  Thu: "Kamis",
  Fri: "Jum'at",
  Sat: "Sabtu",
  Sun: "Minggu",
};

function getOfficeScheduleByDay(weekday) {
  if (["Mon", "Tue", "Wed", "Thu"].includes(weekday)) {
    return {
      openMinutes: 7 * 60 + 30,
      closeMinutes: 16 * 60,
      nextOpenText: "07.30 WIB",
      closeText: "16.00 WIB",
    };
  }

  if (weekday === "Fri") {
    return {
      openMinutes: 7 * 60 + 30,
      closeMinutes: 16 * 60 + 30,
      nextOpenText: "07.30 WIB",
      closeText: "16.30 WIB",
    };
  }

  return null;
}

function getNextOpeningDetail(weekday) {
  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentIndex = dayOrder.indexOf(weekday);

  for (let i = 1; i <= 7; i += 1) {
    const nextDay = dayOrder[(currentIndex + i) % 7];
    const nextSchedule = getOfficeScheduleByDay(nextDay);

    if (nextSchedule) {
      return `Layanan akan dibuka kembali ${WEEKDAY_LABELS[nextDay]} pukul ${nextSchedule.nextOpenText}.`;
    }
  }

  return "Jadwal layanan sedang diperbarui.";
}

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
  const minute = Number(
    parts.find((item) => item.type === "minute")?.value || 0,
  );

  const currentMinutes = hour * 60 + minute;
  const schedule = getOfficeScheduleByDay(weekday);

  const isOpen =
    !!schedule &&
    currentMinutes >= schedule.openMinutes &&
    currentMinutes < schedule.closeMinutes;

  let detail = "";

  if (isOpen && schedule) {
    detail = `Layanan tatap muka sedang berjalan hingga pukul ${schedule.closeText}.`;
  } else if (schedule && currentMinutes < schedule.openMinutes) {
    detail = `Layanan akan dibuka hari ini pukul ${schedule.nextOpenText}.`;
  } else {
    detail = getNextOpeningDetail(weekday);
  }

  return {
    label: isOpen ? "Sedang Buka" : "Sedang Tutup",
    detail,
    nowText: `${WEEKDAY_LABELS[weekday]}, ${String(hour).padStart(2, "0")}.${String(
      minute,
    ).padStart(2, "0")} WIB`,
    isOpen,
  };
}

function OfficeHoursBlock({ className = "text-sm leading-6 text-slate-700" }) {
  const officeHoursList = Array.isArray(siteInfo.officeHours)
    ? siteInfo.officeHours
    : [siteInfo.officeHours];

  return (
    <div className="space-y-1.5">
      {officeHoursList.map((item, index) => (
        <p key={`${item}-${index}`} className={className}>
          {item}
        </p>
      ))}
    </div>
  );
}

export default function KontakPage() {
  const [officeStatus, setOfficeStatus] = useState(getOfficeStatus());

  useEffect(() => {
    const updateStatus = () => setOfficeStatus(getOfficeStatus());

    updateStatus();
    const intervalId = setInterval(updateStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <PageBanner
        title="Kontak"
        description="Pilih kanal komunikasi yang paling sesuai, temukan lokasi kantor, dan hubungi instansi melalui jalur resmi yang tersedia."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]}
      />

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
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
                <p className="font-semibold text-slate-900">
                  Waktu kantor saat ini
                </p>
                <p className="mt-1">{officeStatus.nowText}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Jam layanan</p>
                <div className="mt-2">
                  <OfficeHoursBlock />
                </div>
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
              className="h-90 w-full"
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

          <div>
            <KontakForm />
          </div>
        </section>

        <section className="mt-10">
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
                  <h3 className="text-base font-bold text-slate-900">
                    {unit.title}
                  </h3>
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
      </main>
    </>
  );
}
