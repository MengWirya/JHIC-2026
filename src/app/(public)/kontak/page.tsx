import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const faq = await prisma.faq.findMany({ orderBy: { createdAt: "asc" }, take: 8 });
  return <div className="native-page"><SiteHeader /><main className="native-contact-page"><div className="native-shell"><p className="native-eyebrow native-eyebrow--dark">Hubungi kami</p><h1>Punya pertanyaan? Mari bicara.</h1><div className="native-contact-grid"><section className="native-contact-panel"><h2>Kirim pesan</h2><form className="native-contact-form" action="/api/pesan" method="post"><input name="nama" required placeholder="Nama" /><input name="email" type="email" placeholder="Email" /><input name="subjek" required placeholder="Subjek" /><textarea name="pesan" required placeholder="Pesan" /><button className="native-button native-button--light" type="submit">Kirim pesan</button></form></section><section className="native-contact-panel"><h2>Pertanyaan umum</h2>{faq.length === 0 ? <p>Informasi FAQ sedang disiapkan.</p> : faq.map((item) => <details key={item.id}><summary>{item.pertanyaan}</summary><p>{item.jawaban}</p></details>)}</section></div></div></main></div>;
}