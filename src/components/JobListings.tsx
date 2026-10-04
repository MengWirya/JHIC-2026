"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // 🟢 Impor Link resmi Next.js
import { MapPin, Briefcase, Clock, CheckCircle, ExternalLink, X, Coins, Send } from "lucide-react";
import { submitFullApplication } from "@/app/actions/submitFullApplication";

interface CompanyData {
  logoUrl?: string | null;
  nama?: string;
  [key: string]: unknown;
}

interface LowonganData {
  id: number;
  judulPosisi: string;
  lokasi: string;
  tipe: string;
  deskripsi: string;
  syaratKeahlian: string;
  [key: string]: unknown;
}

export default function JobListings({ company, jobs }: { company: CompanyData; jobs: LowonganData[] }) {
  const [selectedJob, setSelectedJob] = useState<LowonganData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State untuk Modal Form Lamar Cepat
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const openSidebar = (job: LowonganData) => {
    setSelectedJob(job);
    setIsSidebarOpen(true);
    setIsFormOpen(false);
    setFeedback(null);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setIsFormOpen(false);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitFullApplication(formData);

    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: "success", msg: result.message });
      (e.target as HTMLFormElement).reset();
    } else {
      setFeedback({ type: "error", msg: result.message });
    }
  };

  return (
    <>
      {/* Grid Peluang Karir */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 bg-white p-6 rounded-t-2xl shadow-sm border-b">
          Peluang Karir
        </h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-b-2xl shadow-sm">
            Belum ada lowongan pekerjaan saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-b-2xl shadow-sm">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => openSidebar(job)}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-red-200 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-900">{job.judulPosisi}</h3>
                  <div className="bg-red-50 p-2 rounded-lg">
                    {company.logoUrl ? (
                      <Image src={company.logoUrl} alt="Logo" width={24} height={24} className="object-contain" />
                    ) : (
                      <Briefcase className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{job.tipe}</span>
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">WFA</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin size={14} /> {job.lokasi}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                  {job.deskripsi}
                </p>
                
                <p className="text-xs text-gray-400 mt-auto">Diposting baru saja</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Window / Slide-over (Detail Job & Form Lamaran) */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeSidebar}
      />

      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        {selectedJob && (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center p-2">
                {company.logoUrl ? (
                  <Image src={company.logoUrl} alt="Logo" width={48} height={48} className="object-contain" />
                ) : (
                  <Briefcase className="text-red-500 w-8 h-8" />
                )}
              </div>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-gray-900"><ExternalLink size={20} /></button>
                <button onClick={closeSidebar} className="text-gray-400 hover:text-red-600"><X size={24} /></button>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">ID: #{selectedJob.id}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedJob.judulPosisi}</h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={16} /> {selectedJob.lokasi}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Clock size={16} /> {selectedJob.tipe}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Coins size={16} /> Kompetitif</div>
              <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle size={16} /> Verified</div>
            </div>

            {/* 🟢 PERBAIKAN TOMBOL: Menggunakan selectedJob.id dan selectedJob.judulPosisi */}
            {!isFormOpen ? (
              <div className="mb-8">
                <Link
                  href={`/jobs/${selectedJob.id}/apply?title=${encodeURIComponent(selectedJob.judulPosisi)}`}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl transition inline-flex items-center justify-center w-full gap-2 shadow-md shadow-red-100"
                >
                  Lamar Pekerjaan Ini
                </Link>
              </div>
            ) : (
              /* Formulir Lamar Cepat */
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl mb-8 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Formulir Lamaran Cepat</h3>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    Batal
                  </button>
                </div>

                {feedback && (
                  <div className={`p-4 rounded-xl text-sm mb-4 ${feedback.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
                    {feedback.msg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="lowonganId" value={selectedJob.id} />

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      name="namaLengkap" 
                      required 
                      placeholder="Contoh: Prabu Panedya" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kelas / Angkatan Alumni *</label>
                      <input 
                        type="text" 
                        name="kelasAlumni" 
                        required 
                        placeholder="Contoh: XII RPL 1 / Angkatan 30" 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="email@domain.com" 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500 bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Link Portfolio / CV (Google Drive, GitHub, LinkedIn) *</label>
                    <input 
                      type="url" 
                      name="portfolioUrl" 
                      required 
                      placeholder="https://..." 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pesan Tambahan (Opsional)</label>
                    <textarea 
                      name="pesanTambahan" 
                      rows={3} 
                      placeholder="Tuliskan perkenalan singkat Anda..." 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500 bg-white text-gray-900"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Mengirim..." : <>Kirim Lamaran <Send size={16} /></>}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Deskripsi Pekerjaan</h3>
                <p className="whitespace-pre-wrap text-sm text-gray-600">{selectedJob.deskripsi}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Syarat Keahlian</h3>
                <p className="whitespace-pre-wrap text-sm text-gray-600">{selectedJob.syaratKeahlian}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}