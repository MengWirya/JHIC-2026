import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import path from "path";
import { config } from "dotenv";

config();

// Interface disesuaikan dengan header kolom asli dari file siswa.xlsx
interface ExcelSiswaRow {
    "NAMA DAPODIK"?: string;
    NIS?: string | number;
    JURUSAN?: string;
    [key: string]: unknown;
}

function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is required to import excel.");

    const url = new URL(databaseUrl);
    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.slice(1),
        connectionLimit: 5,
    });

    return new PrismaClient({ adapter });
}

async function importSiswaFromExcel() {
    const prisma = createPrismaClient();

    try {
        const filePath = path.join(process.cwd(), "data", "siswa.xlsx");

        console.log(`Mengambil file Excel dari: ${filePath}`);

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Mengonversi sheet ke JSON (tanpa skip range)
        const dataSiswa = XLSX.utils.sheet_to_json<ExcelSiswaRow>(sheet);

        console.log(`Ditemukan ${dataSiswa.length} baris data siswa. Memulai impor...`);

        let countSuccess = 0;

        for (const row of dataSiswa) {
            // Membaca kolom NAMA DAPODIK, NIS, dan JURUSAN
            const nisYayasan = String(row["NIS"] || "").trim();
            const nama = String(row["NAMA DAPODIK"] || "").trim();
            const jurusan = String(row["JURUSAN"] || "").trim();

            if (!nisYayasan || !nama) {
                continue;
            }

            await prisma.siswa.upsert({
                where: { nisYayasan },
                update: {
                    nama,
                    jurusan: jurusan || null,
                },
                create: {
                    nisYayasan,
                    nama,
                    jurusan: jurusan || null,
                },
            });

            countSuccess++;
        }

        console.log(`🎉 BERHASIL! Total ${countSuccess} data siswa berhasil di-impor ke database.`);
    } catch (error) {
        console.error("Gagal mengimpor file Excel:", error);
    } finally {
        await prisma.$disconnect();
    }
}

importSiswaFromExcel();