import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { TeamMember } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { TeamMemberForm } from "@/components/TeamMemberForm";
import { TeamMemberRow } from "@/components/TeamMemberRow";

export const metadata = { title: "Kadro | Yönetim | TeknoAI-T" };

export default async function AdminTeamPage() {
  const token = await getAccessToken();
  const team = await apiFetch<TeamMember[]>("/api/team/admin", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Kadro</h1>
        <p className="mt-1 text-muted">Ekip üyelerini yönetin.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Kadro Üyesi</h2>
        <TeamMemberForm />
      </Card>

      <div className="space-y-3">
        {team.map((m) => (
          <TeamMemberRow key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
