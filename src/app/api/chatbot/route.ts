import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rate limit sederhana berbasis memori — cukup untuk skala trafik website
// sekolah, tidak perlu Redis/layanan eksternal. Reset otomatis tiap 1 menit.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT_PER_MENIT = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= LIMIT_PER_MENIT) return true;

  entry.count += 1;
  return false;
}

async function generateAnswer(question: string, systemPrompt: string) {
  const provider = process.env.AI_PROVIDER ?? "anthropic";
  if (provider === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not configured.");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nPertanyaan pengguna: ${question}` }] }] }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Maaf, MokletBot belum bisa menjawab saat ini.";
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured.");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 500, system: systemPrompt, messages: [{ role: "user", content: question }] }),
  });
  const data = await response.json();
  return data?.content?.find((c: { type: string }) => c.type === "text")?.text ?? "Maaf, MokletBot belum bisa menjawab saat ini.";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak pertanyaan, coba lagi sebentar lagi." },
      { status: 429 }
    );
  }

  const { pertanyaan } = await req.json();
  if (!pertanyaan || typeof pertanyaan !== "string") {
    return NextResponse.json({ error: "Pertanyaan tidak valid." }, { status: 400 });
  }

  // Ambil seluruh FAQ terbaru sebagai basis pengetahuan (context stuffing —
  // cukup untuk skala puluhan entri, tidak perlu vector DB/RAG kompleks)
  const faqList = await prisma.faq.findMany({
    orderBy: { kategori: "asc" },
  });
  const knowledgeBase = faqList
    .map((f) => `Q: ${f.pertanyaan}\nA: ${f.jawaban}`)
    .join("\n\n");

  const systemPrompt = `Kamu adalah MokletBot, asisten virtual resmi SMK Telkom Malang.
Jawab HANYA berdasarkan basis pengetahuan di bawah ini. Jangan mengarang informasi
yang tidak ada di sana. Kalau pertanyaan di luar cakupan, arahkan dengan sopan ke
kontak WhatsApp admin sekolah. Gunakan Bahasa Indonesia yang ramah dan singkat.

=== BASIS PENGETAHUAN ===
${knowledgeBase}`;

  try {
    const jawaban = await generateAnswer(pertanyaan, systemPrompt);

    // Log percakapan untuk evaluasi cakupan FAQ ke depan (opsional tapi berguna)
    await prisma.chatLog.create({ data: { pertanyaan, jawaban } });

    return NextResponse.json({ jawaban });
  } catch (error) {
    console.error("MokletBot error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Coba lagi sebentar lagi." },
      { status: 500 }
    );
  }
}
