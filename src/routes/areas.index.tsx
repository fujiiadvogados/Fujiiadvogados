import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { AreaCard } from "@/components/area-card";
import { AREAS } from "@/lib/areas";
import { SITE_URL } from "@/lib/site";

const TITLE = "Áreas de atuação — Fujii Advocacia & Consultoria Jurídica";
const DESCRIPTION =
  "Seis áreas de atuação com suas subáreas: direito tributário, agrário e do agronegócio, previdenciário, civil, do consumidor e do trabalho.";

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
              Cada área reúne subáreas correlatas, com diagnóstico prévio e avaliação honesta das
              chances reais de êxito. Veja abaixo onde podemos ajudar.
            </p>
          </div>
        </section>

        <section aria-labelledby="lista-areas" className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <h2 id="lista-areas" className="sr-only">
              Lista das áreas de atuação
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((area) => (
                <AreaCard key={area.slug} area={area} />
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
