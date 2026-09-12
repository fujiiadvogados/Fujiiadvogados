import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, ScrollText, ShieldCheck, Timer } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { WhatsappIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { AreasCarousel } from "@/components/areas-carousel";
import { GROUPS } from "@/lib/areas";
import { LocationMap } from "@/components/location-map";
import { EMAIL, SITE_URL, WHATSAPP_LINK } from "@/lib/site";
import logo from "@/assets/logo-fujii.png";
import crest from "@/assets/crest.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fujii Advogados — Advocacia e Consultoria Jurídica" },
      {
        name: "description",
        content:
          "Advocacia e consultoria jurídica em direito tributário, execuções fiscais, agronegócio, crédito rural, previdenciário, trabalhista, médico e do consumidor. Atendimento presencial e remoto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Fujii Advogados — Advocacia e Consultoria Jurídica" },
      {
        property: "og:description",
        content:
          "Assessoria jurídica estratégica em tributário, execuções fiscais, agronegócio, crédito rural, previdenciário, trabalhista, médico e do consumidor.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: "Fujii Advogados",
          description: "Advocacia e Consultoria Jurídica",
          url: SITE_URL,
          telephone: "+55 65 99234-8575",
          email: EMAIL,
          areaServed: "BR",
        }),
      },
    ],
  }),
  component: Index,
});

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Sigilo profissional",
    text: "Cada informação recebida é protegida pelo segredo profissional do advogado e por controles internos de acesso.",
  },
  {
    icon: Lock,
    title: "Segurança da informação",
    text: "Site servido exclusivamente por HTTPS, com cabeçalhos de segurança, política de conteúdo restritiva e proteção contra abuso de formulários.",
  },
  {
    icon: ScrollText,
    title: "Conformidade LGPD",
    text: "Coleta mínima de dados, finalidade declarada e exclusão mediante solicitação, nos termos da Lei nº 13.709/2018.",
  },
  {
    icon: Timer,
    title: "Retorno objetivo",
    text: "Triagem da demanda e resposta em linguagem clara, com avaliação honesta das chances reais de êxito.",
  },
];

function Index() {
  const [group, setGroup] = useState(GROUPS[0]!.id);
  const active = GROUPS.find((g) => g.id === group) ?? GROUPS[0]!;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-halo)]" />
          <div className="relative mx-auto w-full max-w-3xl px-[5vw] pt-10 pb-16 text-center sm:px-8 sm:pt-16 sm:pb-24">
            <img
              src={crest}
              alt="Brasão Fujii Advogados"
              width={748}
              height={900}
              fetchPriority="high"
              className="mx-auto h-28 w-auto object-contain sm:h-36 lg:h-44"
            />
            <h1 className="mt-6 font-display text-3xl leading-[1.1] tracking-[0.16em] text-gilded uppercase sm:text-5xl lg:text-6xl">
              Fujii Advogados
            </h1>
            <div className="mx-auto mt-4 h-px w-40 max-w-[60%] rule-gold" />
            <p className="mt-6 text-lg leading-snug text-balance text-primary sm:text-xl">
              Defesa técnica com serenidade e estratégia
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-balance text-muted-foreground">
              Atuação consultiva e contenciosa para pessoas, produtores rurais e empresas. Análise
              criteriosa do caso, comunicação clara e acompanhamento próximo em cada etapa do
              processo.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
              >
                <WhatsappIcon className="h-4 w-4" />
                Falar com um advogado
              </a>
              <a
                href="#areas"
                className="rounded-full border border-border px-7 py-3 text-sm tracking-wide text-primary transition-colors hover:bg-secondary"
              >
                Áreas de atuação
              </a>
            </div>
          </div>
        </section>

        {/* Áreas */}
        <section
          id="areas"
          className="scroll-mt-24 border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <p className="text-center text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Áreas de atuação
            </p>
            <h2 className="mt-3 text-center text-3xl text-primary">Onde podemos ajudar você</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              Selecione a área correspondente à sua demanda e conheça os serviços prestados. O
              atendimento inicial é feito com escuta atenta e sem compromisso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroup(g.id)}
                  aria-pressed={group === g.id}
                  className={`rounded-full border px-5 py-2 text-xs tracking-[0.14em] uppercase transition-all duration-300 ${
                    group === g.id
                      ? "border-gold bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "border-border text-primary hover:bg-secondary"
                  }`}
                >
                  {g.short}
                </button>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground hyphens-none">
              {active.tagline}
            </p>
            <div className="mt-10">
              <AreasCarousel areas={active.areas} />
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/areas"
                className="inline-flex items-center rounded-full border border-gold/60 px-6 py-3 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
              >
                Ver todas as áreas de atuação
              </Link>
            </div>
          </div>
        </section>

        {/* Escritório */}
        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <img
              src={logo}
              alt="Fujii Advogados — Advocacia e Consultoria Jurídica"
              width={1200}
              height={756}
              loading="lazy"
              className="mx-auto w-full max-w-sm object-contain"
            />

            <div>
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                O escritório
              </p>
              <h2 className="mt-3 text-3xl text-primary">
                Um advogado ao seu lado, não apenas um processo
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground hyphens-none sm:text-justify">
                Cada caso recebe leitura individual: compreendemos o contexto, mapeamos riscos e
                desenhamos a estratégia mais segura. Sem promessas de resultado e sem juridiquês.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground hyphens-none sm:text-justify">
                Você acompanha o andamento por relatórios objetivos e canal direto com o advogado
                responsável. Seus dados são tratados com confidencialidade, em conformidade com a
                LGPD e com o Código de Ética e Disciplina da OAB.
              </p>
              <ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Pós-graduado em Direito Tributário e Processo Tributário",
                  "Pós-graduado em Direito Administrativo, Licitações e Contratos",
                  "Formação complementar em Direito e Processo do Trabalho",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/quem-somos"
                  className="rounded-full border border-gold/60 px-5 py-2 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
                >
                  Quem somos
                </Link>
                <Link
                  to="/etica"
                  className="rounded-full border border-border px-5 py-2 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
                >
                  Ética e valores
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Confiança / segurança */}
        <section className="border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Confidencialidade e segurança
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl text-primary">
              Sua informação tratada com o mesmo rigor da sua causa
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
                >
                  <Icon className="h-5 w-5 text-gold-ink" />
                  <h3 className="mt-4 text-lg text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LocationMap />

        {/* Contato */}
        <section id="contato" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto grid w-full max-w-[80rem] gap-14 px-[5vw] sm:px-8 lg:grid-cols-[0.85fr_1.15fr] xl:px-12">
            <div className="relative">
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Contato</p>
              <h2 className="mt-3 text-3xl leading-tight text-primary">Envie uma mensagem</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Preencha os dados abaixo para que o escritório possa retornar o contato. As
                informações são recebidas diretamente em{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-gold-ink underline-offset-4 hover:underline"
                >
                  {EMAIL}
                </a>
                .
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
