import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");
  const [admin, applications, jobCount, unreadMessages] = await Promise.all([
    prisma.admin.findUnique({ where: { email: session.user.email } }),
    prisma.lamaran.findMany({ include: { lowongan: { include: { perusahaan: true } } }, orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.lowongan.count({ where: { status: "PUBLISHED" } }),
    prisma.pesanMasuk.count({ where: { status: "BARU" } }),
  ]);
  if (!admin || admin.role !== "SUPER_ADMIN") redirect("/admin/login");

  async function logout() {
    "use server";
    const { signOut } = await import("@/lib/auth");
    await signOut({ redirectTo: "/admin/login" });
  }

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><p className="native-eyebrow native-eyebrow--dark">Moklet Hub Admin</p><h1>Selamat datang, {admin.nama}.</h1></div><form action={logout}><button className="admin-signout" type="submit">Keluar</button></form></header><div className="admin-stats"><article><strong>{jobCount}</strong><span>Lowongan aktif</span></article><article><strong>{applications.length}</strong><span>Lamaran terbaru</span></article><article><strong>{unreadMessages}</strong><span>Pesan belum dibaca</span></article></div><section className="admin-table-section"><div className="admin-section-heading"><h2>Lamaran masuk</h2><span>25 terbaru</span></div><div className="admin-table-wrap"><table><thead><tr><th>Pelamar</th><th>Posisi</th><th>Perusahaan</th><th>Status</th><th>Diterima</th></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td><strong>{application.namaLengkap}</strong><small>{application.email}<br />{application.kelasAlumni}</small></td><td>{application.lowongan.judulPosisi}</td><td>{application.lowongan.perusahaan.nama}</td><td><span className="admin-status">{application.status}</span></td><td>{application.createdAt.toLocaleDateString("id-ID")}</td></tr>)}</tbody></table>{applications.length === 0 && <p className="admin-empty">Belum ada lamaran masuk.</p>}</div></section></div></main>;
}
