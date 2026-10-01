import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MokletBot } from "@/components/moklet-bot";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMK Telkom Malang | School of Global Digitalent",
  description:
    "SMK Telkom Malang adalah sekolah vokasi teknologi dan informatika untuk menyiapkan talenta digital berkarakter dan berdaya saing global.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <MokletBot />
      </body>
    </html>
  );
}
