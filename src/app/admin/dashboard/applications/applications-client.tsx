"use client";

import { ExternalLink } from "lucide-react";
import { updateApplicationStatus } from "../actions";

// 🟢 1. Interface resmi pengganti `any`
interface ApplicationItem {
  id: number;
  namaLengkap: string;
  kelasAlumni: string;
  email: string;
  portfolioUrl: string;
  pesanTambahan?: string | null;
  status: string;
  lowongan?: {
    judulPosisi: string;
    perusahaan?: {
      nama: string;
    } | null;
  } | null;
}

// 🟢 2. Gunakan interface pada Props
export default function ApplicationsClient({
  applications,
}: {
  applications: ApplicationItem[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Data Lamaran Masuk</h1>
        <p className="text-xs text-gray-500 mt-1">
          Kelola dan ubah status seleksi berkas pendaftaran siswa/alumni.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Pelamar</th>
              <th className="px-6 py-3.5">Posisi & Perusahaan</th>
              <th className="px-6 py-3.5">Jurusan / Kelas</th>
              <th className="px-6 py-3.5">Status Lamaran</th>
              <th className="px-6 py-3.5 text-right">Berkas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Belum ada lamaran masuk.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <strong className="block text-gray-900">{app.namaLengkap}</strong>
                    <span className="text-xs text-gray-400">{app.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="block text-xs text-gray-800">
                      {app.lowongan?.judulPosisi || "-"}
                    </strong>
                    <span className="text-[11px] text-gray-500">
                      {app.lowongan?.perusahaan?.nama || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">{app.kelasAlumni}</td>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className="p-1.5 bg-yellow-50 text-yellow-800 text-xs font-bold rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="BARU">BARU</option>
                      <option value="DITINJAU">DITINJAU</option>
                      <option value="DITERIMA">DITERIMA</option>
                      <option value="DITOLAK">DITOLAK</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-100 transition inline-flex items-center gap-1"
                    >
                      Portofolio <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}