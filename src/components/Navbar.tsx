"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { LinkButton } from "@/components/ui/Button";
import { TeknoLogoMark } from "@/components/TeknoLogoMark";
import type { SessionUser } from "@/lib/types";

const links = [
  { href: "/kadromuz", label: "Kadromuz" },
  { href: "/haberler", label: "Haberler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/makaleler", label: "Makaleler" },
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const isAdmin = user?.roles.includes("Yonetici");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <TeknoLogoMark size={18} />
          </span>
          <span>
            Tekno<span className="text-accent-hover">AI</span>-T
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LinkButton href="/asistan" variant="ghost" size="sm">
            <Sparkles size={16} className="text-accent-hover" /> Asistan
          </LinkButton>
          {user ? (
            <>
              {isAdmin && (
                <LinkButton href="/yonetim" variant="secondary" size="sm">
                  Yönetim
                </LinkButton>
              )}
              <LinkButton href="/panel" variant="secondary" size="sm">
                {user.fullName.split(" ")[0]}
              </LinkButton>
              <LogoutButton />
            </>
          ) : (
            <>
              <LinkButton href="/giris" variant="ghost" size="sm">
                Giriş
              </LinkButton>
              <LinkButton href="/kayit" variant="primary" size="sm">
                Kayıt Ol
              </LinkButton>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/asistan"
              className="rounded-lg px-3 py-2 text-sm text-accent-hover hover:bg-surface-2"
              onClick={() => setOpen(false)}
            >
              TeknoAI Asistan
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  {isAdmin && (
                    <LinkButton href="/yonetim" variant="secondary" size="sm">
                      Yönetim
                    </LinkButton>
                  )}
                  <LinkButton href="/panel" variant="secondary" size="sm">
                    Panelim
                  </LinkButton>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <LinkButton href="/giris" variant="secondary" size="sm">
                    Giriş
                  </LinkButton>
                  <LinkButton href="/kayit" variant="primary" size="sm">
                    Kayıt Ol
                  </LinkButton>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
