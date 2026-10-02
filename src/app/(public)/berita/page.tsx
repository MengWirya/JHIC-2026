import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

const pageSize = 12;

export const dynamic = "force-dynamic";

export default async function BeritaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requestedPage = Number((await searchParams).page ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [articles, total] = await Promise.all([
    prisma.konten.findMany({ where: { tipe: "BERITA", status: "PUBLISHED" }, orderBy: { tanggal: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.konten.count({ where: { tipe: "BERITA", status: "PUBLISHED" } }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return <div className="native-page"><SiteHeader /><main className="native-news-page"><div className="native-shell"><p className="native-eyebrow native-eyebrow--dark">Moklet hari ini</p><h1>Berita dan cerita terbaru.</h1><div className="native-news-grid">{articles.map((article) => <article className="native-news-card" key={article.id}><div className="native-news-card__image">{article.gambarUrl && <Image src={article.gambarUrl} alt="" width={640} height={360} />}</div><div className="native-news-card__body"><time dateTime={article.tanggal.toISOString()}>{article.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</time><h2><Link href={`/berita/${article.slug}`}>{article.judul}</Link></h2><p>{article.deskripsi.replace(/<[^>]*>/g, " ").slice(0, 150)}...</p></div></article>)}</div>{articles.length === 0 && <p className="native-empty">Belum ada berita yang dipublikasikan.</p>}<nav className="native-pagination" aria-label="Pagination berita">{page > 1 && <Link href={`/berita?page=${page - 1}`}>Sebelumnya</Link>}{page < pageCount && <Link href={`/berita?page=${page + 1}`}>Berikutnya</Link>}</nav></div></main></div>;
}