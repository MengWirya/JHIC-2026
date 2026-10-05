"use client";

import { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitApplication, verifyNisYayasan } from "@/app/jobs/apply/actions";
import { Check, Upload, FileText, X } from "lucide-react";

export default function JobApplyMultiStepPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ success: boolean; text: string } | null>(null);

  const resolvedParams = "then" in params ? use(params) : params;
  const lowonganId = resolvedParams?.id || "";
  const jobTitle = searchParams.get("title") || "Network Support PKL";
  const companyName = searchParams.get("company") || "PT Jagoan Intermedia";

  // Step State: 1 = Data Diri, 2 = Status Akademik, 3 = Portofolio
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Tahap 1: Data Diri
    namaLengkap: "",
    email: "",
    nomorTelepon: "",

    // Tahap 2: Status Akademik
    nisYayasan: "",
    isVerifiedNis: false,
    statusPelamar: "Siswa SMK Telkom Malang",
    jurusan: "Rekayasa Perangkat Lunak (RPL)",
    tahunKelulusan: "2026",

    // Tahap 3: Portofolio & Cover Letter
    portfolioUrl: "",
    coverLetter: "",
  });

  // State Khusus Upload File CV
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler Pilihan File CV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validasi ukuran file (maksimal 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage("Ukuran file CV melebihi batas maksimal 10MB.");
        return;
      }

      setCvFile(selectedFile);
      setErrorMessage("");
    }
  };

  // Fungsi Verifikasi NIS Yayasan
  const handleVerifyNis = async () => {
    if (!formData.nisYayasan.trim()) {
      setVerifyMessage({ success: false, text: "Masukkan NIS Yayasan terlebih dahulu." });
      return;
    }

    setIsVerifying(true);
    setVerifyMessage(null);

    try {
      const res = await verifyNisYayasan(formData.nisYayasan);
      setIsVerifying(false);

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          isVerifiedNis: true,
          namaLengkap: prev.namaLengkap || res.siswa?.nama || "",
          jurusan: res.siswa?.jurusan || prev.jurusan,
        }));
        setVerifyMessage({ success: true, text: `✓ ${res.message} (${res.siswa?.nama})` });
        setErrorMessage("");
      } else {
        setFormData((prev) => ({ ...prev, isVerifiedNis: false }));
        setVerifyMessage({ success: false, text: res.message });
      }
    } catch (err) {
      console.error("Error verifyNisYayasan:", err);
      setIsVerifying(false);
      setVerifyMessage({ success: false, text: "Gagal memverifikasi NIS. Silakan coba lagi." });
    }
  };

  // Navigasi Next Step
  const handleNext = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      if (!formData.namaLengkap || !formData.email || !formData.nomorTelepon) {
        setErrorMessage("Mohon lengkapi seluruh Data Diri Anda.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.nisYayasan) {
        setErrorMessage("NIS Yayasan wajib diisi.");
        return;
      }
      if (!formData.isVerifiedNis) {
        setErrorMessage("Silakan verifikasi NIS Yayasan Anda terlebih dahulu sebelum melanjutkan.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  // Navigasi Prev Step
  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 🟢 HANDLER SUBMIT FINAL YANG LENGKAP & AMAN
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.portfolioUrl) {
      setErrorMessage("Link Portofolio wajib diisi.");
      return;
    }

    const numericLowonganId = parseInt(lowonganId, 10);
    if (!lowonganId || isNaN(numericLowonganId) || numericLowonganId <= 0) {
      setErrorMessage("ID Lowongan tidak valid. Silakan akses form dari daftar lowongan.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. DEKLARASI DULU dataToSend DI SINI
      const dataToSend = new FormData();

      // 2. MASUKKAN DATA TEKS
      dataToSend.append("lowonganId", numericLowonganId.toString());
      dataToSend.append("namaLengkap", formData.namaLengkap);
      dataToSend.append("email", formData.email);
      dataToSend.append("kelasAlumni", `${formData.jurusan} (${formData.tahunKelulusan})`);
      dataToSend.append("portfolioUrl", formData.portfolioUrl);
      dataToSend.append("pesanTambahan", formData.coverLetter);

      // 3. MASUKKAN FILE CV JIKA ADA
      if (cvFile) {
        dataToSend.append("cvFile", cvFile);
      }

      // 4. MENGIRIM KE SERVER ACTION
      const result = await submitApplication(null, dataToSend);

      setIsSubmitting(false);

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.push("/jobs/apply/success");
      }
    } catch (err) {
      console.error("Fetch submission error:", err);
      setIsSubmitting(false);
      setErrorMessage(
        "Gagal terhubung ke server database. Pastikan koneksi MySQL & Prisma dev server berjalan."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 md:py-16 px-4 md:px-12 lg:px-20 font-sans flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 md:p-14 lg:p-16">
        
        {/* Header Job Info */}
        <div className="flex items-center gap-5 pb-8 mb-10 border-b border-gray-100">
          <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            ji
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{jobTitle}</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">{companyName}</p>
          </div>
        </div>

        {/* STEPPER INDICATOR */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-6 left-8 right-8 h-[2px] bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-6 left-8 h-[2px] bg-red-600 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out"
              style={{
                width:
                  currentStep === 1
                    ? "0%"
                    : currentStep === 2
                    ? "50%"
                    : "calc(100% - 64px)",
              }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm ${
                  currentStep >= 1
                    ? "bg-red-600 text-white ring-4 ring-red-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 1 ? <Check size={22} strokeWidth={3} /> : "1"}
              </div>
              <span
                className={`text-sm font-bold mt-3 transition-colors ${
                  currentStep >= 1 ? "text-gray-900" : "text-gray-400"
                }`}
              >
                Data diri
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm ${
                  currentStep >= 2
                    ? "bg-red-600 text-white ring-4 ring-red-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 2 ? <Check size={22} strokeWidth={3} /> : "2"}
              </div>
              <span
                className={`text-sm font-bold mt-3 transition-colors ${
                  currentStep >= 2 ? "text-gray-900" : "text-gray-400"
                }`}
              >
                Status akademik
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm ${
                  currentStep >= 3
                    ? "bg-red-600 text-white ring-4 ring-red-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-bold mt-3 transition-colors ${
                  currentStep >= 3 ? "text-gray-900" : "text-gray-400"
                }`}
              >
                Portofolio
              </span>
            </div>
          </div>
        </div>

        {/* Alert Error */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Content Form */}
        <div className="max-w-3xl mx-auto">
          {/* TAHAP 1: DATA DIRI */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Nama lengkap *
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  placeholder="Isi nama lengkap anda"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Isi email anda disini"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Nomor telepon *
                </label>
                <input
                  type="tel"
                  name="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={handleInputChange}
                  placeholder="Isi nomor telepon anda disini"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div className="pt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3 border border-red-500 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 2: STATUS AKADEMIK */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  NIS Yayasan *
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="nisYayasan"
                    value={formData.nisYayasan}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData((prev) => ({ ...prev, isVerifiedNis: false }));
                      setVerifyMessage(null);
                    }}
                    placeholder="Contoh: 1234/567"
                    className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyNis}
                    disabled={isVerifying}
                    className={`px-8 py-3.5 border font-bold text-sm rounded-xl transition shadow-sm ${
                      formData.isVerifiedNis
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "border-red-500 text-red-600 hover:bg-red-50"
                    } disabled:opacity-50`}
                  >
                    {isVerifying ? "Cek..." : formData.isVerifiedNis ? "Terverifikasi ✓" : "Verifikasi"}
                  </button>
                </div>

                {verifyMessage && (
                  <p
                    className={`text-xs font-bold mt-2.5 ${
                      verifyMessage.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {verifyMessage.text}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Status pelamar *
                </label>
                <div className="space-y-3 text-sm font-semibold text-gray-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="statusPelamar"
                      value="Siswa SMK Telkom Malang"
                      checked={formData.statusPelamar === "Siswa SMK Telkom Malang"}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-red-600"
                    />
                    Siswa aktif SMK Telkom Malang
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="statusPelamar"
                      value="Alumni SMK Telkom Malang"
                      checked={formData.statusPelamar === "Alumni SMK Telkom Malang"}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-red-600"
                    />
                    Alumni siswa SMK Telkom Malang
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Jurusan *
                </label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                >
                  <option value="Rekayasa Perangkat Lunak (RPL)">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Teknik Komputer dan Jaringan (TKJ)">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="Pengembangan Gim (PG)">Pengembangan Gim (PG)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Tahun kelulusan *
                </label>
                <select
                  name="tahunKelulusan"
                  value={formData.tahunKelulusan}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="pt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-800 transition"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3 border border-red-500 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 3: PORTOFOLIO & COVER LETTER */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmitFinal} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Posisi yang dilamar *
                </label>
                <input
                  type="text"
                  disabled
                  value={jobTitle}
                  className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Portofolio / Karya *
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="Link portofolio/karya yang anda miliki"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              {/* FITUR UPLOAD FILE REAL */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  CV / Resume (Opsional)
                </label>
                
                {cvFile ? (
                  <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cvFile.name}</p>
                        <p className="text-xs text-gray-500">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition"
                      title="Hapus File"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl relative">
                    <label className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer">
                      <Upload size={15} /> Unggah file
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-400">PDF / DOCX, Maksimal 10MB</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Cover Letter (Pesan Tambahan)
                </label>
                <textarea
                  name="coverLetter"
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Jelaskan keahlian atau motivasi anda melamar ke perusahaan ini"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none transition"
                />
              </div>

              <div className="pt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-800 transition"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-200 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}