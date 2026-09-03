import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ProjectListItem, ProjectRequestListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { ProjectForm } from "@/components/ProjectForm";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/Button";
import { ModerationControl } from "@/components/ModerationControl";
import { statusLabel, formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

export const metadata = { title: "Projeler | Yönetim | TeknoAI-T" };

export default async function AdminProjectsPage() {
  const token = await getAccessToken();
  const [result, pending] = await Promise.all([
    apiFetch<PagedResult<ProjectListItem>>("/api/projects?page=1&pageSize=50", { token }).catch(
      () => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<ProjectListItem>
    ),
    apiFetch<PagedResult<ProjectRequestListItem>>("/api/projects/moderation/pending?page=1&pageSize=50", { token }).catch(
      () => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<ProjectRequestListItem>
    ),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projeler</h1>
        <p className="mt-1 text-muted">Proje ekleyin, düzenleyin veya üyelerin önerdiği projeleri onaylayın.</p>
      </div>

      <div>
        <h2 className="mb-4 font-semibold">Onay Bekleyen Proje İstekleri</h2>
        <div className="space-y-3">
          {pending.items.length === 0 && <p className="text-muted">Onay bekleyen proje isteği yok.</p>}
          {pending.items.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="text-sm text-muted">
                    {r.authorName} · {formatDate(r.createdAtUtc)}
                  </p>
                </div>
                <ModerationControl type="projects" id={r.id} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Proje</h2>
        <ProjectForm />
      </Card>

      <div className="space-y-3">
        {result.items.map((p) => (
          <Card key={p.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{p.title}</h3>
                <Badge variant={statusVariant(p.status)}>{statusLabel(p.status)}</Badge>
              </div>
              <p className="text-sm text-muted">{p.techStack}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/yonetim/projeler/${p.slug}/duzenle`}>
                <Button variant="secondary" size="sm">
                  <Pencil size={14} /> Düzenle
                </Button>
              </Link>
              <DeleteButton url={`/api/proxy/projects/${p.id}`} confirmText="Bu projeyi silmek istediğine emin misin?" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
