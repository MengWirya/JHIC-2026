import { prisma } from "@/lib/prisma";
import { updateJob } from "../../actions";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const jobId = Number(id);

  const [job, companies] = await Promise.all([
    prisma.lowongan.findUnique({ where: { id: jobId } }),
    prisma.perusahaan.findMany({ orderBy: { nama: "asc" } }),
  ]);

  if (!job) return <div className="p-6">Lowongan tidak ditemukan.</div>;

  const updateJobWithId = updateJob.bind(null, job.id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Lowongan: {job.judulPosisi}</h1>
        <Link href="/admin/jobs" className="text-sm text-gray-600 hover:underline">&larr; Kembali</Link>
      </div>

      <form action={updateJobWithId} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Posisi</label>
          <input
            type="text"
            name="judulPosisi"
            defaultValue={job.judulPosisi}
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan Mitra</label>
          <select
            name="perusahaanId"
            defaultValue={job.perusahaanId}
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            {companies.map((comp) => (
              <option key={comp.id} value={comp.id}>{comp.nama}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Lowongan</label>
            <select
              name="tipe"
              defaultValue={job.tipe}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="PKL">PKL</option>
              <option value="MAGANG">Magang</option>
              <option value="FULL_TIME">Full Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              name="lokasi"
              defaultValue={job.lokasi}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
          <textarea
            name="deskripsi"
            defaultValue={job.deskripsi}
            required
            rows={4}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Syarat Keahlian</label>
          <textarea
            name="syaratKeahlian"
            defaultValue={job.syaratKeahlian}
            required
            rows={3}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Publikasi</label>
          <select
            name="status"
            defaultValue={job.status}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link href="/admin/jobs" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">Batal</Link>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Perbarui Lowongan</button>
        </div>
      </form>
    </div>
  );
}