"use client";

import { useState, type FormEvent } from "react";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/proxy/contact", {
        method: "POST",
        body: JSON.stringify({ fullName, email, subject, body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || data?.message || "Mesaj gönderilemedi.");
      }
      setSent(true);
      setFullName("");
      setEmail("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 size={40} className="text-success" />
        <p className="font-medium">Mesajınız iletildi, teşekkür ederiz!</p>
        <Button variant="secondary" size="sm" onClick={() => setSent(false)}>
          Yeni mesaj gönder
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Ad Soyad</Label>
        <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="subject">Konu</Label>
        <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="body">Mesajınız</Label>
        <Textarea id="body" required value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      {error && <p className="text-sm text-accent-hover">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Gönderiliyor…" : "Gönder"}
      </Button>
    </form>
  );
}
