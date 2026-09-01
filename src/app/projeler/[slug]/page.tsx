import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { ProjectDetail } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel } from "@/lib/utils";
import { Code2, ExternalLink } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: ProjectDetail;
  try {
    project = await apiFetch<ProjectDetail>(`/api/projects/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
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
    </article>
  );
}
