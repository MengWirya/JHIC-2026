import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import Image from 'next/image';
import Link from "next/link";
import IndustryFilters from "@/components/IndustryFilters";

export default async function CareerIndustriesPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || "";
  const tagQuery = resolvedParams.tag || "";

  // 1. Ambil semua Tag Jurusan dari database
  const availableTags = await prisma.tagJurusan.findMany({
    orderBy: { nama: "asc" }
  }).catch(() => []);

  // 2. Filter Perusahaan berdasarkan nama/overview DAN tag yang dipilih
  const companies = await prisma.perusahaan.findMany({
    where: {
      AND: [
        searchQuery ? {
          OR: [
            { nama: { contains: searchQuery } },
            { overview: { contains: searchQuery } }
          ]
        } : {},
        tagQuery ? {
          tags: {
            some: {
              tag: {
                nama: { equals: tagQuery }
              }
            }
          }
        } : {}
      ]
    },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { nama: "asc" },
  }).catch(() => []);

  return (
    <div className="native-page">
      <SiteHeader />
      
      <main className="pt-36 pb-32 bg-[#fafafa] min-h-screen">
        <div className="native-shell">
          
          {/* Header Section */}
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Career Industries
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Choose your path, build your future
            </p>
          </div>

          {/* Client Component Filter & Search */}
          <div className="mb-16">
            <IndustryFilters availableTags={availableTags} />
          </div>

          {/* Company Cards Grid */}
          {companies.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-xl mx-auto shadow-sm">
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Tidak ada industri yang cocok
              </p>
              <p className="text-sm text-gray-500">
                Coba ubah kata kunci pencarian atau pilih kategori tag yang lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <Link 
                  href={`/jobs/${company.id}`} 
                  key={company.id} 
                  className="group bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Logo */}
                  <div className="h-12 mb-5 relative flex items-center justify-start transition-transform duration-300 group-hover:scale-105">
                    {company.logoUrl ? (
                      <Image 
                        src={company.logoUrl} 
                        alt={`Logo ${company.nama}`} 
                        width={120} 
                        height={48} 
                        className="object-contain object-left max-h-12 w-auto" 
                      />
                    ) : (
                      <span className="text-red-600 font-extrabold text-3xl tracking-tighter">
                        {company.nama.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Nama & Overview */}
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200">
                    {company.nama}
                  </h3>
                  
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 flex-grow mb-4">
                    {company.overview}
                  </p>

                  {/* Badges Tag Jurusan di dalam Card */}
                  {company.tags && company.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {company.tags.map((pt) => (
                        <span 
                          key={pt.tagId} 
                          className="px-2.5 py-0.5 bg-red-50 text-red-600 text-[11px] font-semibold rounded-md border border-red-100"
                        >
                          {pt.tag.nama}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer CTA */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-end">
                    <span className="text-sm font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Daftar Sekarang <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
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