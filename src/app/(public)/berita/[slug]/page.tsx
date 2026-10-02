import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.konten.findFirst({ where: { slug, tipe: "BERITA", status: "PUBLISHED" } });
  if (!article) notFound();
  return <div className="native-page"><SiteHeader /><main className="native-article-page"><article className="native-shell"><p className="native-eyebrow native-eyebrow--dark">Berita Moklet</p><h1>{article.judul}</h1><time dateTime={article.tanggal.toISOString()}>{article.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</time>{article.gambarUrl && <Image className="native-article-page__image" src={article.gambarUrl} alt="" width={960} height={540} priority />}<div className="native-article-page__content" dangerouslySetInnerHTML={{ __html: article.deskripsi }} /></article></main></div>;
}