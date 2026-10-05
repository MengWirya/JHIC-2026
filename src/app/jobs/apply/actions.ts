"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type FormState = {
    error?: string;
    success?: boolean;
    message?: string;
} | null;

export async function submitApplication(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const lowonganIdRaw = formData.get("lowonganId")?.toString();
        const namaLengkap = formData.get("namaLengkap")?.toString()?.trim() || "";
        const email = formData.get("email")?.toString()?.trim() || "";
        const kelasAlumni = formData.get("kelasAlumni")?.toString()?.trim() || "";
        const portfolioUrl = formData.get("portfolioUrl")?.toString()?.trim() || "";
        const pesanTambahan = formData.get("pesanTambahan")?.toString()?.trim() || "";

        // Ambil file CV dari FormData
        const cvFile = formData.get("cvFile") as File | null;

        const lowonganId = parseInt(lowonganIdRaw || "0", 10);

        // Validasi input Wajib
        if (!namaLengkap || !email || !portfolioUrl || isNaN(lowonganId) || lowonganId <= 0) {
            return { error: "Data pendaftaran tidak lengkap atau ID Lowongan tidak valid." };
        }

        // Cek keberadaan Lowongan di Database
        const lowongan = await prisma.lowongan.findUnique({
            where: { id: lowonganId },
        });

        if (!lowongan) {
            return { error: "Lowongan pekerjaan tidak ditemukan atau telah ditutup." };
        }

        // 🟢 PEMROSESAN UPLOAD FILE CV
        let cvUrl: string | null = null;

        if (cvFile && cvFile.size > 0 && cvFile.name !== "undefined") {
            try {
                const bytes = await cvFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Buat nama file unik
                const fileExt = path.extname(cvFile.name) || ".pdf";
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${fileExt}`;

                // Lokasi penyimpanan di public/uploads/cv
                const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
                await mkdir(uploadDir, { recursive: true });

                const filePath = path.join(uploadDir, fileName);
                await writeFile(filePath, buffer);

                // Relative URL untuk diakses dari browser / admin
                cvUrl = `/uploads/cv/${fileName}`;
            } catch (fileErr) {
                console.error("Gagal menyimpan file CV:", fileErr);
                // Tetap lanjut menyimpan lamaran meski file gagal diunggah
            }
        }

        // Insert ke tabel Lamaran
        await prisma.lamaran.create({
            data: {
                lowonganId,
                namaLengkap,
                email,
                kelasAlumni,
                portfolioUrl,
                cvUrl, // 🟢 Menyimpan link CV yang berhasil diupload
                pesanTambahan: pesanTambahan || null,
                status: "BARU",
            },
        });

        revalidatePath("/admin/dashboard/applications");

        return { success: true, message: "Pendaftaran lamaran berhasil dikirim!" };
    } catch (error) {
        console.error("Error submitApplication:", error);
        return {
            error: "Gagal menyimpan lamaran ke database. Pastikan koneksi MySQL aktif.",
        };
    }
}

export async function verifyNisYayasan(nisYayasan: string) {
    try {
        const nisClean = nisYayasan.trim();
        if (!nisClean) {
            return { success: false, message: "NIS Yayasan tidak boleh kosong." };
        }

        // Cari data siswa berdasarkan NIS Yayasan di database
        const siswa = await prisma.siswa.findUnique({
            where: { nisYayasan: nisClean },
        });

        if (siswa) {
            return {
                success: true,
                message: "NIS Yayasan terverifikasi!",
                siswa: {
                    nama: siswa.nama,
                    jurusan: siswa.jurusan,
                },
            };
        } else {
            return {
                success: false,
                message: "NIS Yayasan tidak ditemukan dalam database siswa aktif.",
            };
        }
    } catch (error) {
        console.error("Error verifyNisYayasan:", error);
        return { success: false, message: "Terjadi kesalahan sistem saat memverifikasi." };
    }
}