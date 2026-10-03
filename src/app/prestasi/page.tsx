import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export default async function PublicPrestasiPage() {
  // Hanya mengambil konten PRESTASI yang berstatus PUBLISHED
  const prestasiList = await prisma.konten.findMany({
    where: {
      tipe: "PRESTASI",
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
            <h1 className="text-3xl font-extrabold text-gray-900">Prestasi Siswa & Sekolah</h1>
            <p className="text-sm text-gray-500 mt-1">
              Daftar kejuaraan dan pencapaian gemilang civitas akademika SMK Telkom Malang.
            </p>
          </div>
        </div>

        {prestasiList.length === 0 ? (
          <EmptyState
            title="Belum ada data prestasi"
            description="Prestasi terbaru akan segera ditampilkan di halaman ini."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestasiList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold inline-block mb-3">
                    Prestasi
                  </span>
                  <h2 className="font-bold text-xl mb-2 text-gray-900">{item.judul}</h2>
                  <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">{item.deskripsi}</p>
                </div>
                <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs text-gray-400">
                  <span>Dipublikasikan</span>
                  <span>{new Date(item.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}