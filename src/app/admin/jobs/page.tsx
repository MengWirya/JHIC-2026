import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export default async function AdminJobsPage() {
  const jobs = await prisma.lowongan.findMany({
    include: {
      perusahaan: true,
      _count: {
        select: { lamaran: true },
      },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Lowongan Pekerjaan</h1>
          <p className="text-sm text-gray-500">Kelola daftar lowongan PKL, Magang, atau Full-Time untuk siswa/alumni.</p>
        </div>
        <Link
          href="/admin/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Lowongan
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState 
          title="Belum ada lowongan pekerjaan" 
          description="Tambahkan lowongan baru agar siswa dapat melihat dan mengirimkan lamaran." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Posisi & Perusahaan</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Tipe / Lokasi</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Total Lamaran</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{job.judulPosisi}</div>
                    <div className="text-xs text-gray-500">{job.perusahaan.nama}</div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div>{job.tipe}</div>
                    <div className="text-xs text-gray-400">{job.lokasi}</div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      job.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                      {job._count.lamaran} Pelamar
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <Link href={`/admin/jobs/${job.id}/applicants`} className="text-xs text-blue-600 hover:underline">
                      Lihat Lamaran
                    </Link>
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