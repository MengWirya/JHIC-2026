import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 🟢 Naikkan batas ukuran payload ke 10MB
    },
  },
};

export default nextConfig;
