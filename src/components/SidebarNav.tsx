"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenLine,
  Megaphone,
  LifeBuoy,
  UserCog,
  Users,
  Newspaper,
  FolderGit2,
  UserCircle2,
  Mail,
  QrCode,
} from "lucide-react";

const panelLinks = [
  { href: "/panel", label: "Panelim", icon: LayoutDashboard },
  { href: "/panel/makalelerim", label: "Makalelerim", icon: PenLine },
  { href: "/panel/ilanlarim", label: "İlanlarım", icon: Megaphone },
  { href: "/panel/destek", label: "Destek", icon: LifeBuoy },
  { href: "/panel/profil", label: "Profilim", icon: UserCog },
];

const adminLinks = [
  { href: "/yonetim", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/yonetim/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/yonetim/haberler", label: "Haberler", icon: Newspaper },
  { href: "/yonetim/makaleler", label: "Makale Onayı", icon: PenLine },
  { href: "/yonetim/ilanlar", label: "İlan Onayı", icon: Megaphone },
  { href: "/yonetim/projeler", label: "Projeler", icon: FolderGit2 },
  { href: "/yonetim/kadro", label: "Kadro", icon: UserCircle2 },
  { href: "/yonetim/destek", label: "Destek Talepleri", icon: LifeBuoy },
  { href: "/yonetim/iletisim", label: "İletişim Kutusu", icon: Mail },
  { href: "/yonetim/whatsapp", label: "WhatsApp Bot", icon: QrCode },
];

const contentOnlyHrefs = new Set(["/yonetim/haberler", "/yonetim/projeler"]);

export function SidebarNav({
  variant,
  title,
  contentOnly = false,
}: {
  variant: "panel" | "yonetim";
  title: string;
  contentOnly?: boolean;
}) {
  const pathname = usePathname();
  const links =
    variant === "panel" ? panelLinks : contentOnly ? adminLinks.filter((l) => contentOnlyHrefs.has(l.href)) : adminLinks;

  return (
    <aside className="w-full shrink-0 md:w-56">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-accent text-white" : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Icon size={16} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
