import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const pathname = req.nextUrl?.pathname || "";
    const isLoggedIn = !!req.auth;

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

    if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
    }

    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};