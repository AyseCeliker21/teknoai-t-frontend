"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";
import type { ProjectDetail } from "@/lib/types";

const statuses = [
  { value: "Planlaniyor", label: "Planlanıyor" },
  { value: "DevamEdiyor", label: "Devam Ediyor" },
  { value: "Tamamlandi", label: "Tamamlandı" },
];

export function ProjectForm({ initial, id }: { initial?: ProjectDetail; id?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initial?.descriptionMarkdown ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [techStack, setTechStack] = useState(initial?.techStack ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(initial?.demoUrl ?? "");
  const [status, setStatus] = useState(initial?.status ?? "Planlaniyor");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(id ? `/api/proxy/projects/${id}` : "/api/proxy/projects", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({
          title,
          summary,
          descriptionMarkdown,
          coverImageUrl: coverImageUrl || null,
          techStack: techStack || null,
          repoUrl: repoUrl || null,
          demoUrl: demoUrl || null,
          status,
        }),
      });

      if (!id) {
        setTitle("");
        setSummary("");
        setDescriptionMarkdown("");
        setCoverImageUrl("");
        setTechStack("");
        setRepoUrl("");
        setDemoUrl("");
      } else {
        const updated = await res.json();
        router.push(`/yonetim/projeler/${updated.slug}/duzenle`);
      }
      router.refresh();
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
        <Label htmlFor="descriptionMarkdown">Açıklama (Markdown)</Label>
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
          <Label htmlFor="status">Durum</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
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
      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor…" : id ? "Güncelle" : "Oluştur"}
      </Button>
    </form>
  );
}
