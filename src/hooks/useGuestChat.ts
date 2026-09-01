"use client";

import { useState } from "react";
import type { ChatMessage } from "@/hooks/useAssistantChat";

const GUEST_CHAT_LIMIT = 3;

export function useGuestChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [turnsUsed, setTurnsUsed] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const remaining = Math.max(0, GUEST_CHAT_LIMIT - turnsUsed);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || limitReached) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/guest-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextMessages }),
      });

      if (res.status === 403) {
        setLimitReached(true);
        const data = await res.json().catch(() => null);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: data?.message || "Misafir sohbet hakkın doldu. Devam etmek için ücretsiz üye ol.",
          };
          return copy;
        });
        return;
      }

      if (!res.body) throw new Error("Akış alınamadı");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const raw = dataLine.slice(5).trim();
          if (raw === "[DONE]") continue;
          try {
            const chunk = JSON.parse(raw) as string;
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
              return copy;
            });
          } catch {
            /* ignore partial JSON */
          }
        }
      }

      const usedNow = turnsUsed + 1;
      setTurnsUsed(usedNow);
      if (usedNow >= GUEST_CHAT_LIMIT) {
        setLimitReached(true);
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Bir hata oluştu, lütfen tekrar deneyin." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, sendMessage, remaining, limitReached };
}
