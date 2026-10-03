"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFaq(formData: FormData) {
    const pertanyaan = formData.get("pertanyaan") as string;
    const jawaban = formData.get("jawaban") as string;

    if (!pertanyaan || !jawaban) {
        throw new Error("Pertanyaan dan jawaban wajib diisi!");
    }

    await prisma.faq.create({
        data: {
            pertanyaan,
            jawaban,
            kategori: "Umum", // Berikan nilai default agar tidak error
        },
    });

    revalidatePath("/admin/faq");
    redirect("/admin/faq");
}

export async function updateFaq(id: number, formData: FormData) {
    const kategori = formData.get("kategori") as string;
    const pertanyaan = formData.get("pertanyaan") as string;
    const jawaban = formData.get("jawaban") as string;

    await prisma.faq.update({
        where: { id },
        data: { kategori, pertanyaan, jawaban },
    });

    revalidatePath("/admin/faq");
    redirect("/admin/faq");
}