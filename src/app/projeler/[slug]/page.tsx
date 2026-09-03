import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getAccessToken, getSessionUser } from "@/lib/session";
import type { ProjectDetail, Cv } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel } from "@/lib/utils";
import { Code2, ExternalLink, Sparkles } from "lucide-react";

function computeSkillMatch(techStack: string | null | undefined, skills: string[]): number | null {
  if (!techStack || skills.length === 0) return null;
  const required = techStack
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (required.length === 0) return null;

  const mine = skills.map((s) => s.toLowerCase());
  const matched = required.filter((req) => mine.some((s) => s.includes(req) || req.includes(s)));
  return Math.round((matched.length / required.length) * 100);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: ProjectDetail;
  try {
    project = await apiFetch<ProjectDetail>(`/api/projects/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const me = await getSessionUser();
  let matchPercent: number | null = null;
  if (me) {
    const token = await getAccessToken();
    const myCv = await apiFetch<Cv | null>("/api/cv/me", { token })
      .then((c) => c ?? null)
      .catch(() => null);
    if (myCv) {
      matchPercent = computeSkillMatch(project.techStack, myCv.skills);
    }
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex items-center gap-3">
        <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
        {project.techStack && <span className="text-sm text-accent-hover">{project.techStack}</span>}
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm hover:text-accent-hover"
          >
            <Code2 size={16} /> Kaynak Kod
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm hover:text-accent-hover"
          >
            <ExternalLink size={16} /> Canlı Demo
          </a>
        )}
      </div>

      <div className="mt-8">
        <MarkdownContent content={project.descriptionMarkdown} />
      </div>

      {project.members.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Proje Ekibi</h2>
          <div className="flex flex-wrap gap-3">
            {project.members.map((m) => (
              <div
                key={m.teamMemberId}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-accent-hover">
                  {m.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.fullName}</p>
                  <p className="text-xs text-muted">{m.roleInProject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matchPercent !== null && (
        <div className="mt-10 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
          <Sparkles size={20} className="shrink-0 text-accent-hover" />
          <p className="text-sm">
            Yeteneklerinle <strong>%{matchPercent}</strong> uyumlu bir proje. Özgeçmişindeki beceriler bu projenin
            teknoloji yığınıyla karşılaştırılarak hesaplandı.
          </p>
        </div>
      )}
    </article>
  );
}
