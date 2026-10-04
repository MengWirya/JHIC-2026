"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, X, CheckCircle2, Search } from "lucide-react";
import { createStudent, updateStudent, deleteStudent } from "../actions";

// 🟢 1. Interface resmi pengganti `any`
interface StudentItem {
  id: number;
  nisYayasan: string;
  nama: string;
  jurusan?: string | null;
}

// 🟢 2. Komponen Client Utama
export default function StudentsClient({ students }: { students: StudentItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);

  // 🔍 Fitur Pencarian Real-Time (Berdasarkan Nama atau NIS Yayasan)
  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisYayasan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Database Siswa & NIS Yayasan</h1>
          <p className="text-xs text-gray-500 mt-1">Tambah, cari, dan verifikasi NIS siswa aktif SMK Telkom Malang.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Tambah Siswa
        </button>
      </div>

      {/* Tabel & Toolbar Pencarian */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Input Pencarian */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa atau NIS..."
              className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-bold text-gray-400">Total: {filteredStudents.length} Siswa</span>
        </div>

        {/* Data Tabel */}
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">NIS Yayasan</th>
              <th className="px-6 py-3.5">Nama Siswa</th>
              <th className="px-6 py-3.5">Jurusan</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Data siswa tidak ditemukan.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-red-600 text-xs">{s.nisYayasan}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{s.nama}</td>
                  <td className="px-6 py-4 text-xs font-medium">{s.jurusan || "-"}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-100">
                      <CheckCircle2 size={12} /> Terverifikasi
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingStudent(s)}
                      className="text-gray-400 hover:text-blue-600 transition"
                      title="Edit Siswa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteStudent(s.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                      title="Hapus Siswa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Siswa */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Tambah Data Siswa</h3>
              <button onClick={() => setIsAddOpen(false)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await createStudent(formData); setIsAddOpen(false); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">NIS Yayasan</label>
                <input name="nisYayasan" required placeholder="Contoh: 1234/567" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Lengkap Siswa</label>
                <input name="nama" required placeholder="Nama siswa" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Jurusan</label>
                <input name="jurusan" placeholder="RPL / TKJ" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition">
                Simpan Siswa
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Edit Data Siswa</h3>
              <button onClick={() => setEditingStudent(null)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await updateStudent(formData); setEditingStudent(null); }} className="space-y-4">
              <input type="hidden" name="id" value={editingStudent.id} />
              <div>
                <label className="text-xs font-bold text-gray-600">NIS Yayasan</label>
                <input name="nisYayasan" defaultValue={editingStudent.nisYayasan} required className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Siswa</label>
                <input name="nama" defaultValue={editingStudent.nama} required className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Jurusan</label>
                <input name="jurusan" defaultValue={editingStudent.jurusan || ""} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition">
                Perbarui Siswa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}