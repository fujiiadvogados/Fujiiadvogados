import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Scale, MessageSquare } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";

const TITLE = "Ética, Moral e Valores — Fujii Advocacia & Consultoria Jurídica";
const DESCRIPTION =
  "Nosso pacto de integridade: sigilo profissional, prevenção de conflito de interesses, compliance anticorrupção, comunicação clara e honorários justos conforme a OAB.";

export const Route = createFileRoute("/etica")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/etica` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/etica` }],
  }),
  component: Etica,
});

const CONDUTA = [
  {
    icon: ShieldCheck,
    title: "Segredo profissional",
    text: "Compromisso absoluto com o sigilo das informações de cada cliente. Documentos e conversas são acessados apenas pela equipe designada ao caso, com controle de acesso e descarte seguro.",
  },
  {
    icon: Scale,
    title: "Conflito de interesses",
    text: "Antes de aceitar qualquer demanda fazemos triagem de conflito. Nunca atuamos, simultânea ou sucessivamente, em favor de interesses opostos aos de um cliente atual ou anterior.",
  },
  {
    icon: MessageSquare,
    title: "Anticorrupção e compliance",
    text: "Tolerância zero a práticas ilícitas, tráfico de influência ou pagamentos facilitadores. Nossa atuação é técnica, documentada e defensável em qualquer instância.",
  },
];

const PILARES_CLIENTE = [
  {
    title: "Comunicação clara",
    text: "Nós explicamos o processo sem juridiquês desnecessário. Você recebe atualizações objetivas e sabe, a qualquer momento, em que fase o caso está e qual é o próximo passo.",
  },
  {
    title: "Honorários justos",
    text: "Cobrança transparente e proporcional à complexidade do trabalho, formalizada em contrato e alinhada à Tabela de Honorários e ao Código de Ética da OAB. Sem cobranças surpresa.",
  },
  {
    title: "Realismo jurídico",
    text: "Somos honestos sobre as chances reais de êxito. Quando o caminho judicial não é o melhor, dizemos isso — e indicamos a alternativa administrativa ou negocial mais segura.",
  },
];

function Etica() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Ética, moral e valores
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-gilded">Nosso pacto de integridade</span>
              <span className="mt-2 block text-primary">
                o que sustenta cada orientação que damos
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Ética, para nós, não é texto protocolar: é método de trabalho. Estes são os
              compromissos que assumimos com cada cliente e que orientam a conduta interna da banca,
              em conformidade com o Estatuto da Advocacia e o Código de Ética da OAB.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <h2 className="text-3xl text-primary">Código de conduta interna</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CONDUTA.map((c) => (
              <article
                key={c.title}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
              >
                <c.icon className="h-6 w-6 text-gold-ink" aria-hidden="true" />
                <h3 className="mt-4 text-xl text-primary">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <h2 className="text-3xl text-primary">Pilares morais perante o cliente</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PILARES_CLIENTE.map((p) => (
                <article
                  key={p.title}
                  className="rounded-xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="h-px w-10 rule-gold" />
                  <h3 className="mt-4 text-xl text-primary">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-xl text-primary">Publicidade sóbria e informativa</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Toda a comunicação deste site observa o Provimento nº 205/2021 do Conselho Federal
                da OAB: conteúdo informativo, sem mercantilização da profissão, sem captação de
                clientela, sem divulgação de valores de causas, resultados obtidos ou promessas de
                êxito. Nossos dados pessoais e processuais são tratados conforme a LGPD (Lei nº
                13.709/2018).
              </p>
              <Link
                to="/quem-somos"
                className="mt-6 inline-flex rounded-full border border-gold/60 px-5 py-2 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
              >
                Conhecer o escritório
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
