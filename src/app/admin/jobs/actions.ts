"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
    const judulPosisi = formData.get("judulPosisi") as string;
    const perusahaanId = Number(formData.get("perusahaanId"));
    const tipe = formData.get("tipe") as "PKL" | "MAGANG" | "FULL_TIME";
    const lokasi = formData.get("lokasi") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const syaratKeahlian = formData.get("syaratKeahlian") as string;
    const status = formData.get("status") as "PUBLISHED" | "DRAFT" | "CLOSED";

    if (!judulPosisi || !perusahaanId || !deskripsi) {
        throw new Error("Judul posisi, perusahaan, dan deskripsi wajib diisi!");
    }

    // Generate slug unik sederhana
    const slug = judulPosisi
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    const defaultAdmin = await prisma.admin.findFirst();
    if (!defaultAdmin) {
        throw new Error("Tidak ditemukan akun admin di database.");
    }

    await prisma.lowongan.create({
        data: {
            slug,
            judulPosisi,
            lokasi,
            tipe,
            deskripsi,
            syaratKeahlian: syaratKeahlian || "-",
            status: status || "PUBLISHED",
            perusahaanId,
            adminId: defaultAdmin.id,
        },
    });

    revalidatePath("/admin/jobs");
    redirect("/admin/jobs");
}

export async function updateJob(id: number, formData: FormData) {
    const judulPosisi = formData.get("judulPosisi") as string;
    const perusahaanId = Number(formData.get("perusahaanId"));
    const tipe = formData.get("tipe") as "PKL" | "MAGANG" | "FULL_TIME";
    const lokasi = formData.get("lokasi") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const syaratKeahlian = formData.get("syaratKeahlian") as string;
    const status = formData.get("status") as "PUBLISHED" | "DRAFT" | "CLOSED";

    await prisma.lowongan.update({
        where: { id },
        data: {
            judulPosisi,
            perusahaanId,
            tipe,
            lokasi,
            deskripsi,
            syaratKeahlian,
            status,
        },
    });

    revalidatePath("/admin/jobs");
    redirect("/admin/jobs");
}