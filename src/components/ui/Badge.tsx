import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "bg-surface-2 text-muted",
  accent: "bg-accent/15 text-accent-hover",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusVariant(status: string): keyof typeof variants {
  if (["Approved", "Closed", "Tamamlandi"].includes(status)) return "success";
  if (["Pending", "Open", "Planlaniyor"].includes(status)) return "warning";
  if (status === "Rejected") return "default";
  return "accent";
}
