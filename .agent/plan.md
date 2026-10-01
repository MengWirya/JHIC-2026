
# Plan.md — Moklet Hub 2.0

**Target akhir:** Final Day, 17 Oktober 2026, Yogyakarta
**Prinsip:** Setiap task di sini mengarah ke fitur yang sudah dijanjikan di Pitch Deck (Landing Page, Career Industries, MokletBot, PPDB-link-only, BLUD/Prestasi via UI/UX). Jangan tambah scope baru yang tidak ada di deck.

## Status Saat Ini

- [X] Project Next.js (TypeScript + Tailwind v4 + Prisma) sudah di-scaffold
- [X] Skema database Prisma sudah ditulis (9 model jika seluruh model ikut dihitung: Admin, Konten, Perusahaan, TagJurusan, PerusahaanTag, Testimoni, Faq, ChatLog, PesanMasuk)
- [X] Auth.js (Credentials provider) sudah dikonfigurasi di source code; alur login dan proteksi route masih perlu diverifikasi
- [X] API route `/api/chatbot` (MokletBot) sudah ditulis; koneksi database, FAQ, dan Anthropic API key masih perlu diverifikasi
- [X] Halaman Career Industries — query + filter tag awal sudah ada, tetapi masih berupa prototype visual
- [X] Ekstraksi HTML/CSS/gambar dari website lama (via wget) sudah dimigrasikan sebagian

- [~] Design token (warna/font) dan native landing page sudah mulai diisi — responsive pass dan **bug penumpukan teks** diselesaikan di Fase 5, bukan lewat koneksi langsung ke HTML/CSS lama

---

## Fase 1 — Fondasi Data (Prioritas Tertinggi, blocking fase lain)

*Pemilik utama: Backend & Infrastructure Dev*

- [ ] Setup MySQL lokal (XAMPP/Docker), isi `.env`
- [ ] `npx prisma generate` + `npx prisma migrate dev` di komputer dengan internet penuh
- [ ] Buat `prisma/seed.ts`:
  - [ ] Seed 1 akun Admin (password di-hash pakai bcryptjs)
  - [ ] Seed 22 FAQ dari hasil audit konten (basis pengetahuan MokletBot)
  - [ ] Seed beberapa `TagJurusan` (Fullstack Dev, Backend Dev, Cloud Computing, Cyber Security, dst — sesuai keputusan rebranding Career Industries)
  - [ ] Seed 3-5 `Perusahaan` contoh (bisa data dummy realistis dulu, diganti data mitra asli kalau sudah didapat dari sekolah)
- [ ] Jalankan `npx prisma db seed`, verifikasi data masuk lewat Prisma Studio (`npx prisma studio`)

## Fase 2 — Landing Page

*Pemilik utama: UI/UX & Frontend Dev, dibantu Copywriter untuk isi teks*

- [ ] Hero section (tagline "School of Global Digitalent")
- [ ] Section 3 program keahlian (RPL, TKJ, Pengembangan Gim)
- [ ] Showcase Prestasi — grid/timeline dari tabel `Konten` tipe `PRESTASI` (ini jawaban untuk gap "Prestasi tersebar tanpa kurasi" dari audit)
- [ ] Showcase Mitra Industri — logo grid (jawaban untuk gap "Hubungan Industri tanpa bukti visual")
- [ ] Section Promosi BLUD — render dari `Konten` tipe `BLUD` (fitur wajib yang dilebur ke UI/UX, bukan halaman terpisah)
- [ ] Testimoni alumni
- [ ] CTA PPDB — **cuma tombol/link keluar ke domain PPDB existing**, jangan buat form baru (sudah diputuskan tidak dipindah)
- [ ] Widget MokletBot muncul di landing page (lihat Fase 3)

## Fase 3 — MokletBot (Frontend)

*Pemilik utama: UI/UX & Frontend Dev*

- [ ] Komponen widget chat (floating button pojok kanan bawah + jendela chat)
- [ ] Hubungkan ke `/api/chatbot` yang sudah ada
- [ ] Quick-reply buttons: "Info PPDB 2026", "Lowongan BKK", "Daftar Jurusan" (sesuai yang sudah ditunjukkan di prototipe demo)
- [ ] State loading/typing indicator sederhana
- [ ] Tempatkan widget di root layout (`src/app/layout.tsx`) supaya muncul di semua halaman

