import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Sesuaikan jalur impor prisma Anda jika berbeda
import EmptyState from "@/components/EmptyState";

export default async function AdminFaqPage() {
  // Ambil data FAQ dari database
  const faqs = await prisma.faq.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen FAQ (MokletBot)</h1>
          <p className="text-sm text-gray-500">Kelola daftar pertanyaan dan jawaban untuk *knowledge base* chatbot.</p>
        </div>
        <Link
          href="/admin/faq/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah FAQ Baru
        </Link>
      </div>

      {faqs.length === 0 ? (
        <EmptyState 
          title="Belum ada FAQ" 
          description="Silakan tambahkan FAQ baru agar MokletBot memiliki referensi jawaban." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Pertanyaan (Question)</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Jawaban (Answer)</th>
                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                // Di dalam map(faq) pada page.tsx
                <tr key={faq.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{faq.pertanyaan}</td>
                    <td className="p-3 text-gray-600 truncate max-w-md">{faq.jawaban}</td>
                    <td className="p-3 text-center space-x-2">
                        {/* Aksi */}
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