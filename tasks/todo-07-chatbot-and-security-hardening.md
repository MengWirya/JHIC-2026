# TODO 07 - Chatbot And Security Hardening

## Tujuan
Menjadikan MokletBot dan endpoint publik aman untuk demo serta deployment.

## Pekerjaan
- Isi dan review FAQ resmi bersama tim sekolah.
- Uji provider Anthropic dan Gemini melalui `AI_PROVIDER`.
- Tangani response non-2xx, timeout, quota, dan API key kosong dengan pesan aman.
- Pindahkan rate limit dari memory process ke storage shared bila deployment lebih dari satu instance.
- Validasi panjang input dan sanitasi output/log.
- Review CSRF/form abuse pada `/api/lamaran` dan `/api/pesan`.
- Jangan masukkan API key ke source, commit, log, atau screenshot.

## API atau credential
Salah satu dari `ANTHROPIC_API_KEY` atau `GEMINI_API_KEY`, plus `DATABASE_URL` dan `AUTH_SECRET`.

## Selesai jika
- MokletBot menjawab hanya dari FAQ yang disetujui.
- Kegagalan provider tidak membocorkan secret atau stack trace ke user.
- Endpoint publik memiliki validasi dan batas abuse yang terdokumentasi.
