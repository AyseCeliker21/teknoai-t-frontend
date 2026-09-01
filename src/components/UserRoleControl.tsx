"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const allRoles = ["Uye", "Editor", "Yonetici"];
const roleLabels: Record<string, string> = { Uye: "Üye", Editor: "Editör", Yonetici: "Yönetici" };

export function UserRoleControl({
  userId,
  roles,
  lockedOut,
}: {
  userId: string;
  roles: string[];
  lockedOut: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(roles);
  const [loading, setLoading] = useState(false);

  function toggle(role: string) {
    setSelected((s) => (s.includes(role) ? s.filter((r) => r !== role) : [...s, role]));
  }

  async function saveRoles() {
    setLoading(true);
    try {
      await fetch(`/api/proxy/admin/users/${userId}/roles`, {
        method: "PUT",
        body: JSON.stringify({ roles: selected }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function toggleLockout() {
    setLoading(true);
    try {
      await fetch(`/api/proxy/admin/users/${userId}/lockout?lockedOut=${!lockedOut}`, { method: "PUT" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {allRoles.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => toggle(r)}
          className={`rounded-full px-3 py-1 text-xs ${
            selected.includes(r) ? "bg-accent text-white" : "bg-surface-2 text-muted"
          }`}
        >
          {roleLabels[r]}
        </button>
      ))}
      <Button size="sm" variant="secondary" disabled={loading} onClick={saveRoles}>
        Kaydet
      </Button>
      <Button size="sm" variant={lockedOut ? "secondary" : "danger"} disabled={loading} onClick={toggleLockout}>
        {lockedOut ? "Kilidi Aç" : "Kilitle"}
      </Button>
    </div>
  );
}
