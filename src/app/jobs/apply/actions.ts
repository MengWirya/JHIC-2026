"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitApplication(prevState: { error?: string } | null, formData: FormData) {
    const lowonganIdRaw = formData.get("lowonganId")?.toString();
    const namaLengkap = formData.get("namaLengkap")?.toString()?.trim() || "";
    const kelasAlumni = formData.get("kelasAlumni")?.toString()?.trim() || "";
    const email = formData.get("email")?.toString()?.trim() || "";
    const portfolioUrl = formData.get("portfolioUrl")?.toString()?.trim() || "";
    const pesanTambahan = formData.get("pesanTambahan")?.toString()?.trim() || "";

    const lowonganId = parseInt(lowonganIdRaw || "", 10);

    // Validasi data wajib
    if (!namaLengkap || !kelasAlumni || !email || !portfolioUrl || isNaN(lowonganId)) {
        return { error: "Data tidak lengkap!" };
    }

    try {
        await prisma.lamaran.create({
            data: {
                namaLengkap,
                kelasAlumni,
                email,
                portfolioUrl,
                pesanTambahan: pesanTambahan || null,
                lowonganId,
                status: "BARU",
            },
        });
    } catch (err) {
        console.error("Error submitting application:", err);
        return { error: "Gagal mengirim lamaran. Silakan coba lagi." };
    }

    // Redirect setelah sukses
    redirect("/jobs/apply/success");
}