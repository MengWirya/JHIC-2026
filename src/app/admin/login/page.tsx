"use client";

import { useActionState } from "react";
import { authenticateAdmin } from "./actions"; // Sesuaikan path action Anda
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticateAdmin, undefined);

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-red-200 mb-4">
            M
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Moklet Hub Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Masuk ke Control Panel BKK SMK Telkom Malang
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-semibold">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form action={dispatch} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@smktelkom-mlg.sch.id"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-red-200 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link Kembali ke Portal Publik */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition">
            &larr; Kembali ke Portal Utama
          </Link>
        </div>
      </div>
    </main>
  );
}