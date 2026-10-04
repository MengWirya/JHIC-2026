import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, CheckCircle, Briefcase } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import JobListings from "@/components/JobListings"; 

export default async function CompanyProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const companyId = parseInt(resolvedParams.id, 10);

  if (isNaN(companyId)) {
    notFound();
  }

  // Mengambil data Perusahaan beserta Lowongan kerja aslinya dari Prisma
  const company = await prisma.perusahaan.findUnique({
    where: { id: companyId },
    include: {
      lowongan: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="native-page bg-[#f8f9fa]">
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-50 [&_*]:!text-gray-800">
        <SiteHeader />
      </div>

      <main className="min-h-screen pb-24">
        {/* Banner Section */}
        <div className="h-64 md:h-80 w-full bg-gray-200 relative overflow-hidden">
          <Image 
            src="/images/site/image_depan_new.png" 
            alt="Company Banner"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* Company Header Info */}
        <div className="max-w-7xl mx-auto px-6 relative -mt-16 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center p-4 shadow-sm border border-gray-100 flex-shrink-0">
              {company.logoUrl ? (
                <Image src={company.logoUrl} alt="Logo" width={80} height={80} className="object-contain" />
              ) : (
                <Briefcase className="text-red-500 w-12 h-12" />
              )}
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{company.nama}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><MapPin size={16} /> Malang, Jawa Timur, Indonesia</span>
                <span className="flex items-center gap-1"><Briefcase size={16} /> Web Hosting & Cloud Services</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle size={16} /> Verified 23 October 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Kolom Info Perusahaan */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Tentang Perusahaan</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{company.overview || "Perusahaan teknologi terkemuka."}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Kultur & Teknologi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Kami menumbuhkan lingkungan kerja yang dinamis, kolaboratif, dan inovatif.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Peluang Bersama Kami</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Sebagai mitra strategis, kami memiliki komitmen kuat untuk menjembatani dunia pendidikan dan industri.</p>
          </div>
        </div>

        {/* Mengoper data lowongan asli dari Prisma ke Client Component */}
        <JobListings company={company} jobs={company.lowongan} />

      </main>

      <footer className="native-footer">
        <div className="native-shell">
          <strong>SMK Telkom Malang</strong>
          <span>School of Global Digitalent</span>
          <small>© 2026 SMK Telkom Malang</small>
        </div>
      </footer>
    </div>
  );
}