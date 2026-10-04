"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState } from "react";

interface Tag {
  id: number;
  nama: string;
}

export default function IndustryFilters({ availableTags }: { availableTags: Tag[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Fungsi untuk memperbarui query string di URL
  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", searchTerm);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-center bg-[#E53935] rounded-full px-8 py-5 shadow-lg transition-all focus-within:shadow-xl focus-within:scale-[1.01]">
          <Search className="text-white w-7 h-7 mr-4 opacity-90" />
          <input 
            type="text" 
            placeholder="Search Industries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white placeholder:text-red-100 w-full text-lg md:text-xl font-medium"
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => {
                setSearchTerm("");
                handleFilterChange("search", null);
              }}
              className="text-white/80 hover:text-white ml-2"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Tag Pills */}
      <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
        {/* Button 'Semua' */}
        <button
          onClick={() => handleFilterChange("tag", null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
            !currentTag 
              ? "bg-[#E53935] text-white border-[#E53935] shadow-sm" 
              : "border-[#E53935] text-[#E53935] hover:bg-red-50"
          }`}
        >
          Semua
        </button>

        {availableTags.map((tag) => {
          const isActive = currentTag === tag.nama;
          return (
            <button 
              key={tag.id}
              onClick={() => handleFilterChange("tag", isActive ? null : tag.nama)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                isActive 
                  ? "bg-[#E53935] text-white border-[#E53935] shadow-md scale-105" 
                  : "border-[#E53935] text-[#E53935] hover:bg-red-50"
              }`}
            >
              {tag.nama}
            </button>
          );
        })}
      </div>

      {/* Indikator Loading saat filter diproses */}
      {isPending && (
        <p className="text-center text-xs text-red-600 font-medium animate-pulse">
          Mencari industri...
        </p>
      )}
    </div>
  );
}