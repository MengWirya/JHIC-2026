"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  FileText, 
  GraduationCap, 
  LogOut 
} from "lucide-react";

// Wajib menggunakan 'export default' di sini!
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Lowongan Kerja", href: "/admin/dashboard/jobs", icon: Briefcase },
    { name: "Mitra Perusahaan", href: "/admin/dashboard/companies", icon: Building2 },
    { name: "Data Lamaran", href: "/admin/dashboard/applications", icon: FileText },
    { name: "Data Siswa & NIS", href: "/admin/dashboard/students", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* SIDEBAR UTAMA */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex sticky top-0 h-screen flex-shrink-0 z-30">
        <div>
          {/* Logo Brand Admin */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-red-200">
                M
              </div>
              <div>
                <strong className="block text-gray-900 font-extrabold text-sm leading-tight">Moklet BKK</strong>
                <span className="text-[11px] text-gray-400 font-medium">Admin Control Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigasi Menu Admin */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-xl text-sm transition"
          >
            <LogOut size={18} />
            Keluar ke Portal
          </Link>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-lg font-bold text-gray-900">Portal BKK SMK Telkom Malang</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-600 rounded-full">
              Super Admin
            </span>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}