# TODO 01 - Database Seed Verification

## Tujuan
Menyiapkan database development bersih dan memastikan data demo Moklet Hub dapat dipakai oleh halaman publik, MokletBot, admin, dan Career Industries.

## Prasyarat dari pemilik project
- Isi `DATABASE_URL` di `.env` dengan MySQL/MariaDB lokal.
- Isi `ADMIN_PASSWORD` dengan password admin development.
- Setujui hard reset database lokal. `npm run db:reset` menghapus semua data.

## Pekerjaan
1. Jalankan `npx prisma generate`.
2. Jalankan `npm run db:reset`.
3. Jalankan `npm run db:seed`.
4. Verifikasi admin `admin@smktelkom-mlg.sch.id` dengan role `SUPER_ADMIN`.
5. Verifikasi FAQ, perusahaan, lowongan, berita dummy, dan lamaran demo.
6. Verifikasi login `/admin/login`, dashboard `/admin`, `/career-industries`, dan MokletBot.

## API atau credential
Tidak membutuhkan API eksternal untuk seed. Database URL dan password admin wajib tersedia secara lokal.

## Selesai jika
- Prisma migration berhasil tanpa error.
- Seed dapat dijalankan ulang tanpa membuat duplikasi.
- Semua route database tidak error saat database berisi data seed.
- Tidak ada data dari CI3 atau folder `reference/` yang digunakan.
