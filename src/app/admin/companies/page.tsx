import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export default async function AdminCompaniesPage() {
  const companies = await prisma.perusahaan.findMany({
    include: {
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { lowongan: true },
      },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Perusahaan Mitra</h1>
          <p className="text-sm text-gray-500">Kelola daftar industri mitra untuk portal BKK Moklet Hub.</p>
        </div>
        <Link
          href="/admin/companies/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Perusahaan
        </Link>
      </div>

      {companies.length === 0 ? (
        <EmptyState 
          title="Belum ada perusahaan mitra" 
          description="Tambahkan perusahaan baru yang berpartisipasi dalam program BKK." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Nama Perusahaan</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Kontak / Website</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Jumlah Lowongan</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp) => (
                <tr key={comp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{comp.nama}</td>
                  <td className="p-3 text-gray-600 text-sm">
                    {comp.website ? (
                      <a href={comp.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {comp.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                      {comp._count.lowongan} Lowongan
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <Link href={`/admin/companies/${comp.id}/edit`} className="text-xs text-blue-600 hover:underline">
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