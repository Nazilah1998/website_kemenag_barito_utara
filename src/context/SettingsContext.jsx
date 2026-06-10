"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteInfo as defaultSiteInfo, siteLinks as defaultSiteLinks } from "@/data/site";

const SettingsContext = createContext({
  siteInfo: defaultSiteInfo,
  siteLinks: defaultSiteLinks,
});

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState({
    siteInfo: defaultSiteInfo,
    siteLinks: defaultSiteLinks,
  });

  useEffect(() => {
    if (initialSettings) {
      // Merge DB settings into the static siteInfo
      const mergedInfo = { ...defaultSiteInfo };
      if (initialSettings.nama_kantor) {
        mergedInfo.name = initialSettings.nama_kantor;
        // Optionally update shortName if you want
      }
      if (initialSettings.alamat) mergedInfo.address = initialSettings.alamat;
      if (initialSettings.email) mergedInfo.email = initialSettings.email;
      if (initialSettings.telepon) {
        mergedInfo.phone = initialSettings.telepon;
        mergedInfo.phoneRaw = initialSettings.telepon.replace(/\D/g, "");
      }
      if (initialSettings.whatsapp) {
        mergedInfo.whatsapp = initialSettings.whatsapp;
        mergedInfo.whatsappRaw = initialSettings.whatsapp.replace(/\D/g, "");
      }
      
      const officeHours = [];
      if (initialSettings.jam_layanan_senin) officeHours.push(`Senin: ${initialSettings.jam_layanan_senin}`);
      if (initialSettings.jam_layanan_selasa) officeHours.push(`Selasa: ${initialSettings.jam_layanan_selasa}`);
      if (initialSettings.jam_layanan_rabu) officeHours.push(`Rabu: ${initialSettings.jam_layanan_rabu}`);
      if (initialSettings.jam_layanan_kamis) officeHours.push(`Kamis: ${initialSettings.jam_layanan_kamis}`);
      if (initialSettings.jam_layanan_jumat) officeHours.push(`Jum'at: ${initialSettings.jam_layanan_jumat}`);
      if (officeHours.length > 0) {
        mergedInfo.officeHours = officeHours;
      } else if (initialSettings.jam_layanan) {
        mergedInfo.officeHours = [initialSettings.jam_layanan];
      }

      // Merge Links
      const mergedLinks = { ...defaultSiteLinks };
      mergedLinks.emailHref = `mailto:${mergedInfo.email}`;
      mergedLinks.phoneHref = `tel:${mergedInfo.phoneRaw}`;
      mergedLinks.whatsappHref = `https://wa.me/${mergedInfo.whatsappRaw}?text=${encodeURIComponent("Assalamu’alaikum, saya ingin menanyakan informasi layanan di Kemenag Barito Utara.")}`;
      
      if (initialSettings.instagram) mergedLinks.instagram = initialSettings.instagram;
      if (initialSettings.facebook) mergedLinks.facebook = initialSettings.facebook;
      if (initialSettings.youtube) mergedLinks.youtube = initialSettings.youtube;

      setSettings({
        siteInfo: mergedInfo,
        siteLinks: mergedLinks,
      });
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
