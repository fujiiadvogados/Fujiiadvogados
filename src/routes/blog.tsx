import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Landmark, Newspaper } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { SITE_URL, SOCIAL } from "@/lib/site";

const TITLE = "Blog Jurídico — Fujii Advogados";
const DESCRIPTION =
  "Conteúdo informativo sobre direito tributário, agronegócio, crédito rural, previdenciário, trabalhista, médico e do consumidor, em linguagem clara e conforme a OAB.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: Blog,
});

const TEMAS = [
  {
    title: "Tributário na prática",
    text: "Recuperação de créditos, parcelamentos, revisão de tributos e teses consolidadas nos tribunais superiores.",
  },
  {
    title: "Agronegócio e crédito rural",
    text: "Contratos agrários, CPR, renegociação de dívidas e regularização de imóveis rurais explicados passo a passo.",
  },
  {
    title: "Execuções fiscais",
    text: "Prescrição, exceção de pré-executividade, penhoras e caminhos para proteger o patrimônio de forma legal.",
  },
  {
    title: "Previdenciário e saúde",
    text: "Planejamento de aposentadoria, benefícios por incapacidade e demandas contra planos de saúde.",
  },
];

const NEWS_SOURCES = [
  {
    title: "Previdenciarista",
    topic: "Direito previdenciário",
    href: "https://previdenciarista.com/blog/",
  },
  {
    title: "Senado Notícias",
    topic: "INSS e legislação",
    href: "https://www12.senado.leg.br/noticias/tags/INSS",
  },
  { title: "Supremo Tribunal Federal", topic: "Jurisprudência do STF", href: "https://noticias.stf.jus.br" },
  {
    title: "Superior Tribunal de Justiça",
    topic: "Últimas notícias do STJ",
    href: "https://www.stj.jus.br/sites/portalp/Comunicacao/Ultimas-noticias",
  },
  { title: "Tribunal Superior do Trabalho", topic: "Direito do trabalho", href: "https://www.tst.jus.br/noticias" },
  {
    title: "Notícias Agrícolas",
    topic: "Agronegócio",
    href: "https://www.noticiasagricolas.com.br/noticias/agronegocio/",
  },
  {
    title: "Valor Econômico",
    topic: "Legislação tributária",
    href: "https://valor.globo.com/legislacao/tributario/",
  },
  {
    title: "Conselho Nacional de Justiça",
    topic: "Execução fiscal",
    href: "https://www.cnj.jus.br/programas-e-acoes/execucao-fiscal/noticias/",
  },
  {
    title: "R7 Notícias",
    topic: "Direito do consumidor",
    href: "https://noticias.r7.com/direito-do-consumidor/",
  },
];

function Blog() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Blog</p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-gilded">Conhecimento jurídico</span>
              <span className="mt-2 block text-primary">em linguagem que você entende</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Publicamos análises informativas sobre temas que afetam pessoas, produtores rurais e
              empresas. O conteúdo tem finalidade educativa e não substitui consulta jurídica
              individual.
            </p>
            <a
              href={SOCIAL.blog}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              Acessar o blog completo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <h2 className="text-3xl text-primary">Temas que acompanhamos</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMAS.map((t) => (
              <article
                key={t.title}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="h-px w-10 rule-gold" />
                <h3 className="mt-4 text-xl leading-snug text-primary">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <p className="flex items-center gap-2 text-xs tracking-[0.28em] text-gold-ink uppercase">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Atualização jurídica
            </p>
            <h2 className="mt-3 text-3xl text-primary">Últimas notícias</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Acompanhe informações recentes em portais institucionais e veículos especializados.
              Os links abrem diretamente na fonte responsável pelo conteúdo.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {NEWS_SOURCES.map((source, index) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${source.title}: ${source.topic} (abre em nova aba)`}
                  className="group flex min-h-36 flex-col justify-between bg-card p-6 transition-colors hover:bg-secondary focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Landmark className="h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs tracking-[0.16em] text-gold-ink uppercase">{source.topic}</p>
                    <h3 className="mt-2 flex items-center justify-between gap-3 text-lg leading-snug text-primary">
                      {source.title}
                      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </h3>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Curadoria de fontes para fins informativos. O conteúdo externo é de responsabilidade
              de seus respectivos autores e não substitui orientação jurídica individualizada.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
