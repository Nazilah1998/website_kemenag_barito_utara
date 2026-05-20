import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { dataSeksi } from '../src/data/seksi.js';
import { serviceCategories } from '../src/data/services.js';
import { testimonialsData } from '../src/data/apaKataMereka.js';

async function main() {
  console.log('Memulai migrasi data...');

  // 1. Migrasi Testimonials
  if (testimonialsData && testimonialsData.length > 0) {
    console.log('Migrasi Testimonials...');
    await prisma.testimonials.deleteMany(); // Reset
    for (const [index, test] of testimonialsData.entries()) {
      await prisma.testimonials.create({
        data: {
          name: test.name,
          role: test.role,
          content: test.content,
          rating: test.rating || 5,
          avatar: test.avatar,
          sort_order: index,
          is_active: true,
        },
      });
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
  });
