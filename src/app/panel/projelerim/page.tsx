import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ProjectRequestListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, formatDate } from "@/lib/utils";
import { ProjectRequestForm } from "@/components/ProjectRequestForm";

export const metadata = { title: "Projelerim | TeknoAI-T" };

export default async function MyProjectsPage() {
  const token = await getAccessToken();
  const requests = await apiFetch<ProjectRequestListItem[]>("/api/projects/mine", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projelerim</h1>
        <p className="mt-1 text-muted">Önerdiğin projeler ekip onayından sonra yayınlanır.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Proje Öner</h2>
        <ProjectRequestForm />
      </Card>

      <div className="space-y-3">
        {requests.length === 0 && <p className="text-muted">Henüz proje önermedin.</p>}
        {requests.map((r) => (
          <Card key={r.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{r.title}</h3>
              <p className="text-sm text-muted">{formatDate(r.createdAtUtc)}</p>
            </div>
            <Badge variant={statusVariant(r.moderationStatus)}>{statusLabel(r.moderationStatus)}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
