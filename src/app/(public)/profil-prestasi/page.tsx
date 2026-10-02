import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function ProfilPrestasiPage() {
  const achievements = await prisma.konten.findMany({ where: { tipe: "PRESTASI", status: "PUBLISHED" }, orderBy: { tanggal: "desc" }, take: 12 });
  return <div className="native-page"><SiteHeader /><main className="profile-page"><div className="native-shell"><section className="profile-hero"><p className="native-eyebrow native-eyebrow--dark">Profil & Prestasi</p><h1>Karakter kuat, karya yang berdampak.</h1><p>Ruang untuk mengenal visi, misi, akreditasi, dan pencapaian siswa SMK Telkom Malang.</p></section><section className="profile-grid"><article><span>Visi</span><h2>Menjadi sekolah vokasi teknologi yang menghasilkan talenta global berkarakter.</h2></article><article><span>Misi</span><h2>Mengembangkan kompetensi, kreativitas, dan kolaborasi melalui pengalaman belajar yang relevan.</h2></article><article><span>Akreditasi</span><h2>Budaya mutu yang terus bertumbuh bersama standar pendidikan dan kebutuhan industri.</h2></article></section><section className="profile-achievements"><div className="native-section-heading"><div><p className="native-eyebrow native-eyebrow--dark">Jejak karya</p><h2>Prestasi terbaru.</h2></div><Link className="native-text-link native-text-link--dark" href="/career-industries">Lihat peluang industri -&gt;</Link></div><div className="profile-achievement-grid">{achievements.map((item) => <article key={item.id}><time dateTime={item.tanggal.toISOString()}>{item.tanggal.toLocaleDateString("id-ID", { year: "numeric", month: "long" })}</time><h3>{item.judul}</h3><p>{item.deskripsi.replace(/<[^>]*>/g, " ").slice(0, 160)}</p></article>)}</div>{achievements.length === 0 && <p className="profile-empty">Data prestasi akan tampil setelah admin menerbitkannya.</p>}</section></div></main></div>;
}
