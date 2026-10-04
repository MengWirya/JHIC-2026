import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnLogin = nextUrl.pathname === "/admin/login" || nextUrl.pathname === "/admin";

            if (isOnAdmin && !isOnLogin) {
                if (isLoggedIn) return true;
                return false; // Otomatis redirect ke signIn page (/admin/login)
            } else if (isLoggedIn && isOnLogin) {
                return Response.redirect(new URL("/admin/dashboard", nextUrl));
            }
            return true;
        },
    },
    providers: [], // Diisi di lib/auth.ts
} satisfies NextAuthConfig;