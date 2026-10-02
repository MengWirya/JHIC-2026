"use client";

import { ArrowUpRight, Camera, Globe2, Menu, MessageCircle, Video, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Program", href: "/program" },
  { label: "Alumni", href: "/alumni" },
  { label: "Hubungi Kami", href: "/kontak" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/smktelkommalang", icon: Globe2 },
  { label: "Instagram", href: "https://www.instagram.com/smktelkommalang", icon: Camera },
  { label: "Twitter", href: "https://twitter.com/smktelkommlg", icon: MessageCircle },
  { label: "YouTube", href: "https://www.youtube.com/@smktelkommalang", icon: Video },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="SMK Telkom Malang">
          <Image src="/images/logo/logo_putih.png" alt="SMK Telkom Malang" width={154} height={53} priority />
        </Link>

        <button
          className="site-header__toggle"
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`site-header__nav${isOpen ? " is-open" : ""}`} aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="site-header__socials" aria-label="Media sosial">
            {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon size={15} /></a>)}
          </div>
          <div className="site-header__ctas">
            <a className="site-header__cta" href="https://ppdb.telkomschools.sch.id/signup?lemdik=51" target="_blank" rel="noreferrer">PPDB <ArrowUpRight size={15} /></a>
            <a className="site-header__cta site-header__cta--secondary" href="https://mikrotikacademy.telkomschools.sch.id/" target="_blank" rel="noreferrer">MikroTik Academy <ArrowUpRight size={15} /></a>
          </div>
        </nav>
      </div>
    </header>
  );
}
