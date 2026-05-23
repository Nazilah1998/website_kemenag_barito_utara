// Chart sederhana berbasis SVG tanpa library eksternal.

function TrendBarChart({ trend = [] }) {
  if (!trend || trend.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Belum ada data publikasi pada periode ini.
      </p>
    );
  }

  const max = Math.max(...trend.map((t) => t.count), 1);
  const barWidth = 100 / trend.length;

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="h-40 w-full"
      >
        {trend.map((t, i) => {
          const h = (t.count / max) * 34;
          const x = i * barWidth + 0.5;
          const y = 38 - h;
          const w = barWidth - 1;
          return (
            <g key={t.date}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={0.8}
                fill="#059669"
                opacity={0.85}
              />
              {t.count > 0 ? (
                <text
                  x={x + w / 2}
                  y={y - 0.8}
                  textAnchor="middle"
                  fontSize={2.6}
                  fill="currentColor"
                  fontWeight={600}
                >
                  {t.count}
                </text>
              ) : null}
            </g>
          );
        })}
        <line
          x1={0}
          x2={100}
          y1={38}
          y2={38}
          stroke="#cbd5e1"
          strokeWidth={0.3}
        />
      </svg>

      <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-slate-500 dark:text-slate-400 md:grid-cols-14">
        {trend.map((t) => (
          <span key={t.date} className="truncate text-center">
            {t.date.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

function TopBeritaList({ items = [] }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data berita.</p>;
  }

  const max = Math.max(...items.map((i) => i.views), 1);
  const formatter = new Intl.NumberFormat("id-ID");

  return (
    <ol className="space-y-3">
      {items.map((item, i) => {
        const pct = Math.max(4, (item.views / max) * 100);
        return (
          <li key={item.id} className="text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="line-clamp-1 font-medium text-slate-800 dark:text-slate-100">
                {i + 1}. {item.title}
              </span>
              <span className="shrink-0 font-semibold text-emerald-700 dark:text-emerald-400">
                {formatter.format(item.views)}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function RecentActivity({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada aktivitas tercatat.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li
          key={it.id}
          className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <span
            className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {it.summary || `${it.action} ${it.entity}`}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {it.actor_email || "-"} · {formatDate(it.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardCharts({
  trend,
  topBerita,
  recentActivity,
  showRecentActivity = false,
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Tren Publikasi 14 Hari
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Harian</span>
        </div>
        <div className="mt-4">
          <TrendBarChart trend={trend} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Berita Terpopuler
        </h2>
        <div className="mt-4">
          <TopBeritaList items={topBerita} />
        </div>
      </div>

      {showRecentActivity && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Aktivitas Terbaru
          </h2>
          <div className="mt-4">
            <RecentActivity items={recentActivity} />
          </div>
        </div>
      )}
    </div>
  );
}
