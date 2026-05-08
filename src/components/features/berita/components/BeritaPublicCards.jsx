import React from "react";
import Image from "next/image";
import Link from "next/link";

export function BeritaFeaturedCard({ item }) {
  if (!item) return null;
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[260px] bg-slate-200 dark:bg-slate-800">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="p-6 md:p-8">
          <BeritaMeta date={item.date} category={item.category} />
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            {item.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            {item.excerpt}
          </p>
          <Link
            href={`/berita/${item.slug}`}
            className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Baca selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BeritaCard({ item }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40">
      <div className="relative h-52 bg-slate-200 dark:bg-slate-800">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <BeritaMeta date={item.date} category={item.category} />
        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {item.excerpt}
        </p>
        <Link
          href={`/berita/${item.slug}`}
          className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}

function BeritaMeta({ date, category }) {
  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {date} ·{" "}
      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
        {category}
      </span>
    </p>
  );
}
