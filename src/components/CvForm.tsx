"use client";

import { useRef, useState, type FormEvent } from "react";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Upload, X } from "lucide-react";
import type { Cv, CvExperienceItem, CvEducationItem } from "@/lib/types";

export function CvForm({ initial }: { initial: Cv | null }) {
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [skillDraft, setSkillDraft] = useState("");
  const [experience, setExperience] = useState<CvExperienceItem[]>(initial?.experience ?? []);
  const [education, setEducation] = useState<CvEducationItem[]>(initial?.education ?? []);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addSkill() {
    const value = skillDraft.trim();
    if (value && !skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkills([...skills, value]);
    }
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  function addExperience() {
    setExperience([...experience, { title: "", company: "", startDate: "", endDate: "", description: "" }]);
  }

  function updateExperience(index: number, patch: Partial<CvExperienceItem>) {
    setExperience(experience.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function removeExperience(index: number) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  function addEducation() {
    setEducation([...education, { school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  }

  function updateEducation(index: number, patch: Partial<CvEducationItem>) {
    setEducation(education.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function removeEducation(index: number) {
    setEducation(education.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/proxy/cv/me", {
        method: "PUT",
        body: JSON.stringify({ summary: summary || null, skills, experience, education }),
      });
      if (!res.ok) throw new Error("CV kaydedilemedi.");
      setMessage("CV'n kaydedildi.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setExtracting(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/proxy/cv/me/extract", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.title || "CV işlenemedi, lütfen bilgilerini elle gir.");

      const cv: Cv = data;
      setSummary(cv.summary ?? "");
      setSkills(cv.skills ?? []);
      setExperience(cv.experience ?? []);
      setEducation(cv.education ?? []);
      setMessage("CV'nden bilgiler dolduruldu — gözden geçirip kaydet.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed border-border bg-surface-2 p-4">
        <p className="text-sm font-medium">CV&apos;ni yükle, bilgilerini otomatik dolduralım</p>
        <p className="mt-1 text-xs text-muted">PDF, JPEG veya PNG — en fazla 8MB. Doldurduktan sonra düzenleyip kaydedebilirsin.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          disabled={extracting}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={14} /> {extracting ? "İşleniyor…" : "CV Yükle"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="summary">Özet</Label>
          <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-24" />
        </div>

        <div>
          <Label htmlFor="skillDraft">Yetenekler</Label>
          <div className="flex gap-2">
            <Input
              id="skillDraft"
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Örn. React, ekle için Enter'a bas"
            />
            <Button type="button" variant="secondary" onClick={addSkill}>
              Ekle
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-hover"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-foreground">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Deneyim</Label>
            <Button type="button" variant="secondary" size="sm" onClick={addExperience}>
              + Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {experience.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeExperience(i)} className="text-muted hover:text-accent-hover">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Pozisyon"
                    value={item.title}
                    onChange={(e) => updateExperience(i, { title: e.target.value })}
                  />
                  <Input
                    placeholder="Şirket"
                    value={item.company}
                    onChange={(e) => updateExperience(i, { company: e.target.value })}
                  />
                  <Input
                    placeholder="Başlangıç (ör. 2022)"
                    value={item.startDate ?? ""}
                    onChange={(e) => updateExperience(i, { startDate: e.target.value })}
                  />
                  <Input
                    placeholder="Bitiş (boş = halen)"
                    value={item.endDate ?? ""}
                    onChange={(e) => updateExperience(i, { endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  className="mt-3 min-h-16"
                  placeholder="Açıklama"
                  value={item.description ?? ""}
                  onChange={(e) => updateExperience(i, { description: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Eğitim</Label>
            <Button type="button" variant="secondary" size="sm" onClick={addEducation}>
              + Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {education.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeEducation(i)} className="text-muted hover:text-accent-hover">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Okul"
                    value={item.school}
                    onChange={(e) => updateEducation(i, { school: e.target.value })}
                  />
                  <Input
                    placeholder="Derece (ör. Lisans)"
                    value={item.degree ?? ""}
                    onChange={(e) => updateEducation(i, { degree: e.target.value })}
                  />
                  <Input
                    placeholder="Bölüm"
                    value={item.field ?? ""}
                    onChange={(e) => updateEducation(i, { field: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Başlangıç"
                      value={item.startDate ?? ""}
                      onChange={(e) => updateEducation(i, { startDate: e.target.value })}
                    />
                    <Input
                      placeholder="Bitiş"
                      value={item.endDate ?? ""}
                      onChange={(e) => updateEducation(i, { endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && <p className="text-sm text-accent-hover">{message}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor…" : "CV'mi Kaydet"}
        </Button>
      </form>
    </div>
  );
}
