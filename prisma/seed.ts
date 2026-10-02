import bcrypt from "bcryptjs";
import { PrismaClient, StatusKonten, StatusLamaran, TipeKonten, TipeLowongan } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed the database.");
  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
  });
  return new PrismaClient({ adapter });
}

const faqSeed = [
  ["Career Industries", "Di mana saya bisa melihat lowongan kerja/PKL?", "Anda dapat mengunjungi portal Career Industries di menu utama website ini untuk melamar posisi secara langsung."],
  ["PPDB", "Bagaimana cara mendaftar PPDB?", "Pendaftaran dilakukan secara terpusat melalui portal resmi Telkom Schools di ppdb.telkomschools.sch.id."],
  ["Tentang Moklet", "Apa saja program keahlian di SMK Telkom Malang?", "SMK Telkom Malang memiliki program Rekayasa Perangkat Lunak, Teknik Komputer dan Jaringan, serta Pengembangan Gim."],
  ["Career Industries", "Apakah alumni dapat melamar lowongan?", "Ya. Pilih lowongan yang sesuai di Career Industries, kemudian kirim data diri, kelas atau status alumni, dan link portofolio atau CV."],
  ["PPDB", "Apakah informasi PPDB tersedia di Moklet Hub?", "Informasi dan pendaftaran resmi PPDB tersedia melalui portal Telkom Schools. Gunakan tombol Daftar PPDB 2026 untuk mengaksesnya."],
  ["Hubungi Kami", "Bagaimana cara menghubungi sekolah?", "Kirim pesan melalui halaman Hubungi Kami atau WhatsApp admin sekolah di 6281223488999."],
];

const companySeed = [
  { nama: "PT Beon Intermedia", overview: "Mitra teknologi yang mengembangkan solusi cloud, hosting, dan produk digital untuk bisnis Indonesia.", website: "https://beon.co.id", tags: ["Fullstack Developer", "Cloud Computing"] },
  { nama: "Astra Honda Motor", overview: "Perusahaan otomotif dengan kebutuhan talenta digital untuk pengembangan sistem dan operasional modern.", website: "https://www.astra-honda.com", tags: ["Software Engineering", "Data"] },
  { nama: "Jagoan Hosting", overview: "Penyedia hosting dan infrastruktur cloud yang membantu bisnis bertumbuh secara digital.", website: "https://www.jagoanhosting.com", tags: ["DevOps", "Network"] },
  { nama: "PT Telkom Indonesia", overview: "Perusahaan telekomunikasi dan digital yang membuka ruang kolaborasi bagi talenta muda.", website: "https://www.telkom.co.id", tags: ["Cyber Security", "Network"] },
];

const jobSeed = [
  { slug: "junior-fullstack-developer-beon", judulPosisi: "Junior Fullstack Developer", perusahaan: "PT Beon Intermedia", lokasi: "Malang / Hybrid", tipe: TipeLowongan.FULL_TIME, deskripsi: "Membangun dan merawat fitur produk digital menggunakan JavaScript, TypeScript, dan API modern.", syaratKeahlian: "JavaScript, TypeScript, React, Git" },
  { slug: "cloud-intern-jagoan-hosting", judulPosisi: "Cloud Infrastructure Intern", perusahaan: "Jagoan Hosting", lokasi: "Malang", tipe: TipeLowongan.MAGANG, deskripsi: "Belajar mengelola layanan cloud, deployment, monitoring, dan troubleshooting infrastruktur.", syaratKeahlian: "Linux, Networking dasar, rasa ingin tahu" },
  { slug: "network-pkl-telkom", judulPosisi: "Network Support PKL", perusahaan: "PT Telkom Indonesia", lokasi: "Malang", tipe: TipeLowongan.PKL, deskripsi: "Mendukung dokumentasi dan pemantauan jaringan dalam lingkungan kerja profesional.", syaratKeahlian: "TCP/IP, troubleshooting, komunikasi" },
  { slug: "software-engineer-astra", judulPosisi: "Software Engineer Trainee", perusahaan: "Astra Honda Motor", lokasi: "Jakarta / Hybrid", tipe: TipeLowongan.FULL_TIME, deskripsi: "Berkolaborasi dengan tim produk untuk mengembangkan aplikasi internal dan layanan digital.", syaratKeahlian: "OOP, REST API, SQL, teamwork" },
];

