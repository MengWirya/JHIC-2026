"use client";

import { ArrowUpRight, Camera, ChevronDown, Globe2, Menu, MessageCircle, Video, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // <-- Tambahan hook dari Next.js

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami", items: [{ label: "Profil & Prestasi", href: "/profil-prestasi" }, { label: "Hubungi Kami", href: "/kontak" }] },
  { label: "Program", href: "/program", items: [{ label: "Program Keahlian", href: "/program" }] },
  { label: "Career Industries", href: "/career-industries", items: [{ label: "List Industries", href: "/career-industries" }, { label: "Lamar Cepat", href: "/career-industries#lamar" }] },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: Globe2 },
  { label: "Instagram", href: "https://www.instagram.com/smktelkommalang/", icon: Camera },
  { label: "Twitter", href: "#", icon: MessageCircle },
  { label: "YouTube", href: "https://www.youtube.com/@SMKTelkomMalangOfficial", icon: Video },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Mendapatkan path URL saat ini (misal: "/" atau "/career-industries")
  const pathname = usePathname(); 

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // LOGIKA CERDAS: Navbar "Solid" (latar terang) aktif jika:
  // 1. Sedang BUKAN di beranda (pathname !== "/"), ATAU
  // 2. Sedang di beranda tapi user sudah scroll ke bawah (isScrolled)
  const isSolid = pathname !== "/" || isScrolled;

  return (
    <header className={`site-header${isSolid ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="SMK Telkom Malang">
          {/* LOGO DINAMIS: Otomatis berubah berdasarkan background */}
          <Image 
            src={isSolid ? "/images/logo/logo_hitam.png" : "/images/logo/logo_putih.png"} 
            alt="SMK Telkom Malang" 
            width={154} 
            height={53} 
            priority 
          />
        </Link>

        <button
          className={`site-header__toggle ${isSolid ? "text-gray-900" : "text-white"}`}
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`site-header__nav${isOpen ? " is-open" : ""}`} aria-label="Navigasi utama">
          {navigation.map((item) => (
            <div className={`site-header__menu${item.items ? " has-submenu" : ""}`} key={item.href}>
              <Link 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={isSolid ? "text-gray-800 hover:text-red-600 font-semibold" : ""}
              >
                {item.label}{item.items && <ChevronDown size={14} />}
              </Link>
              {item.items && (
                <div className="site-header__submenu">
                  {item.items.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href} onClick={() => setIsOpen(false)}>
                      {subItem.label}<ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="site-header__socials" aria-label="Media sosial">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noreferrer" 
                aria-label={label} 
                title={label}
                className={isSolid ? "text-gray-800 hover:text-red-600" : ""}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
          
          <div className="site-header__ctas">
            <a className="site-header__cta" href="https://ppdb.telkomschools.sch.id/" target="_blank" rel="noreferrer">
              Daftar PPDB 2026 <ArrowUpRight size={15} />
            </a>
            <a className="site-header__cta site-header__cta--secondary" href="https://www.smktelkom-mlg.sch.id/p/about-mikrotik-academy-program.html" target="_blank" rel="noreferrer">
              MikroTik Academy <ArrowUpRight size={15} />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}