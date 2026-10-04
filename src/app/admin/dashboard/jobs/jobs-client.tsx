"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, CheckCircle2, ExternalLink, ArrowLeft, Trash2, Edit3, X } from "lucide-react";
import { createJob, updateJob, deleteJob } from "../actions";

interface JobItem {
  id: number;
  judulPosisi: string;
  tipe: string;
  lokasi: string;
  status: string;
  perusahaanId: number;
  perusahaan?: { nama: string } | null;
}

interface CompanyOption {
  id: number;
  nama: string;
}

export default function JobsClient({
  lowonganList,
  perusahaanList,
}: {
  lowonganList: JobItem[];
  perusahaanList: CompanyOption[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);

  // Filter pencarian lowongan
  const filteredJobs = lowonganList.filter(
    (job) =>
      job.judulPosisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.perusahaan?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header & Back */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold text-gray-400 hover:text-red-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Kelola Lowongan Kerja</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar seluruh lowongan pekerjaan dan magang yang aktif di BKK Moklet Hub.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Buat Lowongan Baru
        </button>
      </div>

      {/* Tabel Lowongan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari posisi atau perusahaan..."
              className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-bold text-gray-400">Total: {filteredJobs.length} Lowongan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Posisi</th>
                <th className="px-6 py-3.5">Perusahaan</th>
                <th className="px-6 py-3.5">Tipe</th>
                <th className="px-6 py-3.5">Lokasi</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Belum ada data lowongan kerja.</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">{job.judulPosisi}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">{job.perusahaan?.nama || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-md border border-red-100">
                        {job.tipe}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{job.lokasi}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-100">
                        <CheckCircle2 size={12} /> {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="text-gray-400 hover:text-blue-600 transition p-1"
                        title="Edit Lowongan"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        title="Hapus Lowongan"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link href={`/jobs/${job.perusahaanId}`} className="text-gray-400 hover:text-gray-600 inline-block transition p-1">
                        <ExternalLink size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Lowongan */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Buat Lowongan Baru</h3>
              <button onClick={() => setIsAddOpen(false)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await createJob(formData); setIsAddOpen(false); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Judul Posisi</label>
                <input name="judulPosisi" required placeholder="Contoh: Frontend Developer" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Mitra Perusahaan</label>
                <select name="perusahaanId" required className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition">
                  <option value="">-- Pilih Perusahaan --</option>
                  {perusahaanList.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600">Tipe Pekerjaan</label>
                  <select name="tipe" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition">
                    <option value="Full-time" className="text-gray-900 bg-white">Full-time</option>
                    <option value="Magang / PKL" className="text-gray-900 bg-white">Magang / PKL</option>
                    <option value="Part-time" className="text-gray-900 bg-white">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">Lokasi</label>
                  <input name="lokasi" defaultValue="Malang" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Deskripsi / Kualifikasi</label>
                <textarea name="deskripsi" rows={3} placeholder="Kualifikasi pekerjaan..." className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition">
                Simpan Lowongan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Lowongan */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Edit Lowongan</h3>
              <button onClick={() => setEditingJob(null)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await updateJob(formData); setEditingJob(null); }} className="space-y-4">
              <input type="hidden" name="id" value={editingJob.id} />
              <div>
                <label className="text-xs font-bold text-gray-600">Judul Posisi</label>
                <input name="judulPosisi" defaultValue={editingJob.judulPosisi} required className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600">Tipe</label>
                  <select name="tipe" defaultValue={editingJob.tipe} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition">
                    <option value="Full-time">Full-time</option>
                    <option value="Magang / PKL">Magang / PKL</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">Status</label>
                  <select name="status" defaultValue={editingJob.status} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Lokasi</label>
                <input name="lokasi" defaultValue={editingJob.lokasi} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition">
                Perbarui Lowongan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}