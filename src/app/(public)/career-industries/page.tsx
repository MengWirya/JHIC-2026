import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Server Component — query Prisma langsung di halaman, tanpa perlu API
// terpisah untuk operasi baca (sesuai prinsip yang sudah kita sepakati).
export default async function CareerIndustriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  const [perusahaanList, semuaTag] = await Promise.all([
    prisma.perusahaan.findMany({
      where: tag
        ? { tags: { some: { tag: { nama: tag } } } }
        : undefined,
      include: {
        tags: { include: { tag: true } },
        testimoni: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tagJurusan.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--brand-secondary)]">
        Career Industries
      </h1>
      <p className="mt-2 text-gray-600">Choose your path, build your future</p>

      {/* Filter tag — mirip filter role di LinkedIn Jobs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/career-industries"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            !tag
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
              : "border-gray-300 text-gray-600"
          }`}
        >
          Semua
        </a>
        {semuaTag.map((t) => (
          <a
            key={t.id}
            href={`/career-industries?tag=${encodeURIComponent(t.nama)}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              tag === t.nama
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {t.nama}
          </a>
        ))}
      </div>

      {/* Grid card perusahaan */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {perusahaanList.length === 0 && (
          <p className="col-span-2 text-gray-500">
            Belum ada mitra perusahaan untuk kategori ini.
          </p>
        )}
        {perusahaanList.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <h2 className="font-semibold text-[var(--brand-secondary)]">
              {p.nama}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-[var(--brand-primary)] px-2.5 py-0.5 text-xs font-medium text-white"
                >
                  {tag.nama}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">{p.overview}</p>
            {p.testimoni[0] && (
              <p className="mt-3 text-xs italic text-gray-500">
                ★ &ldquo;{p.testimoni[0].kutipan}&rdquo; — {p.testimoni[0].namaPemberi}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
