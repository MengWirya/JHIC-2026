"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createCompany, updateCompany, deleteCompany } from "../actions";

// 🟢 1. Definisi Interface resmi pengganti `any`
interface CompanyItem {
  id: number;
  nama: string;
  overview: string;
  website?: string | null;
  kontak?: string | null;
  _count?: {
    lowongan: number;
  };
}

// 🟢 2. Terapkan interface pada Props dan State
export default function CompaniesClient({ companies }: { companies: CompanyItem[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<CompanyItem | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mitra Perusahaan</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar industri dan mitra BKK SMK Telkom Malang.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Tambah Mitra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  {c.nama.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingComp(c)} className="text-gray-400 hover:text-blue-600 transition">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteCompany(c.id)} className="text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-base mb-2">{c.nama}</h3>
              <p className="text-xs text-gray-500 line-clamp-3 mb-4">{c.overview || "Belum ada deskripsi mitra."}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                {c._count?.lowongan ?? 0} Lowongan
              </span>
              <Link href={`/jobs/${c.id}`} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
                Profil <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Company */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Tambah Mitra Perusahaan</h3>
              <button onClick={() => setIsAddOpen(false)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await createCompany(formData); setIsAddOpen(false); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Perusahaan</label>
                <input name="nama" required placeholder="PT Telkom Indonesia" className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Website</label>
                <input name="website" placeholder="https://..." className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Profil / Overview</label>
                <textarea name="overview" rows={3} placeholder="Profil singkat perusahaan..." className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition">Simpan Mitra</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Company */}
      {editingComp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Edit Mitra</h3>
              <button onClick={() => setEditingComp(null)}><X size={18} /></button>
            </div>
            <form action={async (formData) => { await updateCompany(formData); setEditingComp(null); }} className="space-y-4">
              <input type="hidden" name="id" value={editingComp.id} />
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Perusahaan</label>
                <input name="nama" defaultValue={editingComp.nama} required className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Website</label>
                <input name="website" defaultValue={editingComp.website || ""} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Overview</label>
                <textarea name="overview" defaultValue={editingComp.overview} rows={3} className="w-full mt-1 p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"/>
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition">Perbarui Mitra</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}