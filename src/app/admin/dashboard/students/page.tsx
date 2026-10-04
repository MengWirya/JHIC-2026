import { prisma } from "@/lib/prisma";
import StudentsClient from "./students-client";

export default async function AdminStudentsPage() {
  const students = await prisma.siswa.findMany({
    orderBy: { nama: "asc" },
  }).catch(() => []);

  return <StudentsClient students={students} />;
}