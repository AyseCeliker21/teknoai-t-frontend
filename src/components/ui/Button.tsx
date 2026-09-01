import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<string, string> = {
  primary: "bg-accent hover:bg-accent-hover text-white",
  secondary: "bg-surface-2 hover:bg-surface-2/70 text-foreground border border-border",
  ghost: "hover:bg-surface-2 text-foreground",
  danger: "bg-red-950 hover:bg-red-900 text-red-200 border border-red-900",
  heroPrimary: "bg-white hover:bg-white/90 text-accent-2",
  heroSecondary: "bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur",
};

const sizes: Record<string, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
