import React from "react";
import { StatCard } from "./BeritaUI";
import {
  IconNewsStat,
  IconPublishedStat,
  IconDraftStat,
  IconViewsStat
} from "./BeritaIcons";

export function BeritaStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label="Total berita"
        value={stats.total}
        helper="Semua artikel pada panel admin"
        icon={<IconNewsStat />}
        tone="emerald"
      />
      <StatCard
        label="Tayang"
        value={stats.published}
        helper="Berita yang sudah dipublikasikan"
        icon={<IconPublishedStat />}
        tone="sky"
      />
      <StatCard
        label="Draft"
        value={stats.draft}
        helper="Berita yang belum tayang"
        icon={<IconDraftStat />}
        tone="amber"
      />
      <StatCard
        label="Total pembaca"
        value={stats.views}
        helper="Akumulasi view seluruh berita"
        icon={<IconViewsStat />}
        tone="violet"
      />
    </div>
  );
}
