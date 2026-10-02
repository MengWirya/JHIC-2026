# Moklet Hub 2.0 — Setup Project

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Prisma 7 + MySQL/MariaDB + Auth.js + Anthropic/Gemini API

## 1. Setup Awal

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan:
- `DATABASE_URL` — koneksi MySQL lokal kalian (bisa pakai XAMPP/Docker untuk development)
- `AUTH_SECRET` — generate lewat `openssl rand -base64 32`
- `ADMIN_PASSWORD` — password admin development
- `AI_PROVIDER` — `anthropic` atau `gemini`
- `ANTHROPIC_API_KEY` atau `GEMINI_API_KEY` — sesuai provider yang dipilih

## 2. Setup Database

```bash
npx prisma generate      # generate Prisma Client dari schema.prisma
npm run db:migrate       # terapkan initial migration ke database kosong
npm run db:seed          # isi admin, FAQ, perusahaan, lowongan, dan data demo
# hard reset lokal (menghapus seluruh data)
npm run db:reset
```

> Perintah `prisma generate`/`migrate` butuh koneksi internet penuh untuk unduh
> query engine — jalankan ini di laptop kalian sendiri, bukan environment terbatas.

## 3. Seed Data Lokal

Database development menggunakan data bersih dari `prisma/seed.ts`; tidak ada migrasi runtime atau importer dari sistem CI3 lama.

```bash
npm run db:seed
```

## 4. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 5. Struktur Folder

```
src/
├── app/
│   ├── (public)/           # halaman publik native
│   ├── admin/               # login dan dashboard admin
│   ├── api/
│   │   ├── auth/[...nextauth]/  # login admin
│   │   ├── chatbot/         # endpoint MokletBot
│   │   └── lamaran/         # endpoint Lamar Cepat
│   ├── globals.css          # DESIGN TOKEN warna & font ada di sini
│   └── layout.tsx
├── components/               # komponen reusable (Card, Navbar, dll)
├── lib/
│   ├── prisma.ts            # koneksi database
│   └── auth.ts              # konfigurasi Auth.js
prisma/
├── schema.prisma            # schema native termasuk BKK
├── seed.ts                  # admin, FAQ, perusahaan, lowongan, demo
└── migrations/              # initial migration dari database kosong
tasks/                       # task handoff untuk pekerjaan tersisa
reference/                   # lokal/ignored: mirror dan visual reference
```

## 6. Batas Reference

Folder `reference/` berisi mirror HTML/CSS lama dan screenshot/PDF desain. Folder ini di-ignore Git dan tidak boleh dibaca oleh route runtime. Asset yang sudah disetujui untuk aplikasi harus disalin secara sadar ke `public/images/`.

## 7. Halaman Yang Sudah Tersedia

Homepage, Tentang Kami, Profil & Prestasi, Program, Alumni, Kontak, Berita, Career Industries, detail lowongan, login admin, dan dashboard lamaran sudah memiliki route native.

## 8. Pekerjaan Tersisa

Lihat task handoff di `tasks/todo-*.md`. Jangan membuat task baru tanpa memperbarui `MIGRATION-AUDIT.md`.
