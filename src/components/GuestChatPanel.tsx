"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGuestChat } from "@/hooks/useGuestChat";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function GuestChatPanel() {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage, remaining, limitReached } = useGuestChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Misafir olarak <strong className="text-foreground">{remaining}</strong> mesaj hakkın kaldı. Sınırsız
        sohbet için{" "}
        <a href="/kayit" className="text-accent-hover hover:underline">
          ücretsiz üye ol
        </a>
        .
      </p>
      <Card className="flex h-[28rem] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <p className="text-sm text-muted">
              Merhaba! Ben TeknoAI Asistan. Bana 3 soruya kadar misafir olarak sorabilirsin.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                m.role === "user" ? "ml-auto bg-accent text-white" : "bg-surface-2 text-foreground"
              )}
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          ))}
        </div>

        {limitReached ? (
          <div className="flex flex-col items-center gap-3 border-t border-border p-5 text-center">
            <p className="text-sm text-muted">Misafir sohbet hakkın doldu.</p>
            <LinkButton href="/kayit">Ücretsiz Üye Ol</LinkButton>
          </div>
        ) : (
          <form className="flex items-center gap-2 border-t border-border p-4" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bir soru yaz…"
              className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
