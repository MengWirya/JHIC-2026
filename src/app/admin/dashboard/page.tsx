import { prisma } from "@/lib/prisma";
import { Briefcase, Building2, Users, GraduationCap, Plus, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [totalLowongan, totalPerusahaan, totalLamaran, totalSiswa, lowonganList, perusahaanList, lamaranList] = await Promise.all([
    prisma.lowongan.count().catch(() => 0),
    prisma.perusahaan.count().catch(() => 0),
    prisma.lamaran.count().catch(() => 0),
    prisma.siswa.count().catch(() => 0),
    prisma.lowongan.findMany({ include: { perusahaan: true }, orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
    prisma.perusahaan.findMany({ include: { _count: { select: { lowongan: true } } }, orderBy: { nama: "asc" }, take: 5 }).catch(() => []),
    prisma.lamaran.findMany({ include: { lowongan: { include: { perusahaan: true } } }, orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
  ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ringkasan Operasional</h1>
          <p className="text-xs text-gray-500 mt-1">Pantau statistik real-time lowongan dan lamaran masuk sekolah.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Tambah Lowongan
          </button>
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Lowongan</p>
            <h3 className="text-3xl font-black text-gray-900">{totalLowongan}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Briefcase size={22} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Mitra Perusahaan</p>
            <h3 className="text-3xl font-black text-gray-900">{totalPerusahaan}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Building2 size={22} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Lamaran Masuk</p>
            <h3 className="text-3xl font-black text-gray-900">{totalLamaran}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Users size={22} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Database Siswa</p>
            <h3 className="text-3xl font-black text-gray-900">{totalSiswa}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><GraduationCap size={22} /></div>
        </div>
      </div>
    </>
  );
}