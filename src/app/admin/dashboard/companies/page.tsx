import { prisma } from "@/lib/prisma";
import CompaniesClient from "./companies-client";

export default async function AdminCompaniesPage() {
  const companies = await prisma.perusahaan.findMany({
    include: { _count: { select: { lowongan: true } } },
    orderBy: { nama: "asc" },
  }).catch(() => []);

  return <CompaniesClient companies={companies} />;
}