# Moklet Hub 2.0 - Migration Audit

Tanggal audit: 2026-10-02
Target: website native Next.js untuk SMK Telkom Malang dan demo final JHIC 2.0.

## 1. Baseline Dan Batasan

- Framework aktif: Next.js 16, React 19, TypeScript, Tailwind CSS v4.
- Database: Prisma 7 dengan MySQL/MariaDB adapter.
- Auth: Auth.js Credentials.
- Reference legacy: tersimpan lokal di `reference/` dan di-ignore Git.
- Reference tidak boleh diimport, dibaca filesystem-nya, atau dirender oleh `src/` saat request.
- PPDB tetap external link ke `https://ppdb.telkomschools.sch.id/`.
- BKK/Career Industries adalah sistem native independen dan tidak menggunakan API CI3.
- Deployment Webuzo/VPS ditunda sampai akses infrastructure diberikan.

## 2. Yang Sudah Selesai

### Arsitektur Dan Repository

- Legacy bridge dan catch-all route sudah dihapus.
- CSS legacy tidak lagi dimuat oleh halaman aktif.
- Asset legacy dan desain root dipindahkan ke `reference/`.
- `reference/` di-ignore Git agar mirror HTML, CSS, PDF, dan screenshot tidak membebani repository.
- Header native memiliki responsive menu, dropdown hover, sosial media, CTA PPDB, dan MikroTik Academy.

### Public UI

- Homepage native dengan hero, program RPL/TKJ/GIM, CTA PPDB, dan MokletBot floating.
- Halaman Tentang Kami.
- Halaman Profil & Prestasi native berbasis Prisma.
- Portal Career Industries dengan hero, partner list, filter PKL/Magang/Full-Time, kartu lowongan, detail posisi, dan Lamar Cepat.
- Halaman berita listing dan detail berbasis slug Prisma.
- Halaman Program, Alumni, dan Kontak.

### Data Dan API

- Initial Prisma migration dibuat dari database kosong.
- Model BKK: `Lowongan`, `Lamaran`, `Perusahaan`, dan tag terkait.
- Seed idempoten tersedia di `prisma/seed.ts`.
- Seed berisi Super Admin, FAQ resmi awal, perusahaan, lowongan, berita, dan lamaran demo.
- API `/api/lamaran` dan `/api/pesan` tersedia.
- MokletBot mendukung provider Anthropic atau Gemini melalui `AI_PROVIDER`.

### Validasi Yang Sudah Dilakukan

- `npm run lint` lulus.
- `npx tsc --noEmit --incremental false` lulus.
- `npx prisma validate` lulus.
- `npm run build` lulus.
- Production build tidak menghasilkan route catch-all legacy.

## 3. Pekerjaan Yang Belum Selesai

Urutan kerja dan kebutuhan tiap pekerjaan dijelaskan di folder `tasks/`:

1. `tasks/todo-01-database-seed-verification.md`
2. `tasks/todo-02-admin-crud-and-access.md`
3. `tasks/todo-03-public-content-and-landing.md`
4. `tasks/todo-04-performance-and-qa.md`
5. `tasks/todo-05-webuzo-deployment.md`
6. `tasks/todo-06-assets-copy-and-final-deck.md`
7. `tasks/todo-07-chatbot-and-security-hardening.md`

## 4. Status Per Area

| Area | Status | Catatan |
| --- | --- | --- |
| Native architecture | Done | Tidak ada runtime dependency ke reference |
| Header and Career Industries prototype | Done | Perlu validasi visual runtime setelah seed |
| Database schema and initial migration | Done | Belum diterapkan ke database milik user |
| Seed data | Ready | Belum dijalankan tanpa `DATABASE_URL` |
| Admin login/dashboard | Prototype | CRUD lengkap dan middleware masih perlu diselesaikan |
| Content sections | Partial | BLUD, galeri, agenda, dan data prestasi perlu diisi/dirapikan |
| MokletBot | Prototype | Key, FAQ final, resilience, dan security perlu diuji |
| Lighthouse/load test | Pending | Target desktop/mobile >90 belum dibuktikan |
| VPS/Webuzo deployment | Pending | Sengaja ditunda |
| Official assets and final deck | Pending | Placeholder masih digunakan |

## 5. Setup Development Bersih

```bash
Copy-Item .env.example .env
# isi DATABASE_URL dan ADMIN_PASSWORD
npm run db:reset
npm run db:seed
npm run dev
```

Jangan menjalankan `db:reset` pada database production. API key AI dan credential production tidak boleh di-commit.

## 6. Definition Of Done

- Semua task `todo-*.md` selesai atau memiliki keputusan eksplisit dari tim.
- Database production sudah dimigrasikan dan di-seed sesuai keputusan.
- Admin CRUD dan route protection selesai.
- Career Industries dapat menerima dan menampilkan lamaran dari database.
- Lighthouse Desktop dan Mobile mencapai target yang disepakati.
- Website ter-deploy di VPS Jagoan Hosting melalui Webuzo.
- Asset resmi dan pitch deck final sudah digunakan.
- Tidak ada secret, reference mirror, generated build, atau file duplikat berat di repository.
