-- ============================================================
-- Skema tambahan untuk Fase 2: kontak_pesan & admin_audit_log
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- 1) Tabel pesan kontak publik
create table if not exists public.kontak_pesan (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  email text not null,
  subjek text,
  pesan text not null,
  ip_address text,
  user_agent text,
  status text not null default 'baru',
  created_at timestamptz not null default now()
);

create index if not exists idx_kontak_pesan_created_at
  on public.kontak_pesan (created_at desc);

create index if not exists idx_kontak_pesan_status
  on public.kontak_pesan (status);

alter table public.kontak_pesan enable row level security;

-- RLS: hanya admin/super_admin yang boleh SELECT.
drop policy if exists "kontak_pesan_select_admin"
  on public.kontak_pesan;

create policy "kontak_pesan_select_admin"
  on public.kontak_pesan
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and lower(p.role) in ('admin', 'super_admin')
    )
  );

-- INSERT dilakukan lewat service role key dari API, jadi kebijakan INSERT publik tidak diperlukan.

-- 2) Tabel audit log admin
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  actor_role text,
  action text not null,
  entity text not null,
  entity_id text,
  summary text,
  before jsonb,
  after jsonb,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_created_at
  on public.admin_audit_log (created_at desc);

create index if not exists idx_audit_entity
  on public.admin_audit_log (entity);

create index if not exists idx_audit_actor
  on public.admin_audit_log (actor_id);

alter table public.admin_audit_log enable row level security;

drop policy if exists "audit_select_admin"
  on public.admin_audit_log;

create policy "audit_select_admin"
  on public.admin_audit_log
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and lower(p.role) in ('admin', 'super_admin')
    )
  );

-- 3) Kolom opsional untuk scheduled publishing (jika belum ada).
-- Kolom published_at sudah ada di berita/pengumuman.
-- Pastikan indeks agar cron cepat:
create index if not exists idx_berita_schedule
  on public.berita (is_published, published_at)
  where is_published = false and published_at is not null;

-- 4) Tabel halaman statis (CMS)
create table if not exists public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content text not null,
  is_published boolean not null default false,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_static_pages_published
  on public.static_pages (is_published, updated_at desc);

alter table public.static_pages enable row level security;

drop policy if exists "static_pages_select_public"
  on public.static_pages;

-- Publik boleh membaca halaman yang sudah dipublikasikan.
create policy "static_pages_select_public"
  on public.static_pages
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "static_pages_select_admin"
  on public.static_pages;

create policy "static_pages_select_admin"
  on public.static_pages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and lower(p.role) in ('admin', 'super_admin', 'editor')
    )
  );

-- 5) Tabel kategori/regulasi dokumen (future)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  file_url text,
  file_name text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_category
  on public.documents (category, created_at desc);

  create table if not exists public.report_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  intro text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_documents (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.report_categories(id) on delete cascade,
  title text not null,
  description text,
  year integer,
  file_name text not null,
  file_path text not null,
  file_url text,
  mime_type text,
  file_size bigint not null default 0,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.report_documents
  add constraint report_documents_year_check
  check (year is null or (year >= 2000 and year <= 2100));

create index if not exists idx_report_documents_published
  on public.report_documents(category_id, is_published, year desc);

create index if not exists idx_report_categories_active
  on public.report_categories(is_active, sort_order asc);

create index if not exists idx_report_categories_sort_order
  on public.report_categories(sort_order asc);

create index if not exists idx_report_documents_category_id
  on public.report_documents(category_id);

create index if not exists idx_report_documents_sort_order
  on public.report_documents(sort_order asc);

insert into public.report_categories (slug, title, description, intro, sort_order)
values
  (
    'sop-dan-standar-pelayanan',
    'SOP dan Standar Pelayanan',
    'Standar Operasional Prosedur dan Standar Pelayanan untuk setiap layanan publik Kemenag Barito Utara.',
    'Dokumen ini menjelaskan alur, persyaratan, waktu, biaya, dan prosedur layanan agar dapat diakses semua pihak secara transparan.',
    1
  ),
  (
    'renstra',
    'Rencana Strategis (Renstra)',
    'Rencana strategis lima tahunan yang memuat visi, misi, tujuan, sasaran, strategi, dan kebijakan.',
    'Renstra menjadi pedoman arah pembangunan dan prioritas kerja Kementerian Agama Kabupaten Barito Utara.',
    2
  ),
  (
    'perjanjian-kinerja',
    'Perjanjian Kinerja',
    'Perjanjian Kinerja (PK) tahunan antara pimpinan satuan kerja dengan atasan langsung.',
    'PK memuat kesepakatan terkait target kinerja dan indikator yang akan dicapai dalam satu tahun anggaran.',
    3
  ),
  (
    'rencana-kinerja',
    'Rencana Kinerja',
    'Rencana Kinerja tahunan sebagai penjabaran program dan kegiatan dalam Renstra.',
    'Dokumen rencana kinerja menjadi acuan pelaksanaan program tahunan unit kerja.',
    4
  ),
  (
    'capaian-kinerja',
    'Capaian Kinerja',
    'Laporan capaian kinerja berdasarkan indikator yang telah ditetapkan dalam Perjanjian Kinerja.',
    'Capaian kinerja menjadi bahan evaluasi dan perbaikan berkelanjutan pada tahun berikutnya.',
    5
  ),
  (
    'laporan-kinerja',
    'Laporan Kinerja (LKj)',
    'Laporan Kinerja tahunan yang memuat pertanggungjawaban kinerja instansi pemerintah.',
    'LKj disusun sesuai PermenPAN-RB Nomor 53 Tahun 2014 sebagai bentuk akuntabilitas kinerja.',
    6
  ),
  (
    'rencana-kerja-tahunan',
    'Rencana Kerja Tahunan (RKT)',
    'Rencana Kerja Tahunan yang memuat program, kegiatan, dan anggaran tahun berjalan.',
    'RKT menjadi penjabaran tahunan dari Renstra dan menjadi dasar penyusunan RKA-KL.',
    7
  )
on conflict (slug) do nothing;

-- 6) Tabel slider beranda
create table if not exists public.homepage_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  image_url text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_homepage_slides_order
  on public.homepage_slides (is_published, sort_order asc, updated_at desc);
