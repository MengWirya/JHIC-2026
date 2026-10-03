import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const jobId = Number(id);

  const job = await prisma.lowongan.findUnique({
    where: { id: jobId },
    include: { perusahaan: true },
  });

  const applicants = await prisma.lamaran.findMany({
    where: { lowonganId: jobId },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/jobs" className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            &larr; Kembali ke Daftar Lowongan
          </Link>
          <h1 className="text-2xl font-bold">Daftar Pelamar: {job?.judulPosisi}</h1>
          <p className="text-sm text-gray-500">Perusahaan: {job?.perusahaan.nama}</p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <EmptyState 
          title="Belum ada pelamar untuk posisi ini" 
          description="Siswa atau alumni yang mengirimkan lamaran melalui portal BKK akan muncul di sini." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Nama Pelamar</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Kelas / Alumni</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Email & Kontak</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Portfolio / CV</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{app.namaLengkap}</td>
                  <td className="p-3 text-sm text-gray-600">{app.kelasAlumni}</td>
                  <td className="p-3 text-sm text-gray-600">{app.email}</td>
                  <td className="p-3 text-sm">
                    <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      Lihat Tautan &rarr;
                    </a>
                  </td>
                  <td className="p-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                      {app.status}
                    </span>
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