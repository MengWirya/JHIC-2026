import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Gamepad2, Network, Sparkles, Briefcase } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma"; // Pastikan import prisma ini ada

const benefits = [
  { icon: Sparkles, title: "Belajar relevan", text: "Kurikulum dan pengalaman proyek yang dekat dengan kebutuhan industri digital." },
  { icon: Code2, title: "Talenta siap karya", text: "Siswa membangun portofolio nyata sejak di bangku sekolah." },
  { icon: Network, title: "Terhubung industri", text: "Kolaborasi sekolah, alumni, dan mitra untuk membuka lebih banyak peluang." },
  { icon: Gamepad2, title: "Berani berinovasi", text: "Lingkungan belajar yang mendorong rasa ingin tahu, kreativitas, dan karakter." },
];

const programs = [
  { title: "Rekayasa Perangkat Lunak", short: "RPL", text: "Membangun aplikasi web, mobile, dan produk digital dengan standar industri.", image: "/images/site/code.png" },
  { title: "Teknik Komputer dan Jaringan", short: "TKJ", text: "Merancang jaringan, cloud computing, keamanan siber, dan infrastruktur digital.", image: "/images/site/network.png" },
  { title: "Pengembangan Gim", short: "GIM", text: "Mengembangkan gim dari ide, desain, pemrograman, hingga siap dimainkan.", image: "/images/site/gim.png" },
];

// Ubah menjadi async function untuk fetch data Prisma
export default async function Home() {
  // Ambil data dari database semalaman
  const [prestasiList, bludList, companies] = await Promise.all([
    prisma.konten.findMany({
      where: { tipe: "PRESTASI", status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.konten.findMany({
      where: { tipe: "BLUD", status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.perusahaan.findMany({
      take: 6,
    }),
  ]).catch(() => [[], [], []]);

  return (
    <div className="native-page">
      <SiteHeader />
      <main>
        <section className="native-hero">
          <div className="native-shell native-hero__grid">
            <div className="native-hero__copy">
              <p className="native-eyebrow">SMK Telkom Malang sejak 1992</p>
              <h1>School of <em>Global Digitalent</em></h1>
              <p className="native-hero__lead">Tempat tumbuhnya talenta teknologi yang siap berkarya, berkolaborasi, dan membawa dampak untuk dunia.</p>
              <div className="native-actions">
                <a className="native-button native-button--light" href="https://ppdb.telkomschools.sch.id/" target="_blank" rel="noreferrer">Daftar PPDB 2026 <ArrowRight size={17} /></a>
                <Link className="native-text-link" href="/tentang-kami">Kenali Moklet <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="native-hero__visual">
              <div className="native-hero__halo" />
              <Image src="/images/site/image_depan_new.png" alt="Siswa SMK Telkom Malang" fill priority sizes="(max-width: 900px) 90vw, 52vw" />
            </div>
          </div>
        </section>

        <section className="native-section native-section--intro">
          <div className="native-shell native-intro">
            <div><p className="native-eyebrow native-eyebrow--dark">Kenapa harus Moklet?</p><h2>Teknologi adalah bahasa kami. <span>Karakter adalah arah kami.</span></h2></div>
            <p>SMK Telkom Malang memadukan kompetensi teknologi, budaya belajar, dan pengalaman industri agar setiap siswa punya bekal untuk melangkah lebih jauh.</p>
          </div>
          <div className="native-shell native-benefits">
            {benefits.map(({ icon: Icon, title, text }) => <article className="native-benefit" key={title}><Icon size={24} strokeWidth={1.7} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="native-section native-section--programs">
          <div className="native-shell">
            <div className="native-section-heading">
              <div><p className="native-eyebrow native-eyebrow--dark">Program keahlian</p><h2>Mulai dari rasa ingin tahu.</h2></div>
              <Link className="native-text-link native-text-link--dark" href="/program">Lihat semua program <ArrowRight size={16} /></Link>
            </div>
            <div className="native-program-grid">
              {programs.map((program) => <article className="native-program" key={program.short}><div className="native-program__image"><Image src={program.image} alt={program.title} fill sizes="(max-width: 700px) 90vw, 30vw" /></div><div className="native-program__body"><span>{program.short}</span><h3>{program.title}</h3><p>{program.text}</p><Link href="/program" aria-label={`Pelajari ${program.title}`}><ArrowUpRight size={20} /></Link></div></article>)}
            </div>
          </div>
        </section>

        {/* MOKLET HARI INI (Diisi Data Prestasi Prisma) */}
        <section className="native-news py-16">
          <div className="native-shell">
            <div className="native-news__inner flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
              <div>
                <p className="native-eyebrow text-red-600 mb-2 text-sm font-bold tracking-wider uppercase">Moklet hari ini</p>
                <h2 className="text-3xl font-bold tracking-tight">Yang sedang kami kerjakan.</h2>
              </div>
              <Link className="native-button native-button--outline inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 transition" href="/prestasi">
                Baca berita terbaru <ArrowRight size={17} />
              </Link>
            </div>
            
            {prestasiList.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada pembaruan terkini.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prestasiList.map((item) => (
                  <article key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition duration-300">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3 block">Prestasi</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{item.judul}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{item.deskripsi}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                      <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PRODUK BLUD SECTION (Tambahan dari Prisma) */}
        <section className="native-section bg-gray-50 py-16">
          <div className="native-shell">
            <div className="native-section-heading mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <p className="native-eyebrow native-eyebrow--dark mb-2 text-sm font-bold tracking-wider uppercase">Karya Inovasi</p>
                <h2 className="text-3xl font-bold tracking-tight">Produk Unggulan BLUD.</h2>
              </div>
              <Link className="native-text-link native-text-link--dark inline-flex items-center gap-2 font-medium hover:text-red-600 transition" href="/contents">
                Lihat etalase produk <ArrowRight size={16} />
              </Link>
            </div>

            {bludList.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada produk BLUD yang dipublikasikan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bludList.map((blud) => (
                  <article key={blud.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-red-200 transition duration-300">
                    <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-5 text-red-600">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{blud.judul}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{blud.deskripsi}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MITRA INDUSTRI SECTION (Tambahan dari Prisma) */}
        <section className="native-section py-20 border-t border-gray-100">
          <div className="native-shell text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Didukung oleh Mitra Industri</h2>
            <p className="text-sm text-gray-500 mb-10">Membuka jalan bagi lulusan untuk langsung berkarya di perusahaan terkemuka.</p>
            
            {companies.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada perusahaan mitra terdaftar.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {companies.map((comp) => (
                  <div key={comp.id} className="px-4 py-6 border border-gray-200 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 hover:border-red-300 transition duration-300 cursor-default">
                    <span className="font-semibold text-sm text-gray-600 text-center">{comp.nama}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <footer className="native-footer"><div className="native-shell"><strong>SMK Telkom Malang</strong><span>School of Global Digitalent</span><small>© 2026 SMK Telkom Malang</small></div></footer>
    </div>
  );
}