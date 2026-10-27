import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { WhatsappIcon } from "@/components/brand-icons";
import { SITE_URL, WHATSAPP_LINK } from "@/lib/site";
import emblem from "@/assets/emblem.png";

const TITLE = "Quem Somos — Fujii Advocacia & Consultoria Jurídica";
const DESCRIPTION =
  "Missão, visão, valores e propósito da Fujii Advocacia & Consultoria Jurídica: trabalho técnico, linguagem clara, sigilo absoluto e proximidade humana em Cuiabá (MT) e em todo o Brasil.";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/quem-somos` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/quem-somos` }],
  }),
  component: QuemSomos,
});

const PILARES = [
  {
    title: "Missão",
    text: "Transformar questões jurídicas complexas em decisões simples de tomar. Trabalho técnico, linguagem clara e cenários honestos de prazo, custo e risco — sem promessas vazias.",
  },
  {
    title: "Visão",
    text: "Ser uma referência regional em direito tributário, do agronegócio e do crédito rural, unindo profundidade técnica à proximidade humana no atendimento.",
  },
  {
    title: "Valores",
    text: "Transparência em cada etapa, excelência técnica como método, sigilo absoluto sobre o que nos é confiado e coerência entre o que se promete e o que se entrega.",
  },
  {
    title: "Propósito",
    text: "Devolver tranquilidade de decisão a quem está por trás de cada processo. Antes de um caso, existe uma família, uma lavoura, uma empresa — é por elas que trabalhamos.",
  },
];

const NUMEROS = [
  { label: "Áreas de atuação", value: "8" },
  { label: "Atendimento", value: "Presencial e remoto" },
  { label: "Abrangência", value: "Todo o Brasil" },
];

function QuemSomos() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Quem somos</p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-gilded">Fujii Advocacia & Consultoria Jurídica</span>
              <span className="mt-2 block text-primary">
                uma banca construída sobre técnica, discrição e confiança
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Nós acreditamos que a boa advocacia começa por ouvir. Antes de qualquer petição,
              entendemos o contexto do cliente, mapeamos riscos e apresentamos as alternativas de
              forma clara — incluindo aquelas que não nos interessam economicamente.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
            {PILARES.map((p, i) => (
              <article
                key={p.title}
                style={{ animationDelay: `${i * 90}ms` }}
                className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:animate-none sm:p-8"
              >
                <div className="h-px w-10 rule-gold transition-[width] duration-500 hover:w-20" />
                <h2 className="mt-4 text-2xl text-primary">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-[80rem] items-center gap-10 px-[5vw] sm:px-8 md:grid-cols-2 xl:px-12">
            <img
              src={emblem}
              alt=""
              aria-hidden="true"
              width={225}
              height={270}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[16rem] object-contain drop-shadow-[0_18px_40px_rgba(15,30,61,0.18)]"
            />
            <div>
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                Como trabalhamos
              </p>
              <h2 className="mt-3 text-3xl text-primary">Um advogado ao seu lado</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Cada caso recebe leitura individual. Estudamos documentos, avaliamos precedentes e
                só então desenhamos a estratégia — sempre com um cenário realista de prazos, custos
                e chances de êxito.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Você acompanha o andamento com relatórios objetivos e canal direto de contato.
                Usamos ferramentas modernas de gestão e monitoramento processual para reduzir o
                tempo de resposta e evitar perda de prazos.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {NUMEROS.map((n) => (
                  <div key={n.label} className="rounded-lg border border-border bg-card p-4">
                    <dt className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                      {n.label}
                    </dt>
                    <dd className="mt-2 font-display text-xl text-primary">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
            Formação e qualificação
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl text-primary">
            Especialização que sustenta a estratégia
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A atuação do escritório é conduzida por advogado inscrito na Ordem dos Advogados do
            Brasil, com formação continuada nas áreas em que atua:
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Pós-graduação em Direito Tributário e Processo Tributário",
                text: "Base técnica para planejamento fiscal, contencioso administrativo e defesa em execuções fiscais.",
              },
              {
                title: "Pós-graduação em Direito Administrativo, Licitações e Contratos",
                text: "Atuação junto à Administração Pública, certames licitatórios e contratos administrativos.",
              },
              {
                title: "Cursos em Direito do Trabalho e Processo do Trabalho",
                text: "Aperfeiçoamento contínuo nas relações de trabalho urbanas e rurais, na via preventiva e contenciosa.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="h-px w-10 rule-gold" />
                <h3 className="mt-4 text-lg leading-snug text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 text-center sm:px-8 sm:py-20 xl:px-12">
          <h2 className="text-3xl text-primary">Vamos conversar sobre o seu caso</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            O primeiro contato é simples e sigiloso. Conte o que está acontecendo e indicamos o
            caminho técnico mais seguro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <WhatsappIcon className="h-4 w-4" />
              Falar com um advogado
            </a>
            <Link
              to="/etica"
              className="rounded-full border border-border px-7 py-3 text-sm tracking-wide text-primary transition-colors hover:bg-secondary"
            >
              Ética e valores
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
