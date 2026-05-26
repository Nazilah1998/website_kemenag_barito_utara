import "dotenv/config";
import pg from "pg";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/db/schema";
import { dataSeksi } from "../src/data/seksi.js";
import { serviceCategories } from "../src/data/services.js";
import { getApaKataMereka } from "../src/data/apaKataMereka.js";
import { laporanCategories } from "../src/data/laporan.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const FORCE = process.argv.includes("--force");

async function isEmptyTable(table) {
  const [row] = await db.select({ count: sql`count(*)` }).from(table);
  return Number(row?.count || 0) === 0;
}

async function main() {
  console.log("Memulai seeding data...");

  if (!FORCE) {
    const hasTestimonials = !(await isEmptyTable(schema.testimonials));
    const hasLayanan = !(await isEmptyTable(schema.layanan_publik));
    const hasSeksi = !(await isEmptyTable(schema.seksi));

    if (hasTestimonials && hasLayanan && hasSeksi) {
      console.log("Database sudah memiliki data. Lewati seeding.");
      console.log("Gunakan --force untuk memaksa mengulang seeding.");
      return;
    }
  }

  // 1. Testimonials
  if (FORCE || (await isEmptyTable(schema.testimonials))) {
    console.log("Seeding Testimonials...");
    const locales = ["id", "en"];
    for (const lang of locales) {
      const list = getApaKataMereka(lang);
      for (const [index, item] of list.entries()) {
        await db.insert(schema.testimonials).values({
          locale: lang,
          name: item.name,
          role: item.position || "",
          content: Array.isArray(item.quote) ? item.quote.join("\n") : (item.quote || ""),
          rating: 5,
          avatar: item.image || "",
          sort_order: index,
          is_active: true,
        });
      }
    }
  } else {
    console.log("Testimonials sudah ada, lewati.");
  }

  // 2. Layanan Publik
  if (FORCE || (await isEmptyTable(schema.layanan_publik))) {
    if (serviceCategories?.length > 0) {
      console.log("Seeding Layanan Publik...");
      if (FORCE) await db.delete(schema.layanan_publik);
      for (const [index, srv] of serviceCategories.entries()) {
        await db.insert(schema.layanan_publik).values({
          title: srv.title,
          description: srv.description,
          items: srv.items || [],
          sort_order: index,
          is_active: true,
        });
      }
    }
  } else {
    console.log("Layanan Publik sudah ada, lewati.");
  }

  // 3. Report Categories (Laporan)
  if (FORCE || (await isEmptyTable(schema.report_categories))) {
    if (laporanCategories?.length > 0) {
      console.log("Seeding Report Categories...");
      if (FORCE) await db.delete(schema.report_categories);
      for (const [index, cat] of laporanCategories.entries()) {
        await db.insert(schema.report_categories).values({
          slug: cat.slug,
          title: cat.title,
          description: cat.description,
          intro: cat.intro || "",
          sort_order: index,
          is_active: true,
        });
      }
    }
  } else {
    console.log("Report Categories sudah ada, lewati.");
  }

  // 4. Homepage Slides
  if (FORCE || (await isEmptyTable(schema.homepage_slides))) {
    console.log("Seeding Homepage Slides...");
    if (FORCE) await db.delete(schema.homepage_slides);
    const slides = [
      {
        title: "Selamat Datang di Kemenag Barito Utara",
        caption: "Melayani dengan Ikhlas, Profesional, dan Berintegritas",
        image_url: "/assets/images/hero-bg.jpg",
        is_published: true,
        sort_order: 0,
        category: "utama",
      },
      {
        title: "Zona Integritas Menuju WBK/WBBM",
        caption: "Komitmen kami dalam mewujudkan birokrasi bersih dan melayani",
        image_url: "/assets/images/hero-bg.jpg",
        is_published: true,
        sort_order: 1,
        category: "utama",
      },
    ];
    for (const slide of slides) {
      await db.insert(schema.homepage_slides).values(slide);
    }
  } else {
    console.log("Homepage Slides sudah ada, lewati.");
  }

  // 5. Seksi, Pegawai, Layanan PTSP, Link Aplikasi
  if (FORCE || (await isEmptyTable(schema.seksi))) {
    if (dataSeksi?.length > 0) {
      console.log("Seeding Seksi, Pegawai, dan PTSP...");
      if (FORCE) {
        await db.delete(schema.link_aplikasi_seksi);
        await db.delete(schema.layanan_ptsp);
        await db.delete(schema.pegawai_seksi);
        await db.delete(schema.seksi);
      }

      for (const seksi of dataSeksi) {
        const createdSeksi = await db
          .insert(schema.seksi)
          .values({
            slug: seksi.slug,
            judul: seksi.judul,
            nama_kepala: seksi.nama_kepala || "",
            nip_kepala: seksi.nip_kepala,
            foto_kepala: seksi.foto_kepala,
            deskripsi: seksi.deskripsi || "",
          })
          .returning({ id: schema.seksi.id });

        const seksiId = createdSeksi[0].id;

        if (seksi.pegawai?.length > 0) {
          for (const [pIndex, peg] of seksi.pegawai.entries()) {
            await db.insert(schema.pegawai_seksi).values({
              seksi_id: seksiId,
              nama: peg.nama,
              nip: peg.nip,
              jabatan: peg.jabatan,
              foto: peg.foto,
              sort_order: pIndex,
            });
          }
        }

        if (seksi.layanan_ptsp?.length > 0) {
          for (const [lIndex, lay] of seksi.layanan_ptsp.entries()) {
            await db.insert(schema.layanan_ptsp).values({
              seksi_id: seksiId,
              nama: lay.nama,
              estimasi: lay.estimasi,
              sort_order: lIndex,
            });
          }
        }

        if (seksi.link_aplikasi?.length > 0) {
          for (const [lkIndex, link] of seksi.link_aplikasi.entries()) {
            await db.insert(schema.link_aplikasi_seksi).values({
              seksi_id: seksiId,
              nama: link.nama,
              url: link.url,
              icon: link.icon,
              sort_order: lkIndex,
            });
          }
        }
      }
    } else {
      console.log("Data seksi tidak ditemukan, lewati.");
    }
  } else {
    console.log("Seksi sudah ada, lewati.");
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
