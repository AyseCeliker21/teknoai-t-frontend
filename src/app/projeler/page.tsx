import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { ProjectListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { statusLabel } from "@/lib/utils";
import { FolderGit2 } from "lucide-react";

export const metadata = { title: "Projeler | TeknoAI-T" };

export default async function ProjectsPage() {
  const result = await apiFetch<PagedResult<ProjectListItem>>("/api/projects?page=1&pageSize=24").catch(
    () => ({ items: [], page: 1, pageSize: 24, totalCount: 0, totalPages: 0 }) as PagedResult<ProjectListItem>
  );

  return (
    <>
      <PageHeader
        title="Projeler"
        description="Topluluk üyelerinin birlikte geliştirdiği projeler."
        action={
          <LinkButton href="/panel/projelerim" variant="heroSecondary">
            <FolderGit2 size={16} /> Proje Öner
          </LinkButton>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {result.items.length === 0 ? (
        <p className="text-muted">Henüz proje eklenmedi.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((p) => (
            <Link key={p.id} href={`/projeler/${p.slug}`}>
              <Card className="h-full p-5 transition-colors hover:border-accent/50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{p.title}</h3>
                  <Badge variant={statusVariant(p.status)}>{statusLabel(p.status)}</Badge>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{p.summary}</p>
                {p.techStack && <p className="mt-3 text-xs text-accent-hover">{p.techStack}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
