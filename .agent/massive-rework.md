
# Koreksi Arsitektur — Hapus Legacy Bridge, Bangun Subhalaman Secara Native

**Status: WAJIB dieksekusi sebelum lanjut fitur baru apa pun.**

---

## Aturan yang Dikonfirmasi (Tidak Bisa Ditawar)

> Folder `www.smktelkom-mlg.sch.id/` dan `public/legacy/` **HANYA referensi** untuk proses migrasi/development. **TIDAK BOLEH** diimpor, di-fetch, atau dirender oleh kode aplikasi yang berjalan saat request masuk (runtime).

Garis batas yang jelas:

- ✅ **BOLEH**: skrip migrasi *one-time* (`scripts/migrate-*.ts`) yang membaca file HTML lama, mem-parsing isinya, lalu menyimpan hasilnya sebagai data bersih ke database lewat Prisma. Skrip ini dijalankan manual sekali oleh developer, bukan bagian dari aplikasi produksi.
- ❌ **TIDAK BOLEH**: route/page/component apa pun di `src/app/` yang membaca file dari folder reference saat ada request masuk.

## Kenapa Ini Kritis (Bukan Soal Gaya Kode)

Pola "legacy bridge" yang ada sekarang (`src/lib/legacy-site.tsx` + `src/app/[...legacy]/page.tsx`) merender ulang HTML+CSS lama untuk ~200+ subhalaman. Konsekuensinya:

1. Halaman-halaman itu tetap memuat CSS Bootstrap/theme lama yang jadi **akar penyebab skor Lighthouse 52/26** yang mau kita perbaiki — kalau juri buka salah satu dari halaman itu, klaim "Performance sudah diperbaiki" di Pitch Deck langsung terbantahkan oleh demo kita sendiri.
2. Bug teks menumpuk yang ditemukan di `/berita` adalah efek samping langsung dari CSS lama yang bentrok saat di-inject ulang. **Begitu poin di bawah ini dieksekusi, bug ini hilang otomatis — tidak perlu didebug terpisah.**

---

## Langkah 1 — Hapus Legacy Bridge

- [ ] Hapus `src/lib/legacy-site.tsx`
- [ ] Hapus `src/app/[...legacy]/page.tsx`
- [ ] Hapus pemuatan CSS legacy mana pun yang masih terhubung ke komponen aktif
- [ ] Pindahkan `www.smktelkom-mlg.sch.id/` dan `public/legacy/` ke folder `reference/` di root project (di luar `src/` dan `public/`) — supaya tidak mungkin ke-import tidak sengaja dan tidak ikut ter-bundle ke build production
- [ ] Update `eslint.config.mjs` untuk meng-ignore folder `reference/` (sekalian membereskan masalah lint yang sudah teridentifikasi di `MIGRATION-AUDIT.md`)

## Langkah 2 — Ganti Pendekatan untuk 200+ Subhalaman: Data-Driven, Bukan 1:1 Copy

### Berita (±145 artikel) — prioritas tertinggi karena jumlahnya paling banyak

1. Buat skrip migrasi one-time `scripts/migrate-berita.ts`:
   - Baca tiap file HTML di `reference/www.smktelkom-mlg.sch.id/berita/*.html` (dibaca sekali, saat migrasi — bukan saat runtime)
   - Parse judul, isi konten, tanggal, kategori, gambar thumbnail (pakai library parsing HTML seperti `cheerio`)
   - `prisma.konten.create()` untuk tiap artikel, dengan `tipe: BERITA`
2. Bangun **satu** route dinamis `src/app/(public)/berita/[slug]/page.tsx` yang query Prisma berdasarkan slug — bukan 145 file halaman statis
3. Bangun halaman listing `src/app/(public)/berita/page.tsx` dengan pagination dari `prisma.konten.findMany()`
4. Setelah migrasi selesai dan data masuk database, skrip ini tidak dipanggil lagi oleh aplikasi

### Prestasi

Pola identik dengan Berita — tabel `Konten` tipe `PRESTASI` sudah ada di skema, tinggal buat skrip migrasi serupa.

### Halaman seputar "Tentang Kami" (Profil Sekolah, Visi Misi, Struktur Organisasi, Akreditasi, Hubungan Industri, Fasilitas)

Sudah benar arahnya (sudah dikonsolidasi jadi halaman native) — lanjutkan pola ini untuk sisa kontennya, bukan generate otomatis dari HTML lama.

### FAQ, Kotak Pertanyaan, Pusat Bantuan, Layanan Orang Tua

Sesuai rencana konsolidasi awal: satu halaman `/kontak`. FAQ sudah ada tabel `Faq`, form Pertanyaan/Layanan Orang Tua masuk ke tabel `PesanMasuk` — tidak perlu generate dari HTML lama sama sekali, ini dibangun dari nol.

### Galeri, Agenda, halaman Kategori/pagination lain

Evaluasi satu per satu: kalau strukturnya mirip Berita/Prestasi, reuse tabel `Konten` dengan tipe baru. Kalau beda signifikan, didiskusikan dulu sebelum bikin tabel baru.

## Langkah 3 — Kembalikan Struktur Navigasi Mendekati Aslinya

Prinsip proyek ini: **modernisasi arsitektur, bukan redesign UI/UX besar-besaran.** Temuan penyimpangan dari perbandingan screenshot:

| Elemen                      | Asli                                                 | Saat Ini (menyimpang)                                 |
| --------------------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| Menu utama                  | Beranda, Tentang Kami, Program, Alumni, Hubungi Kami | Tentang Kami, Program, Career Industries, Berita, FAQ |
| CTA navbar                  | PPDB + MikroTik Academy                              | Hanya PPDB                                            |
| Ikon sosial media di header | Ada (FB/IG/Twitter/YouTube)                          | Hilang                                                |
| Tombol CTA hero             | "Join Now"                                           | "Jelajahi Program" / "Kenali Moklet"                  |

- [ ] Kembalikan struktur menu mendekati aslinya: Beranda, Tentang Kami, Program, Alumni, Hubungi Kami
- [ ] Satu-satunya penyesuaian yang memang disepakati: link BKK lama di bawah Alumni/Tentang Kami diarahkan ke **Career Industries**, tidak perlu jadi item menu baru yang berdiri sendiri kalau aslinya tidak begitu
- [ ] Kembalikan ikon sosial media + CTA MikroTik Academy di navbar
- [ ] Perubahan visual/copy di luar yang sudah eksplisit disepakati **wajib dikonfirmasi dulu** ke tim sebelum dieksekusi — bukan inisiatif sepihak agent

---

## Definisi Selesai

- [ ] Tidak ada satu pun file di `src/` yang mengimpor/membaca dari folder `reference/`
- [ ] `/berita` dan halaman sejenis dirender native dari database, bukan dari HTML lama
- [ ] Bug teks menumpuk di `/berita` dan di folder lain-lainnya sudah hilang (tervalidasi otomatis begitu legacy-bridge dihapus)
- [ ] Struktur navigasi kembali mendekati aslinya, sesuai tabel perbandingan di atas
- [ ] `npm run lint` tidak lagi melaporkan error dari folder reference
