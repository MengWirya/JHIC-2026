"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Briefcase } from "lucide-react";

export default function ApplicationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 text-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={44} strokeWidth={2.5} className="animate-bounce" />
        </div>

        {/* Title & Message */}
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-3">
          Lamaran Berhasil Dikirim!
        </h1>
        <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-md mx-auto mb-8">
          Terima kasih telah melamar. Data Anda dan berkas pendukung telah resmi terdata di sistem BKK SMK Telkom Malang.
        </p>

        {/* Info Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah Selanjutnya:</p>
          <ul className="text-xs text-gray-700 font-medium space-y-2 list-disc list-inside">
            <li>Tim BKK & Perusahaan akan meninjau berkas portofolio Anda.</li>
            <li>Hasil seleksi atau panggilan wawancara akan dikirim melalui <b>Email</b>.</li>
            <li>Pastikan email Anda tetap aktif dan cek folder spam secara berkala.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/career-industries"
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-red-200"
          >
            <Briefcase size={16} /> Cari Lowongan Lain
          </Link>
          <Link
            href="/"
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}