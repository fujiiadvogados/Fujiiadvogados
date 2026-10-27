import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { AreaCard } from "@/components/area-card";
import { AREAS } from "@/lib/areas";
import { SITE_URL } from "@/lib/site";

const TITLE = "Áreas de atuação — Fujii Advocacia & Consultoria Jurídica";
const DESCRIPTION =
  "Seis áreas de atuação com suas subáreas: direito tributário, agronegócio, civil, consumidor, previdenciário e trabalhista.";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/areas` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/areas` }],
  }),
  component: AreasIndex,
});

function AreasIndex() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto w-full max-w-[80rem] px-[5vw] py-14 sm:px-8 sm:py-20 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Áreas de atuação
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-tight text-primary sm:text-4xl">
              Seis áreas de atuação, cada uma com suas subáreas
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground hyphens-none">
              Cada área reúne subáreas correlatas, com diagnóstico prévio e avaliação honesta das chances reais de êxito. Veja abaixo onde podemos ajudar.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((area) => (
                <AreaCard key={area.slug} area={area} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-[image:var(--gradient-veil)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <h2 className="text-2xl text-primary sm:text-3xl">Subáreas de cada área</h2>
            <div className="mt-3 h-px w-16 rule-gold" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((area) => (
                <div
                  key={area.slug}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
                >
                  <h3 className="text-lg text-primary">{area.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm leading-snug text-foreground/75">
                    {area.subareas.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
