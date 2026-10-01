import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const principles = [
  { icon: BookOpen, title: "Kompetensi", text: "Pembelajaran berbasis proyek yang menumbuhkan keterampilan teknis dan kebiasaan belajar sepanjang hayat." },
  { icon: Users, title: "Karakter", text: "Budaya sekolah yang membangun integritas, disiplin, kolaborasi, dan tanggung jawab." },
  { icon: ShieldCheck, title: "Kesiapan global", text: "Pengalaman dan standar industri untuk membantu lulusan melanjutkan studi maupun berkarya." },
];

export default function AboutPage() {
  return (
    <div className="native-page native-about">
      <SiteHeader />
      <main>
        <section className="native-about__hero">
          <div className="native-shell">
            <p className="native-eyebrow native-eyebrow--dark">Tentang kami</p>
            <h1>Menyiapkan manusia yang siap menghadapi masa depan.</h1>
            <p>SMK Telkom Malang adalah sekolah vokasi teknologi dan informatika yang tumbuh bersama perubahan, tanpa kehilangan arah dan karakter.</p>
          </div>
        </section>

        <section className="native-section native-about__story">
          <div className="native-shell native-about__story-grid">
            <div><p className="native-eyebrow native-eyebrow--dark">Sejak 1992</p><h2>Dari Malang untuk dunia.</h2></div>
            <div><p>Selama lebih dari tiga dekade, SMK Telkom Malang berkomitmen menghadirkan pendidikan kejuruan yang relevan dengan perkembangan teknologi dan kebutuhan industri.</p><p>Kami percaya sekolah bukan hanya tempat memperoleh keahlian. Sekolah adalah ruang untuk menemukan potensi, membangun karakter, dan berani menciptakan solusi.</p></div>
          </div>
        </section>

        <section className="native-section native-about__principles">
          <div className="native-shell"><div className="native-section-heading"><div><p className="native-eyebrow native-eyebrow--dark">Cara kami bertumbuh</p><h2>Tiga hal yang kami jaga.</h2></div><Link className="native-text-link native-text-link--dark" href="/p/visi-dan-misi">Lihat visi dan misi <ArrowRight size={16} /></Link></div><div className="native-about__principle-grid">{principles.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="native-about__cta"><div className="native-shell"><p className="native-eyebrow">Temukan langkahmu</p><h2>Teknologi terus bergerak. Kami siap bergerak bersamanya.</h2><Link className="native-button native-button--light" href="/p/profil-jurusan">Lihat program keahlian <ArrowRight size={17} /></Link></div></section>
      </main>
    </div>
  );
}
