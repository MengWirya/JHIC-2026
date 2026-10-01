"use client";

import { Bot, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

const quickReplies = ["Info PPDB 2026", "Lowongan BKK", "Daftar Jurusan"];

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

export function MokletBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Halo, saya MokletBot. Ada yang ingin kamu ketahui tentang SMK Telkom Malang?",
    },
  ]);

  async function askBot(text: string) {
    const trimmedQuestion = text.trim();
    if (!trimmedQuestion || isLoading) return;

    setQuestion("");
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: trimmedQuestion },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pertanyaan: trimmedQuestion }),
      });
      const data = (await response.json()) as { jawaban?: string; error?: string };

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "bot",
          text: data.jawaban ?? data.error ?? "Maaf, MokletBot belum bisa menjawab saat ini.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Koneksi sedang bermasalah. Silakan coba lagi sebentar lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askBot(question);
  }

  return (
    <div className="moklet-bot">
      {isOpen && (
        <section className="moklet-bot__panel" aria-label="MokletBot">
          <header className="moklet-bot__header">
            <div className="moklet-bot__identity">
              <span className="moklet-bot__avatar"><Bot size={18} /></span>
              <div>
                <strong>MokletBot</strong>
                <span>Asisten SMK Telkom Malang</span>
              </div>
            </div>
            <button className="moklet-bot__close" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup MokletBot">
              <X size={18} />
            </button>
          </header>

          <div className="moklet-bot__messages" aria-live="polite">
            {messages.map((message) => (
              <p className={`moklet-bot__message moklet-bot__message--${message.role}`} key={message.id}>
                {message.text}
              </p>
            ))}
            {isLoading && <p className="moklet-bot__message moklet-bot__message--bot moklet-bot__typing">Mengetik...</p>}
          </div>

          <div className="moklet-bot__quick-replies">
            {quickReplies.map((reply) => (
              <button key={reply} type="button" onClick={() => void askBot(reply)} disabled={isLoading}>
                {reply}
              </button>
            ))}
          </div>

          <form className="moklet-bot__form" onSubmit={handleSubmit}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Tulis pertanyaan..." aria-label="Pertanyaan untuk MokletBot" disabled={isLoading} />
            <button type="submit" aria-label="Kirim pertanyaan" disabled={!question.trim() || isLoading}>
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button className="moklet-bot__trigger" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label={isOpen ? "Tutup MokletBot" : "Buka MokletBot"}>
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}