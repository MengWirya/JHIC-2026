import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before running Prisma commands.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Tambahkan properti seed di bawah ini:
    seed: "tsx prisma/seed.ts", // Gunakan "bun ./prisma/seed.ts" jika Anda menggunakan runtime Bun
  },
  datasource: {
    url: databaseUrl,
  },
});