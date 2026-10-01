# Moklet Hub 2.0 — Setup Project

Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Prisma + MySQL + Auth.js + Claude API

## 1. Setup Awal

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan:
- `DATABASE_URL` — koneksi MySQL lokal kalian (bisa pakai XAMPP/Docker untuk development)
- `AUTH_SECRET` — generate lewat `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` — dari [console.anthropic.com](https://console.anthropic.com)

## 2. Setup Database

```bash
npx prisma generate      # generate Prisma Client dari schema.prisma
npx prisma migrate dev   # bikin tabel di database lokal sesuai skema ERD
```

> Perintah `prisma generate`/`migrate` butuh koneksi internet penuh untuk unduh
> query engine — jalankan ini di laptop kalian sendiri, bukan environment terbatas.

## 3. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 4. Struktur Folder

```
src/
├── app/
│   ├── (public)/           # halaman publik (landing, career-industries, tentang-kami)
│   ├── admin/               # dashboard admin (CRUD konten, perusahaan, dll)
│   ├── api/
│   │   ├── auth/[...nextauth]/  # login admin
│   │   └── chatbot/         # endpoint MokletBot
│   ├── globals.css          # DESIGN TOKEN warna & font ada di sini
│   └── layout.tsx
├── components/               # komponen reusable (Card, Navbar, dll)
├── lib/
│   ├── prisma.ts            # koneksi database
│   └── auth.ts              # konfigurasi Auth.js
prisma/
└── schema.prisma            # skema database (7 tabel sesuai ERD)
```

## 5. Mengintegrasikan Hasil Ekstraksi Desain dari Website Lama

Tergantung bentuk file yang kalian punya:

- **Kalau dapat file CSS/HTML mentah** → buka file-nya, cari nilai warna (`color:`, `background:`) dan font (`font-family:`) yang paling sering dipakai di header/tombol utama, lalu ganti placeholder di `src/app/globals.css` (bagian `:root`, ada komentar `TODO` yang jelas).
- **Kalau dapat kumpulan gambar** → taruh di folder `public/images/`, lalu referensikan lewat `next/image` di komponen terkait.
- **Kalau dapat file Figma (dari html.to.design)** → buka di Figma, pakai sebagai referensi visual saat membangun komponen React — tidak perlu import otomatis, cukup dicontek manual layout/spacing-nya.

## 6. Halaman Contoh yang Sudah Berfungsi

`src/app/(public)/career-industries/page.tsx` sudah berisi contoh nyata:
query Prisma ke database, filter berdasarkan tag jurusan, render card grid.
Pakai ini sebagai referensi pola untuk halaman lain (Landing Page, Tentang Kami, dst).

## 7. Yang Masih Perlu Dibangun

- [ ] Halaman Landing Page (`src/app/page.tsx` masih default dari create-next-app)
- [ ] Halaman Tentang Kami (folder sudah ada, kosong)
- [ ] Dashboard admin + form CRUD (Konten, Perusahaan, Testimoni, FAQ)
- [ ] Widget chat MokletBot di frontend (API route sudah jadi di `/api/chatbot`)
- [ ] Seed data awal (`prisma/seed.ts`) dari hasil audit konten yang sudah kita kerjakan
- [ ] Ganti placeholder warna/font di `globals.css` dengan hasil ekstraksi asli
