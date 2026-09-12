import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { AreaCard } from "@/components/area-card";
import { GROUPS } from "@/lib/areas";
import { SITE_URL } from "@/lib/site";

const TITLE = "Áreas de atuação — Fujii Advogados";
const DESCRIPTION =
  "Soluções jurídicas para empresas e contribuintes, produtores rurais e cidadãos: tributário, execuções fiscais, agronegócio, crédito rural, previdenciário, consumidor, saúde e trabalho.";

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
              Soluções jurídicas organizadas por quem precisa delas
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground hyphens-none">
              Cada frente de atuação reúne serviços correlatos, com diagnóstico prévio e avaliação
              honesta das chances reais de êxito. Escolha o grupo que corresponde à sua realidade.
            </p>
          </div>
        </section>

        {GROUPS.map((group, i) => (
          <section
            key={group.id}
            id={group.id}
            className={`scroll-mt-24 py-14 sm:py-20 ${
              i % 2 === 1 ? "border-y border-border bg-[image:var(--gradient-veil)]" : ""
            }`}
          >
            <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
              <h2 className="text-2xl text-primary sm:text-3xl">{group.label}</h2>
              <div className="mt-3 h-px w-16 rule-gold" />
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground hyphens-none">
                {group.tagline}
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.areas.map((area) => (
                  <AreaCard key={area.slug} area={area} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
