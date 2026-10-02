import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const subjek = String(formData.get("subjek") ?? "").trim();
  const pesan = String(formData.get("pesan") ?? "").trim();
  if (!nama || !subjek || !pesan) return NextResponse.json({ error: "Nama, subjek, dan pesan wajib diisi." }, { status: 400 });
  await prisma.pesanMasuk.create({ data: { nama, email, subjek, pesan } });
  return NextResponse.redirect(new URL("/kontak?sent=1", request.url));
}