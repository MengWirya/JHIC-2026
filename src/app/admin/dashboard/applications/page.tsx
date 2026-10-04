import { prisma } from "@/lib/prisma";
import ApplicationsClient from "./applications-client";

export default async function AdminApplicationsPage() {
  const applications = await prisma.lamaran.findMany({
    include: { lowongan: { include: { perusahaan: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return <ApplicationsClient applications={applications} />;
}