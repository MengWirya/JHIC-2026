"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TipeLowongan, StatusLowongan, StatusLamaran } from "@prisma/client";

// Utility untuk membuat slug URL otomatis
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-") + "-" + Date.now().toString().slice(-4);
}

// Helper untuk ambil Admin ID default (Atur ke Admin ID yang aktif)
async function getDefaultAdminId(): Promise<number> {
    const admin = await prisma.admin.findFirst();
    if (!admin) {
        // Buat admin default jika database masih kosong
        const newAdmin = await prisma.admin.create({
            data: {
                nama: "Super Admin",
                email: "admin@smktelkom-mlg.sch.id",
                passwordHash: "hashed_password_here",
                role: "SUPER_ADMIN",
            },
        });
        return newAdmin.id;
    }
    return admin.id;
}

// ─── 1. CRUD LOWONGAN KERJA ──────────────────────────────────────────

export async function createJob(formData: FormData) {
    try {
        const judulPosisi = formData.get("judulPosisi")?.toString() || "";
        const perusahaanIdRaw = formData.get("perusahaanId")?.toString() || "";
        const tipeRaw = formData.get("tipe")?.toString() || "FULL_TIME";
        const lokasi = formData.get("lokasi")?.toString() || "Malang";
        const deskripsi = formData.get("deskripsi")?.toString() || "";
        const syaratKeahlian = formData.get("syaratKeahlian")?.toString() || "Sesuai kualifikasi jurusan.";

        const perusahaanId = parseInt(perusahaanIdRaw, 10);
        if (!judulPosisi || isNaN(perusahaanId)) {
            return { success: false, error: "Judul posisi dan mitra perusahaan wajib diisi." };
        }

        const adminId = await getDefaultAdminId();
        const slug = slugify(judulPosisi);

        // Map tipe string ke Enum Prisma TipeLowongan
        let tipeEnum: TipeLowongan = TipeLowongan.FULL_TIME;
        if (tipeRaw === "PKL") tipeEnum = TipeLowongan.PKL;
        if (tipeRaw === "MAGANG") tipeEnum = TipeLowongan.MAGANG;

        await prisma.lowongan.create({
            data: {
                judulPosisi,
                slug,
                lokasi,
                tipe: tipeEnum,
                deskripsi,
                syaratKeahlian,
                status: StatusLowongan.PUBLISHED,
                perusahaanId,
                adminId,
            },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/jobs");
        return { success: true };
    } catch (error) {
        console.error("Error createJob:", error);
        return { success: false, error: "Gagal membuat lowongan kerja." };
    }
}

export async function updateJob(formData: FormData) {
    try {
        const idRaw = formData.get("id")?.toString();
        const judulPosisi = formData.get("judulPosisi")?.toString() || "";
        const tipeRaw = formData.get("tipe")?.toString() || "FULL_TIME";
        const lokasi = formData.get("lokasi")?.toString() || "Malang";
        const statusRaw = formData.get("status")?.toString() || "PUBLISHED";

        const id = parseInt(idRaw || "", 10);
        if (isNaN(id)) return { success: false, error: "ID Lowongan tidak valid." };

        let tipeEnum: TipeLowongan = TipeLowongan.FULL_TIME;
        if (tipeRaw === "PKL") tipeEnum = TipeLowongan.PKL;
        if (tipeRaw === "MAGANG") tipeEnum = TipeLowongan.MAGANG;

        let statusEnum: StatusLowongan = StatusLowongan.PUBLISHED;
        if (statusRaw === "DRAFT") statusEnum = StatusLowongan.DRAFT;
        if (statusRaw === "CLOSED") statusEnum = StatusLowongan.CLOSED;

        await prisma.lowongan.update({
            where: { id },
            data: {
                judulPosisi,
                tipe: tipeEnum,
                lokasi,
                status: statusEnum,
            },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/jobs");
        return { success: true };
    } catch (error) {
        console.error("Error updateJob:", error);
        return { success: false, error: "Gagal mengedit lowongan." };
    }
}

export async function deleteJob(id: number) {
    try {
        await prisma.lowongan.delete({ where: { id } });
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/jobs");
        return { success: true };
    } catch (error) {
        console.error("Error deleteJob:", error);
        return { success: false, error: "Gagal menghapus lowongan." };
    }
}

// ─── 2. CRUD MITRA PERUSAHAAN ────────────────────────────────────────

export async function createCompany(formData: FormData) {
    try {
        const nama = formData.get("nama")?.toString() || "";
        const overview = formData.get("overview")?.toString() || "";
        const website = formData.get("website")?.toString() || "";
        const kontak = formData.get("kontak")?.toString() || "";

        if (!nama) return { success: false, error: "Nama perusahaan wajib diisi." };

        const adminId = await getDefaultAdminId();

        await prisma.perusahaan.create({
            data: {
                nama,
                overview,
                website,
                kontak,
                adminId,
            },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/companies");
        return { success: true };
    } catch (error) {
        console.error("Error createCompany:", error);
        return { success: false, error: "Gagal menambah mitra perusahaan." };
    }
}

export async function updateCompany(formData: FormData) {
    try {
        const idRaw = formData.get("id")?.toString();
        const nama = formData.get("nama")?.toString() || "";
        const overview = formData.get("overview")?.toString() || "";
        const website = formData.get("website")?.toString() || "";

        const id = parseInt(idRaw || "", 10);
        if (isNaN(id)) return { success: false, error: "ID Perusahaan tidak valid." };

        await prisma.perusahaan.update({
            where: { id },
            data: { nama, overview, website },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/companies");
        return { success: true };
    } catch (error) {
        console.error("Error updateCompany:", error);
        return { success: false, error: "Gagal mengedit data perusahaan." };
    }
}

export async function deleteCompany(id: number) {
    try {
        await prisma.perusahaan.delete({ where: { id } });
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/companies");
        return { success: true };
    } catch (error) {
        console.error("Error deleteCompany:", error);
        return { success: false, error: "Gagal menghapus perusahaan." };
    }
}

// ─── 3. UPDATE STATUS LAMARAN ────────────────────────────────────────

export async function updateApplicationStatus(id: number, statusRaw: string) {
    try {
        let statusEnum: StatusLamaran = StatusLamaran.BARU;
        if (statusRaw === "DITINJAU") statusEnum = StatusLamaran.DITINJAU;
        if (statusRaw === "DITERIMA") statusEnum = StatusLamaran.DITERIMA;
        if (statusRaw === "DITOLAK") statusEnum = StatusLamaran.DITOLAK;

        await prisma.lamaran.update({
            where: { id },
            data: { status: statusEnum },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/applications");
        return { success: true };
    } catch (error) {
        console.error("Error updateApplicationStatus:", error);
        return { success: false, error: "Gagal mengubah status lamaran." };
    }
}

// ─── 4. CRUD DATABASE SISWA ──────────────────────────────────────────

export async function createStudent(formData: FormData) {
    try {
        const nisYayasan = formData.get("nisYayasan")?.toString() || "";
        const nama = formData.get("nama")?.toString() || "";
        const jurusan = formData.get("jurusan")?.toString() || "";

        if (!nisYayasan || !nama) return { success: false, error: "NIS dan Nama wajib diisi." };

        await prisma.siswa.create({
            data: { nisYayasan, nama, jurusan },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/students");
        return { success: true };
    } catch (error) {
        console.error("Error createStudent:", error);
        return { success: false, error: "Gagal menambah data siswa." };
    }
}

export async function updateStudent(formData: FormData) {
    try {
        const idRaw = formData.get("id")?.toString();
        const nisYayasan = formData.get("nisYayasan")?.toString() || "";
        const nama = formData.get("nama")?.toString() || "";
        const jurusan = formData.get("jurusan")?.toString() || "";

        const id = parseInt(idRaw || "", 10);
        if (isNaN(id)) return { success: false, error: "ID Siswa tidak valid." };

        await prisma.siswa.update({
            where: { id },
            data: { nisYayasan, nama, jurusan },
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/students");
        return { success: true };
    } catch (error) {
        console.error("Error updateStudent:", error);
        return { success: false, error: "Gagal mengubah data siswa." };
    }
}

export async function deleteStudent(id: number) {
    try {
        await prisma.siswa.delete({ where: { id } });
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/dashboard/students");
        return { success: true };
    } catch (error) {
        console.error("Error deleteStudent:", error);
        return { success: false, error: "Gagal menghapus data siswa." };
    }
}