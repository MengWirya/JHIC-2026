import { createContent } from "../actions";
import Link from "next/link";

export default function CreateContentPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Konten Baru</h1>
        <Link href="/admin/contents" className="text-sm text-gray-600 hover:underline">
          &larr; Kembali
        </Link>
      </div>

      <form action={createContent} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Konten</label>
          <input
            type="text"
            name="judul"
            required
            placeholder="Contoh: Siswa Moklet Juara Nasional Hackathon"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Konten</label>
            <select
              name="tipe"
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="BERITA">Berita</option>
              <option value="PRESTASI">Prestasi</option>
              <option value="BLUD">Produk BLUD</option>
              <option value="GALERI">Galeri</option>
            </select>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Gambar / Foto (Opsional)</label>
          <input
            type="text"
            name="gambarUrl"
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Isi Konten</label>
          <textarea
            name="deskripsi"
            required
            rows={5}
            placeholder="Tuliskan isi berita atau deskripsi lengkap di sini..."
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            href="/admin/contents"
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Simpan Konten
          </button>
        </div>
      </form>
    </div>
  );
}