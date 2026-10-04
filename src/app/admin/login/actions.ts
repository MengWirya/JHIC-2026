"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticateAdmin(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/admin/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Email atau password yang Anda masukkan salah.";
                default:
                    return "Terjadi kesalahan sistem saat mencoba masuk.";
            }
        }
        // Wajib throw error kembali untuk pengalihan redirect NextAuth
        throw error;
    }
}