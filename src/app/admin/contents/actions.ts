"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TipeKonten, StatusKonten } from "@prisma/client";

export async function createContent(formData: FormData) {
    const judul = formData.get("judul") as string;
    const tipe = formData.get("tipe") as TipeKonten;
    const deskripsi = formData.get("deskripsi") as string;
    const gambarUrl = formData.get("gambarUrl") as string;
    const status = formData.get("status") as StatusKonten;

    if (!judul || !deskripsi || !tipe) {
        throw new Error("Judul, tipe, dan deskripsi konten wajib diisi!");
    }

    // Generate slug unik sederhana dari judul
    const slug =
        judul
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now();

    const defaultAdmin = await prisma.admin.findFirst();
    if (!defaultAdmin) {
        throw new Error("Tidak ditemukan akun admin di database.");
    }

    await prisma.konten.create({
        data: {
            slug,
            judul,
            tipe,
            deskripsi,
            gambarUrl: gambarUrl || null,
            status: status || StatusKonten.DRAFT,
            adminId: defaultAdmin.id,
        },
    });

    revalidatePath("/admin/contents");
    redirect("/admin/contents");
}

export async function updateContent(id: number, formData: FormData) {
    const judul = formData.get("judul") as string;
    const tipe = formData.get("tipe") as TipeKonten;
    const deskripsi = formData.get("deskripsi") as string;
    const gambarUrl = formData.get("gambarUrl") as string;
    const status = formData.get("status") as StatusKonten;

    await prisma.konten.update({
        where: { id },
        data: {
            judul,
            tipe,
            deskripsi,
            gambarUrl: gambarUrl || null,
            status,
        },
    });

    revalidatePath("/admin/contents");
    redirect("/admin/contents");
}

export async function deleteContent(id: number) {
    await prisma.konten.delete({
        where: { id },
    });

    revalidatePath("/admin/contents");
}