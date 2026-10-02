import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const lowonganId = Number(formData.get("lowonganId"));
  const namaLengkap = String(formData.get("namaLengkap") ?? "").trim();
  const kelasAlumni = String(formData.get("kelasAlumni") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const portfolioUrl = String(formData.get("portfolioUrl") ?? "").trim();
  const pesanTambahan = String(formData.get("pesanTambahan") ?? "").trim() || null;
  if (!Number.isInteger(lowonganId) || !namaLengkap || !kelasAlumni || !email || !portfolioUrl) return NextResponse.json({ error: "Data lamaran belum lengkap." }, { status: 400 });
  const job = await prisma.lowongan.findFirst({ where: { id: lowonganId, status: "PUBLISHED" }, select: { slug: true } });
  if (!job) return NextResponse.json({ error: "Lowongan tidak ditemukan." }, { status: 404 });
  await prisma.lamaran.create({ data: { lowonganId, namaLengkap, kelasAlumni, email, portfolioUrl, pesanTambahan } });
  return NextResponse.redirect(new URL(`/career-industries/${job.slug}?applied=1#lamar`, request.url));
}
