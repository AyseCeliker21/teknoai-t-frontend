"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";

export function ProjectRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/projects/submit", {
        method: "POST",
        body: JSON.stringify({
          title,
          summary,
          descriptionMarkdown,
          coverImageUrl: coverImageUrl || null,
          techStack: techStack || null,
          repoUrl: repoUrl || null,
          demoUrl: demoUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "Proje isteği gönderilemedi.");
      }
      setTitle("");
      setSummary("");
      setDescriptionMarkdown("");
      setCoverImageUrl("");
      setTechStack("");
      setRepoUrl("");
      setDemoUrl("");
      setMessage("Proje isteğin onaya gönderildi!");
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
        <Textarea id="summary" required value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-20" />
      </div>
      <div>
        <Label htmlFor="descriptionMarkdown">Açıklama (Markdown desteklenir)</Label>
        <Textarea
          id="descriptionMarkdown"
          required
          value={descriptionMarkdown}
          onChange={(e) => setDescriptionMarkdown(e.target.value)}
          className="min-h-40"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="techStack">Teknolojiler</Label>
          <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Next.js, .NET, SQL Server" />
        </div>
        <div>
          <Label htmlFor="repoUrl">Repo URL</Label>
          <Input id="repoUrl" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input id="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
        </div>
      </div>
      <ImageUploader
        label="Kapak Görseli"
        category="projects"
        aspect={1.91}
        value={coverImageUrl}
        onChange={setCoverImageUrl}
      />
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Onaya Gönder"}
      </Button>
    </form>
  );
}
