"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/Avatar";
import { cn, formatTime } from "@/lib/utils";
import { Send, MessageCircle } from "lucide-react";
import type { ChatConversation, ChatMessage } from "@/lib/types";

export function ChatPanel({
  currentUserId,
  initialConversations,
}: {
  currentUserId: string;
  initialConversations: ChatConversation[];
}) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialConversations[0]?.userId ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const selectedUserIdRef = useRef<string | null>(selectedUserId);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.userId === selectedUserId) ?? null,
    [conversations, selectedUserId]
  );

  useEffect(() => {
    if (!selectedUserId) return;
    let cancelled = false;

    Promise.resolve()
      .then(() => {
        setLoadingMessages(true);
        setConversations((prev) => prev.map((c) => (c.userId === selectedUserId ? { ...c, unreadCount: 0 } : c)));
        return fetch(`/api/proxy/chat/messages/${selectedUserId}`);
      })
      .then((res) => (res.ok ? (res.json() as Promise<ChatMessage[]>) : Promise.reject()))
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedUserId]);

  useEffect(() => {
    let cancelled = false;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        accessTokenFactory: async () => {
          const res = await fetch("/api/chat/token");
          if (!res.ok) return "";
          const data = await res.json();
          return data.accessToken as string;
        },
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (message: ChatMessage) => {
      const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      const isActive = selectedUserIdRef.current === otherUserId;

      if (isActive) {
        setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      }

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.userId === otherUserId);
        if (idx === -1) return prev;
        const updated: ChatConversation = {
          ...prev[idx],
          lastMessage: message.content,
          lastMessageAtUtc: message.createdAtUtc,
          unreadCount: isActive ? 0 : prev[idx].unreadCount + (message.senderId === otherUserId ? 1 : 0),
        };
        const rest = prev.filter((c) => c.userId !== otherUserId);
        return [updated, ...rest];
      });
    });

    connection.onreconnected(() => setConnected(true));
    connection.onreconnecting(() => setConnected(false));
    connection.onclose(() => setConnected(false));

    connection
      .start()
      .then(() => {
        if (cancelled) {
          // Effect was cleaned up (e.g. StrictMode's dev double-invoke) before
          // the handshake finished — close it instead of leaving it dangling.
          void connection.stop();
          return;
        }
        setConnected(true);
        connectionRef.current = connection;
      })
      .catch(() => {
        if (!cancelled) setError("Sohbet sunucusuna bağlanılamadı.");
      });

    return () => {
      cancelled = true;
      void connection.stop();
      if (connectionRef.current === connection) {
        connectionRef.current = null;
      }
    };
  }, [currentUserId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || !selectedUserId || !connectionRef.current) return;

    setDraft("");
    setError(null);
    try {
      await connectionRef.current.invoke("SendMessage", selectedUserId, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[280px_1fr] md:h-[70vh]">
      <Card className="flex flex-col overflow-hidden p-0">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Arkadaşların</h2>
          <p className="mt-0.5 text-xs text-muted">
            {connected ? "Bağlı" : "Bağlanıyor…"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted">
              Henüz arkadaşın yok. Bir üyeyle karşılıklı takipleşince burada sohbet edebilirsin.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.userId}
                onClick={() => setSelectedUserId(c.userId)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface-2",
                  selectedUserId === c.userId && "bg-surface-2"
                )}
              >
                <Avatar name={c.fullName} avatarUrl={c.avatarUrl} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.fullName}</p>
                    {c.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">{c.lastMessage ?? "Henüz mesaj yok"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      <Card className="flex flex-col overflow-hidden p-0">
        {selectedConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar name={selectedConversation.fullName} avatarUrl={selectedConversation.avatarUrl} size={36} />
              <h2 className="font-semibold">{selectedConversation.fullName}</h2>
            </div>

            <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMessages ? (
                <p className="text-sm text-muted">Yükleniyor…</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted">Henüz mesaj yok. İlk mesajı sen gönder!</p>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === currentUserId;
                  return (
                    <div key={m.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                          isMine ? "bg-accent text-white" : "bg-surface-2 text-foreground"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                        <p className={cn("mt-1 text-[10px]", isMine ? "text-white/70" : "text-muted")}>
                          {formatTime(m.createdAtUtc)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {error && <p className="px-4 pb-1 text-sm text-accent-hover">{error}</p>}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSend();
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Bir mesaj yaz…"
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
              <Button type="submit" size="sm" disabled={!draft.trim() || !connected}>
                <Send size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted">
            <MessageCircle size={28} />
            <p className="text-sm">Sohbet etmek için soldan bir arkadaş seç.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
