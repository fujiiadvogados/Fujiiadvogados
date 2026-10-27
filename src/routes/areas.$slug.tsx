import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { WhatsappIcon } from "@/components/brand-icons";
import { AREAS, getArea } from "@/lib/areas";
import { SITE_URL, areaLink } from "@/lib/site";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) throw notFound();
    return { slug: area.slug };
  },
  head: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) {
      return {
        meta: [{ title: "Área não encontrada — Fujii Advocacia & Consultoria Jurídica" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${area.commercial} — ${area.title} | Fujii Advocacia & Consultoria Jurídica`;
    return {
      meta: [
        { title },
        { name: "description", content: area.text },
        { property: "og:title", content: title },
        { property: "og:description", content: area.text },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE_URL}/areas/${area.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/areas/${area.slug}` }],
    };
  },
  notFoundComponent: AreaNotFound,
  component: AreaDetail,
});

function AreaNotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[80rem] flex-1 px-[5vw] py-24 sm:px-8 xl:px-12">
        <h1 className="text-3xl text-primary">Área não encontrada</h1>
        <p className="mt-4 text-muted-foreground">
          Essa página não existe ou foi movida. Veja todas as áreas de atuação.
        </p>
        <Link
          to="/areas"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs tracking-[0.14em] text-primary-foreground uppercase"
        >
          Áreas de atuação
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function AreaDetail() {
  const { slug } = Route.useLoaderData();
  const area = getArea(slug)!;
  const related = AREAS.filter((a) => a.slug !== area.slug);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto grid w-full max-w-[80rem] items-center gap-10 px-[5vw] py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] xl:px-12">
            <div>
              <nav aria-label="Trilha de navegação" className="text-xs text-muted-foreground">
                <Link to="/areas" className="tracking-[0.16em] uppercase hover:text-gold-ink">
                  Áreas de atuação
                </Link>
              </nav>
              <p className="mt-4 text-[0.7rem] tracking-[0.24em] text-gold-ink uppercase">
                {area.title}
              </p>
              <h1 className="mt-3 text-3xl leading-tight text-primary sm:text-4xl">
                {area.commercial}
              </h1>
              <div className="mt-4 h-px w-20 rule-gold" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground hyphens-none">
                {area.text}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={areaLink(area.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Falar sobre o meu caso
                </a>
                <Link
                  to="/"
                  hash="contato"
                  className="rounded-full border border-border px-6 py-3 text-sm tracking-wide text-primary transition-colors hover:bg-secondary"
                >
                  Enviar mensagem
                </Link>
              </div>
            </div>

            <img
              src={area.image}
              alt={area.alt}
              width={1200}
              height={800}
              className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-14 sm:px-8 sm:py-20 xl:px-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">O problema</p>
              <p className="mt-4 text-base leading-relaxed text-foreground/80 hyphens-none">
                {area.problem}
              </p>
            </div>
            <div className="rounded-2xl border border-gold/40 bg-card p-7 shadow-[var(--shadow-soft)]">
              <p className="text-xs tracking-[0.22em] text-gold-ink uppercase">Como atuamos</p>
              <p className="mt-4 text-base leading-relaxed text-foreground/80 hyphens-none">
                {area.solution}
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[image:var(--gradient-veil)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <h2 className="text-2xl text-primary sm:text-3xl">Subáreas de atuação</h2>
            <div className="mt-3 h-px w-16 rule-gold" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {area.subareas.map((s) => (
                <li
                  key={s}
                  className="flex gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground/80"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {area.faq.length > 0 && (
          <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-14 sm:px-8 sm:py-20 xl:px-12">
            <h2 className="text-2xl text-primary sm:text-3xl">Perguntas frequentes</h2>
            <div className="mt-3 h-px w-16 rule-gold" />
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {area.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
                >
                  <summary className="cursor-pointer list-none text-base text-primary marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground hyphens-none">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-border py-14 sm:py-20">
            <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
              <h2 className="text-2xl text-primary sm:text-3xl">Outras áreas de atuação</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/areas/$slug"
                    params={{ slug: r.slug }}
                    className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/50"
                  >
                    <p className="text-[0.65rem] tracking-[0.2em] text-gold-ink uppercase">
                      {r.title}
                    </p>
                    <p className="mt-2 text-lg text-primary">{r.commercial}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground hyphens-none">
                      {r.promise}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
