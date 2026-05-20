require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Data statis dari src/data
const { dataSeksi } = require('../src/data/seksi.js');
const { serviceCategories, serviceOverview } = require('../src/data/services.js');
const { getApaKataMereka } = require('../src/data/apaKataMereka.js');

async function main() {
  console.log('Memulai migrasi data...');

  // 1. Migrasi Testimonials
  console.log('Migrasi Testimonials...');
  await prisma.testimonials.deleteMany(); // Reset
  const locales = ['id', 'en'];
  for (const lang of locales) {
    const list = getApaKataMereka(lang);
    if (list && list.length > 0) {
      for (const [index, item] of list.entries()) {
        await prisma.testimonials.create({
          data: {
            locale: lang,
            name: item.name,
            role: item.position || '',
            content: Array.isArray(item.quote) ? item.quote.join('\n') : (item.quote || ''),
            rating: 5,
            avatar: item.image || '',
            sort_order: index,
            is_active: true,
          },
        });
      }
    }
  }

  // 2. Migrasi Services (Layanan Publik)
  if (serviceCategories && serviceCategories.length > 0) {
    console.log('Migrasi Layanan Publik (Services)...');
    await prisma.layanan_publik.deleteMany(); // Reset
    for (const [index, srv] of serviceCategories.entries()) {
      await prisma.layanan_publik.create({
        data: {
          title: srv.title,
          description: srv.description,
          items: srv.items || [],
          sort_order: index,
          is_active: true,
        },
      });
    }
  }

  // 3. Migrasi Seksi, Pegawai, Layanan PTSP, Link Aplikasi
  if (dataSeksi && dataSeksi.length > 0) {
    console.log('Migrasi Seksi, Pegawai, dan PTSP...');
    await prisma.seksi.deleteMany(); // Cascade will delete related tables
    for (const seksi of dataSeksi) {
      const createdSeksi = await prisma.seksi.create({
        data: {
          slug: seksi.slug,
          judul: seksi.judul,
          nama_kepala: seksi.nama_kepala || '',
          nip_kepala: seksi.nip_kepala,
          foto_kepala: seksi.foto_kepala,
          deskripsi: seksi.deskripsi || '',
        },
      });

      // Insert Pegawai
      if (seksi.pegawai && seksi.pegawai.length > 0) {
        for (const [pIndex, peg] of seksi.pegawai.entries()) {
          await prisma.pegawai_seksi.create({
            data: {
              seksi_id: createdSeksi.id,
              nama: peg.nama,
              nip: peg.nip,
              jabatan: peg.jabatan,
              foto: peg.foto,
              sort_order: pIndex,
            },
          });
        }
      }

      // Insert Layanan PTSP
      if (seksi.layanan_ptsp && seksi.layanan_ptsp.length > 0) {
        for (const [lIndex, lay] of seksi.layanan_ptsp.entries()) {
          await prisma.layanan_ptsp.create({
            data: {
              seksi_id: createdSeksi.id,
              nama: lay.nama,
              estimasi: lay.estimasi,
              sort_order: lIndex,
            },
          });
        }
      }

      // Insert Link Aplikasi
      if (seksi.link_aplikasi && seksi.link_aplikasi.length > 0) {
        for (const [lkIndex, link] of seksi.link_aplikasi.entries()) {
          await prisma.link_aplikasi_seksi.create({
            data: {
              seksi_id: createdSeksi.id,
              nama: link.nama,
              url: link.url,
              icon: link.icon,
              sort_order: lkIndex,
            },
          });
        }
      }
    }
  }

  console.log('Migrasi data selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
