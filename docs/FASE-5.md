# Fase 5 - SEO & Discoverability

Ringkasan perbaikan di fase 5: dorong website mudah ditemukan dan dimengerti mesin pencari.

## Sitemap dinamis

File: `src/app/sitemap.js`

- Menggabungkan 20+ route statis (beranda, profil, layanan, galeri, kontak, survey, ppid, laporan, zona-integritas)
- Menarik semua berita terpublikasi dari Supabase
- Menarik halaman CMS statis terpublikasi (`static_pages`)
- Menarik 7 kategori laporan
- Setiap entry punya `lastModified`, `changeFrequency`, `priority`
- Fail-safe: jika Supabase error, route statis tetap keluar

Akses: `/sitemap.xml`

## Robots.txt dinamis

File: `src/app/robots.js`

- Disallow: `/admin`, `/api/`, `/auth/`, `/login`, `/debug-error`, `/pencarian?`
- Sitemap reference ke `/sitemap.xml`
- Host declaration

Akses: `/robots.txt`

## JSON-LD structured data

File helper: `src/lib/structured-data.js`
Komponen: `src/components/seo/JsonLd.jsx`

### Global (di layout root)

- `GovernmentOrganization` - identitas lembaga, logo, alamat, parent organization (Kemenag RI)
- `WebSite` - nama, description, sitelinks search box (`/pencarian?q={search_term_string}`)

### Per halaman

- Detail berita (`/berita/[slug]`): `NewsArticle` + `BreadcrumbList`
- Halaman CMS (`/halaman/[slug]`): `BreadcrumbList`
- Detail laporan (`/laporan/[slug]`): `BreadcrumbList`
- Kontak (`/kontak`): `ContactPage` + `BreadcrumbList`

## Open Graph & Twitter Card

Tambahan `generateMetadata` server-side:

- `/berita/[slug]` - OG type `article` dengan `publishedTime`, `modifiedTime`, `section`, cover image, Twitter `summary_large_image`
- `/halaman/[slug]` - OG type `article`, canonical URL
- `/laporan/[slug]` - OG type `website`, canonical URL
- `/kontak` - OG via `src/app/kontak/layout.js` karena page.js adalah client component

## Testing

File: `tests/structured-data.test.js` - 7 test baru

Total test naik dari 29 ke 36.

## Verifikasi setelah deploy

1. Google Rich Results Test: `https://search.google.com/test/rich-results?url=...`
2. Schema Markup Validator: `https://validator.schema.org/`
3. Facebook Sharing Debugger: `https://developers.facebook.com/tools/debug/`
4. Twitter Card Validator: `https://cards-dev.twitter.com/validator`
5. Google Search Console - submit sitemap: `https://ptsp.kemenag-baritoutara.com/sitemap.xml`

## Checklist lanjutan

- [ ] Submit sitemap ke Google Search Console
- [ ] Submit ke Bing Webmaster Tools
- [ ] Verifikasi ownership domain di Search Console
- [ ] Set gambar Open Graph default yang lebih baik (1200x630 PNG) di `/public`
- [ ] Tambahkan `alternateLanguage` jika terjemahan EN sudah final
