# Instruksi Migrasi: Ekstraksi Website Lama → Workspace Next.js

**Untuk: AI coding agent (Claude Code atau sejenisnya)**
**Konteks: Dua folder sejajar di direktori kerja ini:**

- `moklet-hub/` — workspace Next.js tujuan (rebuild baru)
- `www.smktelkom-mlg.sch.id/` — hasil mirror `wget` dari website lama (HTML + CSS + gambar mentah)

---

## ⚠️ Baca Ini Dulu Sebelum Mulai

Folder 'www.smktelkom-mlg.sch.id/' merupakan hasil ekstrak menggunakan `wget`. Ini adalah **output HTML/CSS yang dirender ke browser**, BUKAN source code backend. Website lama dibangun di atas CodeIgniter 3 (PHP), tapi kamu **tidak akan menemukan file `.php` dengan logic bisnis** di folder ini — cuma HTML statis hasil render, file CSS, dan gambar. Itu memang tujuannya.

**Tujuan migrasi ini BUKAN memindahkan halaman lama apa adanya.** Proyek ini adalah rewrite total ke arsitektur baru (Next.js + Tailwind + database dinamis). Yang perlu diambil dari folder ekstraksi HANYA:

1. **Design token** — warna, tipografi, spacing yang dipakai di web lama (supaya identitas visual sekolah tetap konsisten)
2. **Aset gambar** — logo, foto fasilitas, galeri, dll (untuk dipakai ulang sementara sampai ada aset resmi dari sekolah)
   **JANGAN**:

- Menyalin file `.html` lama sebagai halaman baru di Next.js
- Menyalin file `.css` lama secara utuh untuk dipakai langsung (kita pakai Tailwind, bukan CSS custom penuh)
- Menimpa file yang sudah ada di `moklet-hub/src/` kecuali disebutkan secara eksplisit di bawah

---

## Langkah 1 — Eksplorasi Struktur Dulu, Jangan Asumsi

Struktur folder hasil `wget` bisa bervariasi tergantung bagaimana situs lama menata asetnya. Sebelum melakukan apa pun:

```bash
find www.smktelkom-mlg.sch.id -type f -name "*.css" | head -30
find www.smktelkom-mlg.sch.id -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.svg" -o -name "*.webp" \) | wc -l
find www.smktelkom-mlg.sch.id -name "sitemap*.xml"
```

Laporkan singkat apa yang ditemukan (berapa file CSS, berapa gambar, ada sitemap atau tidak) sebelum lanjut ke langkah berikutnya.

## Langkah 2 — Ekstraksi Palet Warna

Cari semua kode warna hex yang dipakai di seluruh file CSS, urutkan berdasarkan frekuensi pemakaian (warna yang paling sering dipakai kemungkinan besar warna brand utama):

```bash
grep -ohE "#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}\b" www.smktelkom-mlg.sch.id/**/*.css 2>/dev/null | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn | head -20
```

Dari hasil ini, identifikasi:

- **Warna primer** (biasanya dipakai di tombol CTA, header, elemen aksen — kemungkinan besar merah khas Telkom)
- **Warna sekunder** (biasanya untuk teks gelap/navy)
- **Warna netral** (abu-abu untuk teks sekunder, border, background)
  Update file `moklet-hub/src/app/globals.css` — ganti nilai placeholder di bagian `:root` (`--brand-primary`, `--brand-secondary`) dengan hasil temuan ini. Ada komentar `TODO` yang menandai persis di mana harus diedit.

## Langkah 3 — Detek			si Font

```bash
grep -rohE "font-family:\s*[^;]+;" www.smktelkom-mlg.sch.id/**/*.css 2>/dev/null | sort | uniq -c | sort -rn | head -10
grep -rl "fonts.googleapis.com" www.smktelkom-mlg.sch.id --include="*.html" | head -5
```

- **Kalau ditemukan link ke `fonts.googleapis.com`** → catat nama font-nya, nanti akan diimport lewat `next/font/google` (tidak perlu salin file font).
- **Kalau font di-self-host** (ada file `.woff`/`.woff2`/`.ttf` di folder ekstraksi) → **JANGAN langsung disalin ke project baru**. Laporkan nama font dan lokasi filenya, biarkan tim manusia yang cek status lisensinya dulu.

## Langkah 4 — Migrasi Aset Gambar

1. Buat folder `moklet-hub/public/images/` kalau belum ada.
2. Salin gambar yang relevan dengan konten sekolah (logo, foto fasilitas, galeri, foto prestasi, dll).
3. **Saring dulu** — abaikan aset yang jelas bukan bagian dari konten situs (ikon tracking pihak ketiga, aset Google Analytics, favicon generik, dll).
4. Kelompokkan ke sub-folder yang masuk akal berdasarkan apa yang ditemukan, misalnya:

```
   public/images/logo/
   public/images/fasilitas/
   public/images/galeri/
   public/images/prestasi/
```

5. Pertahankan nama file asli untuk sementara (memudahkan pelacakan asal file), kecuali namanya benar-benar tidak deskriptif (misal `IMG_2837.jpg` boleh diganti jadi nama yang lebih jelas kalau konteksnya jelas dari halaman asal).
6. Beri perhatian khusus pada file logo sekolah — tandai secara terpisah di laporan akhir, karena kualitasnya mungkin perlu diganti dengan versi resmi dari sekolah nanti.

## Langkah 5 — Laporan Akhir

Setelah selesai, tulis ringkasan singkat mencakup:

- Warna hex yang ditemukan dan yang dipilih jadi `--brand-primary` / `--brand-secondary`
- Nama font yang terdeteksi (Google Font atau self-hosted)
- Jumlah gambar yang berhasil dimigrasi, dikelompokkan per kategori
- Aset yang butuh keputusan manusia (misal: font berlisensi, logo resolusi rendah)
- Isi `sitemap.xml` kalau ditemukan (berguna untuk referensi struktur halaman lama)

---

## Definisi Selesai (Definition of Done)

- [ ] `globals.css` sudah berisi warna & font asli, bukan placeholder lagi
- [ ] `public/images/` berisi aset yang sudah disaring dan dikelompokkan
- [ ] Tidak ada file `.html`/`.css` mentah dari situs lama yang ikut ter-commit ke dalam `moklet-hub/`
- [ ] Laporan ringkas sudah ditulis untuk direview tim
