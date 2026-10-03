export { auth as middleware } from "@/lib/auth"

// Konfigurasi rute mana saja yang dijaga oleh satpam
export const config = {
    matcher: [
        // Melindungi semua halaman di dalam /admin, KECUALI /admin/login
        "/admin/:path*",
    ],
}