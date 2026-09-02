import Link from "next/link";
import { TeknoLogoMark } from "@/components/TeknoLogoMark";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
                <TeknoLogoMark size={16} />
              </span>
              TeknoAI-T
            </div>
            <p className="mt-3 text-sm text-muted">
              Teknolojinin zirvesinde, geleceğin merkezinde.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Topluluk</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/kadromuz" className="hover:text-foreground">Kadromuz</Link></li>
              <li><Link href="/haberler" className="hover:text-foreground">Haberler</Link></li>
              <li><Link href="/projeler" className="hover:text-foreground">Projeler</Link></li>
              <li><Link href="/hibeler" className="hover:text-foreground">Hibeler / Fonlar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Katıl</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/ilanlar" className="hover:text-foreground">İlanlar</Link></li>
              <li><Link href="/kayit" className="hover:text-foreground">Üye Ol</Link></li>
              <li><Link href="/uyeler" className="hover:text-foreground">Üyeler</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Destek</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/iletisim" className="hover:text-foreground">İletişim</Link></li>
              <li><Link href="/panel/destek" className="hover:text-foreground">Destek Talebi</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} TeknoAI-T. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
