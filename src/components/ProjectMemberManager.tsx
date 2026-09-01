"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Select, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { ProjectMember, TeamMember } from "@/lib/types";

export function ProjectMemberManager({
  projectId,
  members,
  team,
}: {
  projectId: string;
  members: ProjectMember[];
  team: TeamMember[];
}) {
  const router = useRouter();
  const [teamMemberId, setTeamMemberId] = useState(team[0]?.id ?? "");
  const [roleInProject, setRoleInProject] = useState("");
  const [loading, setLoading] = useState(false);

  const available = team.filter((t) => !members.some((m) => m.teamMemberId === t.id));

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!teamMemberId) return;
    setLoading(true);
    try {
      await fetch(`/api/proxy/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ teamMemberId, roleInProject }),
      });
      setRoleInProject("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(teamMemberIdToRemove: string) {
    setLoading(true);
    try {
      await fetch(`/api/proxy/projects/${projectId}/members/${teamMemberIdToRemove}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <span
            key={m.teamMemberId}
            className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-sm"
          >
            {m.fullName} <span className="text-muted">· {m.roleInProject}</span>
            <button onClick={() => handleRemove(m.teamMemberId)} disabled={loading} className="text-muted hover:text-accent-hover">
              <X size={14} />
            </button>
          </span>
        ))}
        {members.length === 0 && <p className="text-sm text-muted">Henüz ekip üyesi atanmadı.</p>}
      </div>

      {available.length > 0 && (
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div>
            <Select value={teamMemberId} onChange={(e) => setTeamMemberId(e.target.value)} className="w-48">
              {available.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName}
                </option>
              ))}
            </Select>
          </div>
          <Input
            placeholder="Projedeki rolü"
            value={roleInProject}
            onChange={(e) => setRoleInProject(e.target.value)}
            className="w-48"
          />
          <Button type="submit" size="sm" disabled={loading}>
            Ekle
          </Button>
        </form>
      )}
    </div>
  );
}
