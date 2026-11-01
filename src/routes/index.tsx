import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageSquareText, Phone, ScrollText, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { BrandMark } from "@/components/brand-mark";
import { Tilt } from "@/components/tilt";
import { SiteFooter, WhatsappFab } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { AreaCard } from "@/components/area-card";
import { HeroCarousel } from "@/components/hero-carousel";
import { SocialLinks } from "@/components/social-links";
import { LocationMap } from "@/components/location-map";
import { AREAS } from "@/lib/areas";
import {
  ADDRESS,
  EMAIL,
  EXTERNAL_LINK,
  FIRM_NAME,
  MAPS_LINK,
  OFFICE_COORDS,
  PHONE_E164_DIGITS,
  PHONE_HREF,
  PHONE_LABEL,
  SITE_URL,
  SOCIAL,
  WHATSAPP_LINK,
} from "@/lib/site";
import { WhatsappIcon } from "@/components/brand-icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fujii Advocacia & Consultoria Jurídica" },
      {
        name: "description",
        content:
          "Advocacia e consultoria jurídica em direito tributário, agrário e do agronegócio, previdenciário, civil, do consumidor e do trabalho. Atendimento presencial e remoto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Fujii Advocacia & Consultoria Jurídica" },
      {
        property: "og:description",
        content:
          "Assessoria jurídica estratégica em tributário, agrário e do agronegócio, previdenciário, civil, do consumidor e do trabalho.",
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
          name: "Fujii Advocacia & Consultoria Jurídica",
          description: "Advocacia e Consultoria Jurídica",
          url: SITE_URL,
          telephone: `+${PHONE_E164_DIGITS}`,
          email: EMAIL,
          areaServed: "BR",
          address: {
            "@type": "PostalAddress",
            streetAddress: `${ADDRESS.street} — ${ADDRESS.neighborhood}`,
            addressLocality: ADDRESS.city,
            addressRegion: ADDRESS.stateCode,
            addressCountry: ADDRESS.countryCode,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: OFFICE_COORDS.lat,
            longitude: OFFICE_COORDS.lng,
          },
          hasMap: MAPS_LINK,
          sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.tiktok],
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
    text: "As informações recebidas são protegidas pelo sigilo profissional do advogado.",
  },
  {
    icon: ScrollText,
    title: "Conformidade LGPD",
    text: "Coleta mínima de dados, finalidade declarada e exclusão mediante solicitação, nos termos da Lei nº 13.709/2018.",
  },
  {
    icon: MessageSquareText,
    title: "Comunicação clara",
    text: "Análise da demanda e retorno em linguagem acessível, com as alternativas, os custos e os riscos de cada caminho.",
  },
];

function Index() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <HeroCarousel />

        {/* Áreas */}
        <section
          id="areas"
          className="scroll-mt-24 border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <p className="text-center text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Áreas de atuação
            </p>
            <h2 className="mt-3 text-center text-3xl text-primary sm:text-4xl">
              Onde podemos ajudar você
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              Seis áreas de atuação. Escolha a que corresponde à sua demanda para conhecer as
              subáreas e a forma de atuação do escritório.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {AREAS.map((area) => (
                <AreaCard key={area.slug} area={area} variant="compact" />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/areas"
                className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-6 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
              >
                Conheça nossas áreas
              </Link>
            </div>
          </div>
        </section>

        {/* Escritório */}
        <section className="mx-auto w-full max-w-[80rem] px-[5vw] py-16 sm:px-8 sm:py-20 xl:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Tilt
              maxDeg={8}
              className="mx-auto w-full max-w-[24rem] sm:max-w-[30rem] md:max-w-[34rem]"
            >
              <BrandMark alt={FIRM_NAME} className="h-auto w-full" />
            </Tilt>

            <div>
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                O escritório
              </p>
              <h2 className="mt-3 text-3xl text-primary">
                Um advogado ao seu lado, não apenas um processo
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground hyphens-none sm:text-justify">
                Cada caso recebe leitura individual: compreendemos o contexto, mapeamos riscos e
                desenhamos a estratégia adequada ao caso. Sem promessas de resultado e sem
                juridiquês.
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
                  className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
                >
                  Quem somos
                </Link>
                <Link
                  to="/etica"
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
                >
                  Ética e valores
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Confiança / segurança */}
        <section className="border-y border-border bg-secondary/40 py-14 sm:py-16">
          <div className="mx-auto w-full max-w-[80rem] px-[5vw] sm:px-8 xl:px-12">
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Confidencialidade
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl text-primary">
              Sua informação tratada com o mesmo rigor da sua causa
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="border-t border-gold/50 pt-5">
                  <Icon className="h-5 w-5 text-gold-ink" aria-hidden="true" />
                  <h3 className="mt-3 text-xl text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>
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
                Preencha o formulário para que o escritório possa retornar o contato. A mensagem é
                enviada ao e-mail{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-all text-gold-ink underline underline-offset-4"
                >
                  {EMAIL}
                </a>
                .
              </p>
              <p className="mt-8 text-xs tracking-[0.24em] text-muted-foreground uppercase">
                Outros canais
              </p>
              <ul className="mt-2 text-sm text-primary">
                <li>
                  <a
                    href={WHATSAPP_LINK}
                    {...EXTERNAL_LINK}
                    className="inline-flex min-h-11 items-center gap-2.5 hover:text-gold-ink"
                  >
                    <WhatsappIcon className="h-4 w-4 text-whatsapp-strong" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex min-h-11 items-center gap-2.5 hover:text-gold-ink"
                  >
                    <Phone className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                    {PHONE_LABEL}
                  </a>
                </li>
              </ul>
              <p className="mt-8 text-xs tracking-[0.24em] text-muted-foreground uppercase">
                Redes sociais
              </p>
              <SocialLinks variant="icons" className="mt-3" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
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
