# TODO 05 - Webuzo Deployment

## Status
Ditunda sesuai keputusan project. Jangan mulai tanpa akses VPS dan domain.

## Tujuan
Deploy Next.js production ke VPS Jagoan Hosting menggunakan Webuzo, tanpa dependency pada Azure atau API CI3.

## Prasyarat dari pemilik project
- IP atau hostname VPS.
- Akses panel Webuzo.
- Domain Jagoan Hosting dan akses DNS.
- Versi Node.js minimal 20.
- Kredensial MySQL/MariaDB production.
- `AUTH_SECRET`, `ADMIN_PASSWORD`, dan API key AI production.

## Pekerjaan
- Buat Node.js application di Webuzo.
- Upload repository atau artifact production.
- Jalankan `npm ci`, `npm run build`, dan `npm run db:migrate`.
- Jalankan `npm run db:seed` hanya untuk database baru atau setelah persetujuan.
- Atur environment production tanpa commit `.env`.
- Hubungkan domain, SSL, dan redirect HTTPS.
- Verifikasi restart process, log, backup database, dan health check.
- Jalankan smoke test seluruh route dan submit form.

## Selesai jika
- Domain production dapat dibuka dengan HTTPS.
- Tidak ada reference HTML/PDF/PNG yang masuk ke build production.
- Migration production berhasil.
- Monitoring dan prosedur rollback tersedia.
