"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCompany(formData: FormData) {
    const nama = formData.get("nama") as string;
    const overview = formData.get("overview") as string;
    const kontak = formData.get("kontak") as string;
    const website = formData.get("website") as string;

    if (!nama || !overview) {
        throw new Error("Nama perusahaan dan overview wajib diisi!");
    }

    // Mengambil admin pertama sebagai relasi default (atau sesuaikan dengan session login aktif)
    const defaultAdmin = await prisma.admin.findFirst();
    if (!defaultAdmin) {
        throw new Error("Tidak ditemukan akun admin di database.");
    }

    await prisma.perusahaan.create({
        data: {
            nama,
            overview,
            kontak,
            website,
            adminId: defaultAdmin.id,
        },
    });

    revalidatePath("/admin/companies");
    redirect("/admin/companies");
}

export async function updateCompany(id: number, formData: FormData) {
    const nama = formData.get("nama") as string;
    const overview = formData.get("overview") as string;
    const kontak = formData.get("kontak") as string;
    const website = formData.get("website") as string;

    if (!nama || !overview) {
        throw new Error("Nama perusahaan dan overview wajib diisi!");
    }

    await prisma.perusahaan.update({
        where: { id },
        data: {
            nama,
            overview,
            kontak,
            website: website || null,
        },
    });

    revalidatePath("/admin/companies");
    redirect("/admin/companies");
}

export async function deleteCompany(id: number) {
    await prisma.perusahaan.delete({
        where: { id },
    });

    revalidatePath("/admin/companies");
}