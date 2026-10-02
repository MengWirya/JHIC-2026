# TODO 04 - Performance And QA

## Tujuan
Membuktikan target performa kompetisi dan memastikan alur utama tidak rusak.

## Target
- Lighthouse Desktop lebih dari 90.
- Lighthouse Mobile lebih dari 90.
- Stabil pada concurrent users musim PPDB.
- Tidak ada layout overflow atau text stacking.

## Pekerjaan
- Jalankan production server dari hasil `npm run build` dan `npm run start`.
- Audit Lighthouse untuk `/`, `/career-industries`, `/berita`, dan `/kontak`.
- Ganti sisa `<img>` yang relevan dengan `next/image` atau jelaskan pengecualian.
- Tambahkan metadata title, description, dan Open Graph per halaman utama.
- Uji mobile 375px, tablet 768px, dan desktop 1440px.
- Siapkan load test lokal memakai tool standar seperti k6 atau autocannon.
- Uji GET halaman utama dan POST `/api/lamaran`, `/api/pesan`, serta `/api/chatbot`.
- Dokumentasikan hasil, bottleneck, dan rekomendasi scaling.

## API atau credential
- Tidak perlu API eksternal untuk Lighthouse atau load test.
- `ANTHROPIC_API_KEY` atau `GEMINI_API_KEY` diperlukan hanya untuk uji jawaban AI nyata.

## Selesai jika
- Laporan Lighthouse tersimpan di luar source runtime atau di folder laporan yang disepakati.
- Semua critical flow lulus pada production build.
- Tidak ada error console atau 404 asset pada halaman prioritas.
