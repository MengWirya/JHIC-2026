"use client";

import { useActionState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { submitApplication } from "@/app/jobs/apply/actions";

export default function JobApplyPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle params baik sebagai Promise (Next.js 15+) maupun objek biasa
  const resolvedParams = "then" in params ? use(params) : params;
  const lowonganId = resolvedParams?.id || "";
  const jobTitle = searchParams.get("title") || "Posisi Pekerjaan";

  const [state, formAction, isPending] = useActionState(submitApplication, null);

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Card Formulir Lamaran Cepat */}
        <div className="bg-[#fef2f2] border border-red-100 rounded-3xl p-8 shadow-sm">
          {/* Header & Tombol Batal */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                Formulir Lamaran Cepat
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Posisi: <span className="font-bold text-gray-800">{jobTitle}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition"
            >
              Batal
            </button>
          </div>

          {/* Alert Warning Error (Tampil saat data tidak lengkap) */}
          {state?.error && (
            <div className="mb-6 p-4 bg-[#fee2e2] border border-red-200 rounded-2xl text-red-700 text-xs font-bold">
              {state.error}
            </div>
          )}

          {/* Form Utama */}
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="lowonganId" value={lowonganId} />

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="namaLengkap"
                required
                placeholder="Prabu Panedya"
                className="w-full px-4 py-3 bg-white border border-red-100 rounded-2xl text-sm text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            {/* Kelas/Angkatan & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Kelas / Angkatan Alumni *
                </label>
                <input
                  type="text"
                  name="kelasAlumni"
                  required
                  placeholder="XII RPL 4"
                  className="w-full px-4 py-3 bg-white border border-red-100 rounded-2xl text-sm text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="prabu.dummy@gmail.com"
                  className="w-full px-4 py-3 bg-white border border-red-100 rounded-2xl text-sm text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
            </div>

            {/* Portfolio / CV */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Link Portfolio / CV (Google Drive, GitHub, LinkedIn) *
              </label>
              <input
                type="url"
                name="portfolioUrl"
                required
                placeholder="https://github.com/demo-prabu"
                className="w-full px-4 py-3 bg-white border border-red-100 rounded-2xl text-sm text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            {/* Pesan Tambahan */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Pesan Tambahan (Opsional)
              </label>
              <textarea
                name="pesanTambahan"
                rows={4}
                placeholder="Saya ingin bla bla bla"
                className="w-full px-4 py-3 bg-white border border-red-100 rounded-2xl text-sm text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
              />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-red-200 disabled:opacity-50"
            >
              {isPending ? (
                "Mengirim..."
              ) : (
                <>
                  Kirim Lamaran <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}