"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/DeleteButton";
import { TeamMemberForm } from "@/components/TeamMemberForm";
import type { TeamMember } from "@/lib/types";

export function TeamMemberRow({ member }: { member: TeamMember }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card className="p-5">
        <TeamMemberForm initial={member} onSaved={() => setEditing(false)} />
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => setEditing(false)}>
          İptal
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-medium">
          {member.fullName} {!member.isActive && <Badge className="ml-2">Pasif</Badge>}
        </h3>
        <p className="text-sm text-muted">{member.title}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          <Pencil size={14} /> Düzenle
        </Button>
        <DeleteButton url={`/api/proxy/team/${member.id}`} confirmText="Bu kadro üyesini silmek istediğine emin misin?" />
      </div>
    </Card>
  );
}
