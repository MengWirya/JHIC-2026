"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Upload, Briefcase, ArrowRight } from "lucide-react";
import { submitFullApplication } from "@/app/actions/submitFullApplication";
import { useRouter } from "next/navigation";

interface JobInfo {
  id: number;
  judulPosisi: string;
  perusahaanNama: string;
  perusahaanLogo?: string | null;
}

export default function ApplyJobMultiStep({ job }: { job: JobInfo }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // State Step 1: Data Diri
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [noTelp, setNoTelp] = useState("");

  // State Step 2: Status Akademik
  const [nisYayasan, setNisYayasan] = useState("");
  const [isNisVerified, setIsNisVerified] = useState(false);
  const [nisLoading, setNisLoading] = useState(false);
  const [statusPelamar, setStatusPelamar] = useState("Siswa aktif SMK Telkom Malang");
  const [jurusan, setJurusan] = useState("");
  const [tahunKelulusan, setTahunKelulusan] = useState("");

  // State Step 3: Portofolio & CV
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- VALIDASI TIAP STEP ---
  const isStep1Valid = namaLengkap.trim() !== "" && email.trim() !== "" && noTelp.trim() !== "";
  const isStep2Valid = isNisVerified && jurusan !== "" && tahunKelulusan !== "";
  const isStep3Valid = portfolioUrl.trim() !== "" && cvFileName !== "" && coverLetter.trim() !== "";

  // SIMULASI VERIFIKASI NIS YAYASAN
  const handleVerifyNis = () => {
    if (!nisYayasan.trim()) {
      alert("Masukkan NIS Yayasan terlebih dahulu!");
      return;
    }
    setNisLoading(true);
    setTimeout(() => {
      setNisLoading(false);
      setIsNisVerified(true); // NIS dianggap valid
    }, 800);
  };

  const handleSubmitAll = async () => {
    if (!isStep3Valid) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("lowonganId", job.id.toString());
    formData.append("namaLengkap", namaLengkap);
    formData.append("email", email);
    formData.append("noTelp", noTelp);
    formData.append("nisYayasan", nisYayasan);
    formData.append("statusPelamar", statusPelamar);
    formData.append("jurusan", jurusan);
    formData.append("tahunKelulusan", tahunKelulusan);
    formData.append("portfolioUrl", portfolioUrl);
    formData.append("coverLetter", coverLetter);

    const res = await submitFullApplication(formData);
    setIsSubmitting(false);

    if (res.success) {
      alert("Pendaftaran Berhasil Terkirim!");
      router.push(`/jobs/${job.id}`);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header Job Info Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center p-3 flex-shrink-0">
          {job.perusahaanLogo ? (
            <Image src={job.perusahaanLogo} alt="Logo" width={48} height={48} className="object-contain" />
          ) : (
            <Briefcase className="text-red-600 w-8 h-8" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.judulPosisi}</h1>
          <p className="text-gray-500 font-medium">{job.perusahaanNama}</p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-200 -z-0 -translate-y-1/2"></div>

        {/* Step 1 Circle */}
        <div className="relative z-10 bg-[#fafafa] px-3 flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 1 ? "bg-red-500 text-white shadow-md ring-4 ring-red-100" : "bg-gray-200 text-gray-500"}`}>
            {step > 1 ? "✓" : "1"}
          </div>
          <span className={`text-sm font-bold ${step === 1 ? "text-gray-900" : "text-gray-400"}`}>Data diri</span>
        </div>

        {/* Step 2 Circle */}
        <div className="relative z-10 bg-[#fafafa] px-3 flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 2 ? "bg-red-500 text-white shadow-md ring-4 ring-red-100" : "bg-gray-200 text-gray-500"}`}>
            {step > 2 ? "✓" : "2"}
          </div>
          <span className={`text-sm font-bold ${step === 2 ? "text-gray-900" : "text-gray-400"}`}>Status akademik</span>
        </div>

        {/* Step 3 Circle */}
        <div className="relative z-10 bg-[#fafafa] px-3 flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === 3 ? "bg-red-500 text-white shadow-md ring-4 ring-red-100" : "bg-gray-200 text-gray-500"}`}>
            3
          </div>
          <span className={`text-sm font-bold ${step === 3 ? "text-gray-900" : "text-gray-400"}`}>Portofolio</span>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        
        {/* STEP 1: DATA DIRI */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nama lengkap <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={namaLengkap} 
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Isi nama lengkap anda" 
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Isi email anda disini" 
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nomor telepon <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                value={noTelp} 
                onChange={(e) => setNoTelp(e.target.value)}
                placeholder="Isi nomor telepon anda disini" 
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-full border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STATUS AKADEMIK */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                NIS Yayasan <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={nisYayasan} 
                  onChange={(e) => { setNisYayasan(e.target.value); setIsNisVerified(false); }}
                  placeholder="NIS yayasan yang anda miliki" 
                  className="flex-grow px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyNis}
                  disabled={isNisVerified || nisLoading}
                  className={`px-6 py-3.5 rounded-xl border-2 font-bold transition-all text-sm ${isNisVerified ? "border-green-500 text-green-600 bg-green-50" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                >
                  {nisLoading ? "..." : isNisVerified ? "Terverifikasi ✓" : "Verifikasi"}
                </button>
              </div>
              {!isNisVerified && <p className="text-xs text-red-500 mt-1">* Wajib melakukan verifikasi NIS Yayasan</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Status pelamar</label>
              <div className="space-y-3">
                {["Siswa aktif SMK Telkom Malang", "Alumni siswa SMK Telkom Malang"].map((st) => (
                  <label key={st} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={statusPelamar === st} 
                      onChange={() => setStatusPelamar(st)}
                      className="w-4 h-4 accent-red-500" 
                    />
                    <span className="text-sm font-medium text-gray-800">{st}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Jurusan <span className="text-red-500">*</span>
              </label>
              <select 
                value={jurusan} 
                onChange={(e) => setJurusan(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Pilih jurusan anda</option>
                <option value="Rekayasa Perangkat Lunak (RPL)">Rekayasa Perangkat Lunak (RPL)</option>
                <option value="Teknik Komputer dan Jaringan (TKJ)">Teknik Komputer dan Jaringan (TKJ)</option>
                <option value="Pengembangan Gim (PG)">Pengembangan Gim (PG)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tahun kelulusan <span className="text-red-500">*</span>
              </label>
              <select 
                value={tahunKelulusan} 
                onChange={(e) => setTahunKelulusan(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Tahun kelulusan</option>
                {["2024", "2025", "2026", "2027", "2028"].map((th) => (
                  <option key={th} value={th}>{th}</option>
                ))}
              </select>
            </div>

            <div className="pt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-gray-800">
                Kembali
              </button>
              <button
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-full border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PORTOFOLIO & CV */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Posisi yang dilamar <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                readOnly 
                value={job.judulPosisi}
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-700 font-medium outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Portofolio / Karya <span className="text-red-500">*</span>
              </label>
              <input 
                type="url" 
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="Link portofolio/karya yang anda miliki" 
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                CV / Resume <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-xl">
                <label className="bg-white text-cyan-600 font-semibold px-4 py-2.5 rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Upload size={16} /> Unggah File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setCvFileName(e.target.files?.[0]?.name || "")}
                  />
                </label>
                <span className="text-sm text-gray-500 truncate">
                  {cvFileName || "Tidak Ada File Terpilih"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Jelaskan keahlian atau motivasi anda melamar ke perusahaan ini" 
                className="w-full px-5 py-3.5 bg-gray-100 rounded-xl border-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            <div className="pt-6 flex justify-between items-center">
              <button onClick={() => setStep(2)} className="text-sm font-bold text-gray-500 hover:text-gray-800">
                Kembali
              </button>
              <button
                disabled={!isStep3Valid || isSubmitting}
                onClick={handleSubmitAll}
                className="px-10 py-3.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}