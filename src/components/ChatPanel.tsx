"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { Card } from "@/components/ui/Card";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useAssistantChat();
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
    <Card className="flex h-[32rem] flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Merhaba! Ben TeknoAI Asistan. Haberler, projeler, makaleler, ilanlar ve destek konularında
            sana yardımcı olabilirim.
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
    </Card>
  );
}
