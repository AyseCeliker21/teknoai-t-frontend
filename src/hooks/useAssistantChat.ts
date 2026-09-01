"use client";

import { useState } from "react";
import type { AssistantConversationSummary } from "@/lib/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: text }),
      });

      if (!res.body) throw new Error("Akış alınamadı");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Asistan şu anda yanıt veremiyor.");
      }

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
          const lines = evt.split("\n");
          const dataLine = lines.find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const raw = dataLine.slice(5).trim();
          if (raw === "[DONE]") continue;

          const isErrorEvent = lines.some((l) => l.startsWith("event:") && l.slice(6).trim() === "error");
          if (isErrorEvent) {
            let errorMessage = "Asistan şu anda yanıt veremiyor, lütfen tekrar deneyin.";
            try {
              const parsed = JSON.parse(raw) as { error?: string };
              if (parsed?.error) errorMessage = parsed.error;
            } catch {
              /* ignore */
            }
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: errorMessage };
              return copy;
            });
            continue;
          }

          try {
            const chunk: unknown = JSON.parse(raw);
            if (typeof chunk !== "string") continue;
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

      if (!conversationId) {
        try {
          const convRes = await fetch("/api/proxy/assistant/conversations");
          if (convRes.ok) {
            const list = (await convRes.json()) as AssistantConversationSummary[];
            if (list.length > 0) setConversationId(list[0].id);
          }
        } catch {
          /* non-critical */
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu, lütfen tekrar deneyin.";
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: message };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, sendMessage };
}
