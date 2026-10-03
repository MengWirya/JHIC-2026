import { createJob } from "../actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CreateJobPage() {
  const companies = await prisma.perusahaan.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Lowongan Pekerjaan</h1>
        <Link href="/admin/jobs" className="text-sm text-gray-600 hover:underline">
          &larr; Kembali
        </Link>
      </div>

      <form action={createJob} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Posisi</label>
          <input
            type="text"
            name="judulPosisi"
            required
            placeholder="Contoh: Junior Frontend Developer"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Perusahaan Mitra</label>
          <select
            name="perusahaanId"
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Pilih Perusahaan --</option>
            {companies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Lowongan</label>
            <select
              name="tipe"
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
              required
              placeholder="Contoh: Malang / Remote"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
          <textarea
            name="deskripsi"
            required
            rows={4}
            placeholder="Tuliskan rincian tugas dan tanggung jawab..."
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Syarat Keahlian (Skills)</label>
          <textarea
            name="syaratKeahlian"
            required
            rows={3}
            placeholder="Contoh: Menguasai React.js, Tailwind CSS, Git"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Publikasi</label>
          <select
            name="status"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            href="/admin/jobs"
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Simpan Lowongan
          </button>
        </div>
      </form>
    </div>
  );
}