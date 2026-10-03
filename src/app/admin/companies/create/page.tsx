import { createCompany } from "../actions";
import Link from "next/link";

export default function CreateCompanyPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Perusahaan Mitra Baru</h1>
        <Link href="/admin/companies" className="text-sm text-gray-600 hover:underline">
          &larr; Kembali
        </Link>
      </div>

      <form action={createCompany} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
          <input
            type="text"
            name="nama"
            required
            placeholder="Contoh: PT Telkom Indonesia Tbk"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overview / Deskripsi Perusahaan</label>
          <textarea
            name="overview"
            required
            rows={4}
            placeholder="Tuliskan profil singkat perusahaan..."
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kontak (Opsional)</label>
          <input
            type="text"
            name="kontak"
            placeholder="Email atau nomor telepon HRD"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website (Opsional)</label>
          <input
            type="text"
            name="website"
            placeholder="https://www.perusahaan.com"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            href="/admin/companies"
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Simpan Perusahaan
          </button>
        </div>
      </form>
    </div>
  );
}