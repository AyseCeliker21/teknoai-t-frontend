"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ArticleForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/articles", {
        method: "POST",
        body: JSON.stringify({ title, summary, contentMarkdown, tags: tags || null, coverImageUrl: coverImageUrl || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "Makale gönderilemedi.");
      }
      setTitle("");
      setSummary("");
      setContentMarkdown("");
      setTags("");
      setCoverImageUrl("");
      setMessage("Makalen onaya gönderildi!");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Başlık</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="summary">Özet</Label>
        <Textarea
          id="summary"
          required
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="min-h-20"
        />
      </div>
      <div>
        <Label htmlFor="contentMarkdown">İçerik (Markdown desteklenir)</Label>
        <Textarea
          id="contentMarkdown"
          required
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
          className="min-h-48"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="tags">Etiketler</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="yapay-zeka, python" />
        </div>
        <div>
          <Label htmlFor="coverImageUrl">Kapak Görseli URL</Label>
          <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
        </div>
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Onaya Gönder"}
      </Button>
    </form>
  );
}
