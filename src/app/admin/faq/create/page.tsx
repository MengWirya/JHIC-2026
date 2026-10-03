import { createFaq } from "../action";
import Link from "next/link";

export default function CreateFaqPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah FAQ Baru</h1>
        <Link href="/admin/faq" className="text-sm text-gray-600 hover:underline">
          &larr; Kembali
        </Link>
      </div>

      <form action={createFaq} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
          <input
            type="text"
            name="question"
            required
            placeholder="Contoh: Bagaimana cara mendaftar BKK Moklet?"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
          <textarea
            name="answer"
            required
            rows={4}
            placeholder="Tuliskan jawaban lengkap di sini..."
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            href="/admin/faq"
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Simpan FAQ
          </button>
        </div>
      </form>
    </div>
  );
}