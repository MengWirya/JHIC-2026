import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  // Mengambil data publik secara paralel agar cepat dan efisien
  // Mengambil data publik secara paralel (disesuaikan dengan nama model di schema.prisma)
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
      include: { tags: { include: { tag: true } } },
      take: 6,
    }),
  ]).catch(() => [[], [], []]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Selamat Datang di Moklet Hub 2.0
          </h1>
          <p className="text-lg text-blue-200">
            Pusat karier, prestasi, dan inovasi digital kebanggaan SMK Telkom Malang.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/jobs"
              className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition"
            >
              Cari Lowongan BKK
            </Link>
            <Link
              href="/contents"
              className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Lihat Berita & Prestasi
            </Link>
          </div>
        </div>
      </section>

      {/* Prestasi Terbaru Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Prestasi Terbaru</h2>
          <span className="text-sm text-blue-600 font-semibold">Update Terkini</span>
        </div>

        {prestasiList.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data prestasi yang dipublikasikan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prestasiList.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow border p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{item.judul}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{item.deskripsi}</p>
                </div>
                <span className="text-xs text-gray-400 mt-4 block">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Produk BLUD Section */}
      <section className="bg-white py-16 px-6 border-y">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Produk Unggulan BLUD</h2>
          {bludList.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada produk BLUD yang dipublikasikan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bludList.map((blud) => (
                <div key={blud.id} className="border rounded-lg p-5 shadow-sm bg-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{blud.judul}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{blud.deskripsi}</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 mt-4 uppercase">Unit Usaha Sekolah</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Showcase Perusahaan Mitra */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Perusahaan Mitra BKK</h2>
        {companies.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada perusahaan mitra terdaftar.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {companies.map((comp) => (
              <div key={comp.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800">{comp.nama}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{comp.overview}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}