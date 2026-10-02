import { signIn } from "@/lib/auth";

export default function AdminLoginPage() {
  async function login(formData: FormData) {
    "use server";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  }

  return <main className="admin-auth-page"><section className="admin-auth-panel"><p className="native-eyebrow native-eyebrow--dark">Moklet Hub Admin</p><h1>Masuk ke dashboard.</h1><form action={login} className="admin-auth-form"><input name="email" type="email" required placeholder="Email admin" /><input name="password" type="password" required placeholder="Password" /><button className="native-button native-button--light" type="submit">Masuk</button></form></section></main>;
}
