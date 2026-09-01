import type { Badge } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BadgeList({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return <p className="text-sm text-muted">Henüz rozet kazanılmadı.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((b) => (
        <div
          key={b.key}
          title={`${b.description} · ${formatDate(b.awardedAtUtc)}`}
          className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm"
        >
          <span className="text-base leading-none">{b.icon}</span>
          <span>{b.name}</span>
        </div>
      ))}
    </div>
  );
}
