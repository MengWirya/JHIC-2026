# TODO 02 - Admin CRUD And Access

## Tujuan
Menyelesaikan panel operasi `SUPER_ADMIN` agar konten dan lowongan dapat dikelola tanpa mengubah kode.

## Pekerjaan
- Tambahkan middleware atau guard server untuk semua route `/admin/*`.
- Pertahankan login Credentials Auth.js yang sudah ada.
- Buat CRUD `Konten`: BERITA, PRESTASI, BLUD, dan GALERI.
- Buat CRUD `Perusahaan`, `TagJurusan`, dan `Lowongan`.
- Buat daftar dan perubahan status `Lamaran`.
- Buat CRUD FAQ untuk knowledge base MokletBot.
- Buat daftar `PesanMasuk` dari halaman kontak.
- Tambahkan validasi form, empty state, error state, dan feedback sukses.

## API atau credential
- Tidak ada API eksternal.
- Membutuhkan `DATABASE_URL`, `AUTH_SECRET`, dan akun `SUPER_ADMIN`.

## Selesai jika
- Pengunjung tanpa session tidak dapat membuka dashboard.
- SUPER_ADMIN dapat membuat, mengedit, publish, draft, dan menghapus data sesuai scope.
- Perubahan FAQ langsung terlihat oleh MokletBot tanpa redeploy.
- Lamaran dari Career Industries terlihat di dashboard.
