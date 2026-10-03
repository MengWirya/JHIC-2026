import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export default async function AdminContentsPage() {
  const contents = await prisma.konten.findMany({
    include: {
      admin: true,
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Konten Website</h1>
          <p className="text-sm text-gray-500">Kelola Berita, Prestasi, Produk BLUD, dan Galeri sekolah.</p>
        </div>
        <Link
          href="/admin/contents/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Konten Baru
        </Link>
      </div>

      {contents.length === 0 ? (
        <EmptyState 
          title="Belum ada konten tersimpan" 
          description="Tambahkan berita, prestasi, BLUD, atau galeri untuk ditampilkan di website utama." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Judul & Tipe</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Penulis</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Tanggal</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{item.judul}</div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                      {item.tipe}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{item.admin?.nama || "Admin"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      item.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <Link href={`/admin/contents/${item.id}/edit`} className="text-xs text-blue-600 hover:underline">
                        Edit
                    </Link>
                    <span className="text-xs text-red-600 cursor-pointer hover:underline">Hapus</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}