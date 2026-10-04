import { prisma } from "@/lib/prisma";
import JobsClient from "./jobs-client";

export default async function AdminJobsPage() {
  const [lowonganList, perusahaanList] = await Promise.all([
    prisma.lowongan.findMany({
      include: { perusahaan: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.perusahaan.findMany({
      orderBy: { nama: "asc" },
    }).catch(() => []),
  ]);

  return <JobsClient lowonganList={lowonganList} perusahaanList={perusahaanList} />;
}