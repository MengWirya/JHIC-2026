"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitFullApplication(formData: FormData) {
    try {
        const lowonganId = parseInt(formData.get("lowonganId") as string, 10);
        const namaLengkap = formData.get("namaLengkap") as string;
        const email = formData.get("email") as string;
        const noTelp = formData.get("noTelp") as string;
        const nisYayasan = formData.get("nisYayasan") as string;
        const statusPelamar = formData.get("statusPelamar") as string;
        const jurusan = formData.get("jurusan") as string;
        const tahunKelulusan = formData.get("tahunKelulusan") as string;
        const portfolioUrl = formData.get("portfolioUrl") as string;
        const coverLetter = formData.get("coverLetter") as string;

        if (!lowonganId || !namaLengkap || !email || !nisYayasan) {
            return { success: false, message: "Data tidak lengkap!" };
        }

        // Menyimpan data lengkap lamaran ke Prisma
        await prisma.lamaran.create({
            data: {
                lowonganId,
                namaLengkap,
                email,
                kelasAlumni: `${statusPelamar} - ${jurusan} (${tahunKelulusan})`,
                portfolioUrl,
                pesanTambahan: `[Telp: ${noTelp}] [NIS: ${nisYayasan}]\n\nCover Letter:\n${coverLetter}`,
                status: "BARU",
            },
        });

        revalidatePath(`/jobs/${lowonganId}`);
        return { success: true, message: "Lamaran berhasil dikirim!" };
    } catch (error) {
        console.error("Submit Error:", error);
        return { success: false, message: "Gagal menyimpan lamaran." };
    }
}