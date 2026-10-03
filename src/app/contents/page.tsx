import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export default async function PublicContentsPage() {
  // Mengambil data Berita, Galeri, dan BLUD yang sudah dipublikasikan
  const contents = await prisma.konten.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Berita, Galeri & Produk BLUD</h1>
            <p className="text-sm text-gray-500 mt-1">
              Informasi terkini, dokumentasi kegiatan, serta produk inovasi unit usaha SMK Telkom Malang.
            </p>
          </div>
        </div>

        {contents.length === 0 ? (
          <EmptyState
            title="Belum ada konten publik"
            description="Informasi dan galeri terbaru akan segera diperbarui."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full font-semibold">
                      {item.tipe}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h2 className="font-bold text-xl mb-2 text-gray-900">{item.judul}</h2>
                  <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">{item.deskripsi}</p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <span className="text-xs font-semibold text-blue-600">Moklet Hub 2.0</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}