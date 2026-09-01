import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ProjectDetail, TeamMember } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ProjectForm } from "@/components/ProjectForm";
import { ProjectMemberManager } from "@/components/ProjectMemberManager";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getAccessToken();

  const [project, team] = await Promise.all([
    apiFetch<ProjectDetail>(`/api/projects/${slug}`, { token }),
    apiFetch<TeamMember[]>("/api/team/admin", { token }).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Projeyi Düzenle</h1>

      <Card className="p-6">
        <ProjectForm id={project.id} initial={project} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Proje Ekibi</h2>
        <ProjectMemberManager projectId={project.id} members={project.members} team={team} />
      </Card>
    </div>
  );
}