## Fase 4 — Career Industries & Admin Panel

*Pemilik utama: Backend & Infrastructure Dev*

- [ ] Lengkapi halaman Career Industries (sudah ada contoh) — tambahkan empty state, loading state
- [ ] Halaman Tentang Kami — konsolidasi Profil Sekolah + Visi Misi + Struktur Organisasi + Akreditasi jadi 1 halaman (tab/accordion)
- [ ] Halaman login admin (`/admin/login`) pakai Auth.js yang sudah dikonfigurasi
- [ ] Middleware proteksi — semua route `/admin/*` wajib login
- [ ] Dashboard admin — CRUD:
  - [ ] `Konten` (Prestasi/Berita/BLUD/Galeri) — satu form, dropdown pilih tipe
  - [ ] `Perusahaan` + assign `TagJurusan` + `Testimoni`
  - [ ] `Faq` (supaya basis pengetahuan MokletBot bisa diupdate tanpa redeploy)
  - [ ] Lihat daftar `PesanMasuk` (gabungan Kotak Pertanyaan + Layanan Orang Tua)

## Fase 5 — Perbaikan Visual & Performance

*Pemilik utama: UI/UX & Frontend Dev*
*(Sesuai arahan: dikerjakan di akhir, setelah fitur inti jalan)*

- [ ] **Perbaiki bug penumpukan teks** dari hasil migrasi CSS ekstraksi
- [ ] Pastikan breakpoint tablet (768px-1024px) tidak ada elemen menumpuk (bug yang sama ditemukan di web lama — jangan sampai terulang)
- [ ] Ganti semua `<img>` ke `next/image`
- [ ] Font lewat `next/font` (Google Font kalau terkonfirmasi, atau font system fallback)
- [ ] Tambahkan Metadata API per halaman (title, description, Open Graph)
- [ ] Buat redirect map URL lama → baru di `next.config.js` (jaga SEO yang sudah bagus, skor 90/82)
- [ ] Jalankan `npm run build && npm run start`, audit Lighthouse — bandingkan dengan skor lama (52/26)

## Fase 6 — Deployment ke VPS

*Pemilik utama: DevOps & Performance Engineer*

- [ ] Setup VPS: Node (nvm), MySQL, Nginx, PM2
- [ ] `.env.production` dengan credential asli
- [ ] `npx prisma migrate deploy` di server
- [ ] `npm run build` + `pm2 start npm --name moklet-hub -- start`
- [ ] Konfigurasi Nginx reverse proxy (port 3000 → 80/443)
- [ ] SSL via Certbot
- [ ] **Backup penuh konten lama sebelum DNS cutover** (jaring pengaman)
- [ ] DNS cutover ke VPS baru
- [ ] Verifikasi semua CTA/fitur jalan normal di domain produksi

## Fase 7 — QA Akhir & Kesiapan Kompetisi

*Pemilik utama: semua role, koordinasi Copywriter & Digital Business*

- [ ] Perbaiki typo nama tim di Pitch Deck: "PW:MokletHebat2021" → "PW_MokletHebat2026"
- [ ] Checklist fungsional end-to-end: submit form kontak, MokletBot jawab FAQ dengan benar, filter Career Industries jalan, semua link navigasi tidak ada yang 404
- [ ] Final Lighthouse check (Desktop & Mobile)
- [ ] Update QR code demo di Pitch Deck kalau URL berubah
- [ ] Latihan naskah presentasi (naskah v2 sudah ada) dengan stopwatch
- [ ] Siapkan hotspot cadangan untuk demo live saat Final Day

---

## Catatan Prioritas

Kalau waktu mepet menjelang Final Day, urutan yang **boleh dikorbankan lebih dulu** (dari yang paling aman dipotong ke paling tidak boleh dipotong):

1. Polish visual non-kritis (animasi, micro-interaction)
2. CI/CD otomatis (deploy manual dulu tidak masalah)
3. Admin panel untuk `PesanMasuk` (bisa cek langsung lewat Prisma Studio sementara)
4. ~~Fitur inti (Landing Page, Career Industries, MokletBot)~~ — **tidak boleh dipotong**, ini yang dijanjikan ke juri di Pitch Deck
