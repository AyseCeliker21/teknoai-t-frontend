"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function NewTicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/support", {
        method: "POST",
        body: JSON.stringify({ subject, initialMessage }),
      });
      if (!res.ok) throw new Error("Destek talebi oluşturulamadı.");
      const ticket = await res.json();
      router.push(`/panel/destek/${ticket.id}`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject">Konu</Label>
        <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="initialMessage">Mesajın</Label>
        <Textarea
          id="initialMessage"
          required
          value={initialMessage}
          onChange={(e) => setInitialMessage(e.target.value)}
        />
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Talebi Oluştur"}
      </Button>
    </form>
  );
}
