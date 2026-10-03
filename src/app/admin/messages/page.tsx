import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

// Definisikan tipe data yang sesuai dengan model PesanMasuk
interface PesanItem {
  id: number;
  nama: string;
  email: string | null;
  pesan: string;
  createdAt: Date;
}

export default async function AdminMessagesPage() {
  // Menggunakan model yang benar: prisma.pesanMasuk
  const messages: PesanItem[] = await prisma.pesanMasuk.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daftar Pesan Masuk</h1>
        <p className="text-sm text-gray-500">Aspirasi atau pertanyaan dari pengunjung melalui halaman kontak.</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState 
          title="Belum ada pesan masuk" 
          description="Pesan yang dikirim pengunjung akan muncul di sini." 
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Pengirim</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Pesan</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{msg.nama}</td>
                  <td className="p-3 text-gray-600 text-sm">{msg.email || "-"}</td>
                  <td className="p-3 text-gray-600 max-w-md truncate">{msg.pesan}</td>
                  <td className="p-3 text-gray-400 text-xs">
                    {new Date(msg.createdAt).toLocaleDateString("id-ID")}
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