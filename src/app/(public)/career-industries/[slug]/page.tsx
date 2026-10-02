import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

const typeLabels = { PKL: "PKL", MAGANG: "Magang", FULL_TIME: "Full-Time" } as const;

export const dynamic = "force-dynamic";

export default async function CareerJobDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ applied?: string }> }) {
  const [{ slug }, { applied }] = await Promise.all([params, searchParams]);
  const job = await prisma.lowongan.findFirst({ where: { slug, status: "PUBLISHED" }, include: { perusahaan: true } });
  if (!job) notFound();

  return <div className="native-page"><SiteHeader /><main className="career-detail-page"><div className="native-shell"><Link className="career-back-link" href="/career-industries">&lt;- Kembali ke Career Industries</Link><section className="career-detail-layout"><article className="career-detail-copy"><span className={`career-badge career-badge--${job.tipe.toLowerCase()}`}>{typeLabels[job.tipe]}</span><p className="career-job-card__company">{job.perusahaan.nama}</p><h1>{job.judulPosisi}</h1><p className="career-detail-meta">{job.lokasi} &middot; Dibuka untuk siswa dan alumni</p><div className="career-detail-section"><h2>Tentang posisi</h2><p>{job.deskripsi}</p></div><div className="career-detail-section"><h2>Syarat keahlian</h2><div className="career-tags">{job.syaratKeahlian.split(",").map((tag) => <span key={tag}>{tag.trim()}</span>)}</div></div></article><section className="career-apply-panel" id="lamar"><h2>Lamar Cepat</h2>{applied === "1" && <p className="career-success" role="status">Lamaran berhasil dikirim. Tim kami akan meninjau data kamu.</p>}<form action="/api/lamaran" method="post" className="career-apply-form"><input type="hidden" name="lowonganId" value={job.id} /><input name="namaLengkap" required placeholder="Nama lengkap" /><input name="kelasAlumni" required placeholder="Kelas / Alumni" /><input name="email" type="email" required placeholder="Email aktif" /><input name="portfolioUrl" type="url" required placeholder="Link portofolio atau CV" /><textarea name="pesanTambahan" placeholder="Pesan tambahan (opsional)" /><button className="native-button native-button--light" type="submit">Kirim lamaran</button></form></section></section></div></main></div>;
}
