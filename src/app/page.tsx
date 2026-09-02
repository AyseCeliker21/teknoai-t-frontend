import Link from "next/link";
import { ArrowRight, Newspaper, FolderGit2, Users, HandCoins } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { NewsListItem, ProjectListItem, TeamMember, GrantListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [news, projects, team, grants] = await Promise.all([
    apiFetch<PagedResult<NewsListItem>>("/api/news?page=1&pageSize=3").catch(() => null),
    apiFetch<PagedResult<ProjectListItem>>("/api/projects?page=1&pageSize=3").catch(() => null),
    apiFetch<TeamMember[]>("/api/team").catch(() => []),
    apiFetch<PagedResult<GrantListItem>>("/api/grants?page=1&pageSize=3").catch(() => null),
  ]);

  return (
    <div>
      <section className="brand-hero-bg relative overflow-hidden border-b border-border text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Tekno<span className="text-white">AI</span>-T
            </h1>
            <p className="mt-4 text-lg font-semibold text-white/95 sm:text-xl">
              Teknolojinin Zirvesinde, Geleceğin Merkezinde
            </p>
            <p className="mt-6 text-lg text-white/80">
              Teknoloji ve yapay zekaya gönül veren herkesin bir araya geldiği topluluk platformu.
              Haberleri takip et, projelere katıl, hibe/fon fırsatlarını keşfet ve ilan paylaş.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <LinkButton href="/kayit" variant="heroPrimary" size="lg">
                Topluluğa Katıl <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/hibeler" variant="heroSecondary" size="lg">
                <HandCoins size={18} /> Hibeler / Fonlar
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Newspaper size={22} className="text-accent-hover" /> Son Haberler
          </h2>
          <Link href="/haberler" className="text-sm text-muted hover:text-foreground">
            Tümünü gör →
          </Link>
        </div>
        {news && news.items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.items.map((n) => (
              <Link key={n.id} href={`/haberler/${n.slug}`}>
                <Card className="h-full p-5 transition-colors hover:border-accent/50">
                  <p className="text-xs text-muted">{formatDate(n.publishedAtUtc)}</p>
                  <h3 className="mt-2 font-semibold leading-snug">{n.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{n.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyHint text="Henüz haber eklenmedi." />
        )}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <FolderGit2 size={22} className="text-accent-hover" /> Öne Çıkan Projeler
            </h2>
            <Link href="/projeler" className="text-sm text-muted hover:text-foreground">
              Tümünü gör →
            </Link>
          </div>
          {projects && projects.items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.items.map((p) => (
                <Link key={p.id} href={`/projeler/${p.slug}`}>
                  <Card className="h-full p-5 transition-colors hover:border-accent/50">
                    <h3 className="font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{p.summary}</p>
                    {p.techStack && (
                      <p className="mt-3 text-xs text-accent-hover">{p.techStack}</p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyHint text="Henüz proje eklenmedi." />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <HandCoins size={22} className="text-accent-hover" /> Güncel Hibeler ve Fonlar
          </h2>
          <Link href="/hibeler" className="text-sm text-muted hover:text-foreground">
            Tümünü gör →
          </Link>
        </div>
        {grants && grants.items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grants.items.map((g) => (
              <Link key={g.id} href={`/hibeler/${g.slug}`}>
                <Card className="h-full p-5 transition-colors hover:border-accent/50">
                  <p className="text-xs text-muted">{g.organization}</p>
                  <h3 className="mt-2 font-semibold leading-snug">{g.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{g.summary}</p>
                  {g.deadlineAtUtc && (
                    <p className="mt-3 text-xs text-accent-hover">Son başvuru: {formatDate(g.deadlineAtUtc)}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyHint text="Henüz hibe/fon ilanı eklenmedi." />
        )}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Users size={22} className="text-accent-hover" /> Kadromuz
            </h2>
            <Link href="/kadromuz" className="text-sm text-muted hover:text-foreground">
              Tümünü gör →
            </Link>
          </div>
          {team.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.slice(0, 4).map((m) => (
                <Card key={m.id} className="p-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-lg font-bold text-accent-hover">
                    {m.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <h3 className="mt-3 font-semibold">{m.fullName}</h3>
                  <p className="text-sm text-muted">{m.title}</p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyHint text="Henüz kadro üyesi eklenmedi." />
          )}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Hibe ve fon fırsatlarını kaçırma</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Topluluğa katıl, güncel hibe ve fon ilanlarına, ilanlara ve üyelere anında eriş.
          </p>
          <LinkButton href="/kayit" size="lg" className="mt-8">
            <ArrowRight size={18} /> Topluluğa Katıl
          </LinkButton>
        </div>
      </section>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
      {text}
    </div>
  );
}
