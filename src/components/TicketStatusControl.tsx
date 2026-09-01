"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Field";

const statuses = [
  { value: "Open", label: "Açık" },
  { value: "InProgress", label: "İşleniyor" },
  { value: "Closed", label: "Kapatıldı" },
];

export function TicketStatusControl({ ticketId, status }: { ticketId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/proxy/support/${ticketId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="w-40"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </Select>
  );
}
