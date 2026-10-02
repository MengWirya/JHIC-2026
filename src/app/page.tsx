import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Gamepad2, Network, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

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

export default function Home() {
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
                <Link className="native-button native-button--light" href="/program">Join Now <ArrowRight size={17} /></Link>
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
            <div className="native-section-heading"><div><p className="native-eyebrow native-eyebrow--dark">Program keahlian</p><h2>Mulai dari rasa ingin tahu.</h2></div><Link className="native-text-link native-text-link--dark" href="/program">Lihat semua program <ArrowRight size={16} /></Link></div>
            <div className="native-program-grid">
              {programs.map((program) => <article className="native-program" key={program.short}><div className="native-program__image"><Image src={program.image} alt={program.title} fill sizes="(max-width: 700px) 90vw, 30vw" /></div><div className="native-program__body"><span>{program.short}</span><h3>{program.title}</h3><p>{program.text}</p><Link href="/program" aria-label={`Pelajari ${program.title}`}><ArrowUpRight size={20} /></Link></div></article>)}
            </div>
          </div>
        </section>

        <section className="native-news"><div className="native-shell native-news__inner"><div><p className="native-eyebrow">Moklet hari ini</p><h2>Yang sedang kami kerjakan.</h2></div><Link className="native-button native-button--outline" href="/berita">Baca berita terbaru <ArrowRight size={17} /></Link></div></section>
      </main>
      <footer className="native-footer"><div className="native-shell"><strong>SMK Telkom Malang</strong><span>School of Global Digitalent</span><small>© 2026 SMK Telkom Malang</small></div></footer>
    </div>
  );
}
