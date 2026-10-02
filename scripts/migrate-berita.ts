import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { PrismaClient, StatusKonten, TipeKonten } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const root = process.cwd();
const sourceDirectory = path.join(root, "reference", "www.smktelkom-mlg.sch.id", "berita");
const imageDirectory = path.join(root, "public", "images", "berita");

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required to migrate berita.");
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

function parseDate(value: string): Date {
  const date = new Date(value.trim());
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function migrateFile(prisma: PrismaClient, fileName: string, adminId: number) {
  const markup = await fs.readFile(path.join(sourceDirectory, fileName), "utf8");
  const $ = cheerio.load(markup);
  const slug = fileName.replace(/\.html$/i, "");
  const existing = await prisma.konten.findUnique({ where: { slug } });
  if (existing) return false;
  const title = $(".text-blog-single .title-h2").first().text().trim() || $("meta[property='og:title']").attr("content") || $("title").text().replace(/\s*-\s*SMK Telkom Malang$/, "").trim();
  const content = $(".blog-single-post .content-left-blog").first();
  content.find("script, style, iframe, form, .sidebar, .sidebar-post").remove();
  content.find("img").each((_index, element) => {
    const source = $(element).attr("src")?.replaceAll('"', "");
    const imageName = source ? path.basename(source) : "";
    $(element).attr("src", imageName ? `/images/berita/${imageName}` : "");
  });
  const categoryHref = $("a[href*='/kategori/']").first().attr("href") ?? "";
  const kategori = path.basename(categoryHref, ".html") || "informasi-umum";
  const thumbnailStyle = $(".image-blog").first().attr("style") ?? "";
  const thumbnailMatch = thumbnailStyle.match(/url\((?:["']?)([^)'\"]+)/i);
  const thumbnailName = thumbnailMatch ? path.basename(thumbnailMatch[1]) : undefined;
  const thumbnail = thumbnailName && await fs.stat(path.join(imageDirectory, thumbnailName)).then(() => `/images/berita/${thumbnailName}`).catch(() => undefined);

  await prisma.konten.create({
    data: {
      tipe: TipeKonten.BERITA,
      slug,
      judul: title || slug,
      deskripsi: `<p class="content-category">${kategori}</p>${content.html() || "<p>Konten belum tersedia.</p>"}`,
      gambarUrl: thumbnail,
      tanggal: parseDate($(".text-blog-single .dte-blog").first().text()),
      status: StatusKonten.PUBLISHED,
      adminId,
    },
  });
  return true;
}

async function main() {
  const adminId = Number(process.env.ADMIN_ID);
  if (!Number.isInteger(adminId) || adminId < 1) throw new Error("ADMIN_ID must be a positive integer.");
  const prisma = createPrismaClient();
  const files = (await fs.readdir(sourceDirectory)).filter((fileName) => fileName.endsWith(".html"));
  try {
    let migrated = 0;
    for (const fileName of files) if (await migrateFile(prisma, fileName, adminId)) migrated += 1;
    console.log(`Migrated ${migrated} berita records; skipped ${files.length - migrated} existing records.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });