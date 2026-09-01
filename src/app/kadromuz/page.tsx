import { apiFetch } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Code2, Link2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Kadromuz | TeknoAI-T" };

export default async function TeamPage() {
  const team = await apiFetch<TeamMember[]>("/api/team").catch(() => []);

  return (
    <>
      <PageHeader
        title="Kadromuz"
        description="TeknoAI-T'yi bir arada tutan gönüllü ekip."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {team.length === 0 ? (
        <p className="text-muted">Henüz kadro üyesi eklenmedi.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <Card key={m.id} className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-2 text-xl font-bold text-accent-hover">
                {m.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <h3 className="mt-4 font-semibold">{m.fullName}</h3>
              <p className="text-sm text-accent-hover">{m.title}</p>
              {m.bio && <p className="mt-3 text-sm text-muted">{m.bio}</p>}
              {(m.linkedInUrl || m.gitHubUrl) && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  {m.gitHubUrl && (
                    <a href={m.gitHubUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">
                      <Code2 size={18} />
                    </a>
                  )}
                  {m.linkedInUrl && (
                    <a href={m.linkedInUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">
                      <Link2 size={18} />
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
