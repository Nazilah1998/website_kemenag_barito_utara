"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import KontakForm from "@/components/features/kontak/KontakForm";
import { siteInfo, siteLinks } from "../../data/site";
import { useLanguage } from "@/context/LanguageContext";

function getOfficeScheduleByDay(weekday) {
  if (["Mon", "Tue", "Wed", "Thu"].includes(weekday)) {
    return {
      openMinutes: 7 * 60 + 30,
      closeMinutes: 16 * 60,
      nextOpenText: "07.30",
      closeText: "16.00",
    };
  }

  if (weekday === "Fri") {
    return {
      openMinutes: 7 * 60 + 30,
      closeMinutes: 16 * 60 + 30,
      nextOpenText: "07.30",
      closeText: "16.30",
    };
  }

  return null;
}

function getNextOpeningDetail(weekday, t) {
  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentIndex = dayOrder.indexOf(weekday);

  for (let i = 1; i <= 7; i += 1) {
    const nextDay = dayOrder[(currentIndex + i) % 7];
    const nextSchedule = getOfficeScheduleByDay(nextDay);

    if (nextSchedule) {
      return t("contact.openingDetail")
        .replace("{day}", t(`contact.weekdays.${nextDay}`))
        .replace("{time}", `${nextSchedule.nextOpenText} WIB`);
    }
  }

  return t("contact.updateSchedule");
}

function getOfficeStatus(t) {
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
    detail = t("contact.runningUntil").replace("{time}", `${schedule.closeText} WIB`);
  } else if (schedule && currentMinutes < schedule.openMinutes) {
    detail = t("contact.openingToday").replace("{time}", `${schedule.nextOpenText} WIB`);
  } else {
    detail = getNextOpeningDetail(weekday, t);
  }

  const timeString = `${String(hour).padStart(2, "0")}.${String(minute).padStart(2, "0")} WIB`;

  return {
    label: isOpen ? t("contact.open") : t("contact.closed"),
    detail,
    nowText: `${t(`contact.weekdays.${weekday}`)}, ${timeString}`,
    isOpen,
  };
}

function OfficeHoursBlock({
  className = "text-sm leading-6 text-slate-700 dark:text-slate-300",
}) {
  const { t } = useLanguage();
  const officeHoursList = t("contact.officeHours") || [];

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
  const { t } = useLanguage();
  const [officeStatus, setOfficeStatus] = useState(() => getOfficeStatus(t));

  useEffect(() => {
    const updateStatus = () => setOfficeStatus(getOfficeStatus(t));

    updateStatus();
    const intervalId = setInterval(updateStatus, 60000);

    return () => clearInterval(intervalId);
  }, [t]);

  return (
    <>
      <PageBanner
        title={t("contact.title")}
        description={t("contact.description")}
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("contact.title") }
        ]}
        eyebrow={t("berita.publicService")}
      />

      <main className="bg-slate-50 transition-colors dark:bg-slate-950">
        <div className="w-full px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {t("contact.statusTitle")}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {officeStatus.label}
                  </h2>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    officeStatus.isOpen
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {officeStatus.isOpen ? t("contact.online") : t("contact.offline")}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {officeStatus.detail}
              </p>

              <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 transition-colors dark:bg-slate-800 dark:text-slate-300">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.currentTime")}
                  </p>
                  <p className="mt-1">{officeStatus.nowText}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.serviceHours")}
                  </p>
                  <div className="mt-2">
                    <OfficeHoursBlock />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {t("contact.mainContact")}
              </p>

              <div className="mt-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.agencyName")}
                  </p>
                  <p className="mt-1">{siteInfo.name}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.address")}
                  </p>
                  <p className="mt-1 leading-6">{siteInfo.address}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.whatsapp")}
                  </p>
                  <a
                    href={siteLinks.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {siteInfo.whatsapp}
                  </a>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.phone")}
                  </p>
                  <a
                    href={siteLinks.phoneHref}
                    className="mt-1 inline-block text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {siteInfo.phone}
                  </a>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t("contact.email")}
                  </p>
                  <a
                    href={siteLinks.emailHref}
                    className="mt-1 inline-block text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {siteInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 transition-colors dark:border-slate-800">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {t("contact.officeLocation")}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {t("contact.findUsOnMap")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {t("contact.mapDesc")}
                </p>
              </div>

              <iframe
                src={siteLinks.mapEmbedUrl}
                title={t("contact.findUsOnMap")}
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
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  {t("contact.getDirections")}
                </a>
                <a
                  href={siteLinks.mapDirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t("contact.openInMaps")}
                </a>
              </div>
            </div>

            <div>
              <KontakForm />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