async function main() {
  const prisma = createPrismaClient();
  const password = process.env.ADMIN_PASSWORD ?? "MokletLocal2026!";
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.upsert({
      where: { email: "admin@smktelkom-mlg.sch.id" },
      update: { nama: "Super Admin Moklet", role: "SUPER_ADMIN", passwordHash },
      create: { nama: "Super Admin Moklet", email: "admin@smktelkom-mlg.sch.id", role: "SUPER_ADMIN", passwordHash },
    });

    for (const [kategori, pertanyaan, jawaban] of faqSeed) {
      const existing = await prisma.faq.findFirst({ where: { pertanyaan } });
      if (existing) await prisma.faq.update({ where: { id: existing.id }, data: { kategori, jawaban } });
      else await prisma.faq.create({ data: { kategori, pertanyaan, jawaban } });
    }

    const tags = new Map<string, number>();
    for (const company of companySeed) {
      const companyRecord = await prisma.perusahaan.upsert({
        where: { nama: company.nama },
        update: { overview: company.overview, website: company.website, adminId: admin.id },
        create: { nama: company.nama, overview: company.overview, website: company.website, adminId: admin.id },
      });
      for (const tagName of company.tags) {
        const tag = await prisma.tagJurusan.upsert({ where: { nama: tagName }, update: {}, create: { nama: tagName } });
        tags.set(tagName, tag.id);
        await prisma.perusahaanTag.upsert({ where: { perusahaanId_tagId: { perusahaanId: companyRecord.id, tagId: tag.id } }, update: {}, create: { perusahaanId: companyRecord.id, tagId: tag.id } });
      }
    }

    for (const job of jobSeed) {
      const company = await prisma.perusahaan.findUniqueOrThrow({ where: { nama: job.perusahaan } });
      await prisma.lowongan.upsert({
        where: { slug: job.slug },
        update: { ...job, perusahaan: undefined, perusahaanId: company.id, adminId: admin.id, status: "PUBLISHED" },
        create: { slug: job.slug, judulPosisi: job.judulPosisi, lokasi: job.lokasi, tipe: job.tipe, deskripsi: job.deskripsi, syaratKeahlian: job.syaratKeahlian, perusahaanId: company.id, adminId: admin.id, status: "PUBLISHED" },
      });
    }

    const berita = await prisma.konten.findFirst({ where: { tipe: TipeKonten.BERITA } });
    if (!berita) await prisma.konten.create({ data: { tipe: TipeKonten.BERITA, slug: "moklet-hub-digital-career", judul: "Moklet Hub membuka akses talenta digital ke industri", deskripsi: "Portal digital SMK Telkom Malang untuk berita, prestasi, dan peluang karier siswa serta alumni.", gambarUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80", status: StatusKonten.PUBLISHED, adminId: admin.id } });

    const sampleJob = await prisma.lowongan.findUniqueOrThrow({ where: { slug: "junior-fullstack-developer-beon" } });
    const sampleApplication = await prisma.lamaran.findFirst({ where: { email: "siswa.demo@moklet.sch.id", lowonganId: sampleJob.id } });
    if (!sampleApplication) await prisma.lamaran.create({ data: { namaLengkap: "Dimas Pratama", kelasAlumni: "XII RPL 1", email: "siswa.demo@moklet.sch.id", portfolioUrl: "https://github.com/dimas-demo", pesanTambahan: "Tertarik belajar membangun produk digital bersama tim.", status: StatusLamaran.BARU, lowonganId: sampleJob.id } });

    console.log(`Seed selesai. Admin: ${admin.email}. Password seed: ${process.env.ADMIN_PASSWORD ? "dari ADMIN_PASSWORD" : "MokletLocal2026!"}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });