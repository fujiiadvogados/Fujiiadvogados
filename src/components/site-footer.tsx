import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { AREAS } from "@/lib/areas";
import {
  ADDRESS_LINES,
  EMAIL,
  EXTERNAL_LINK,
  FIRM_NAME,
  MAPS_LINK,
  PHONE_HREF,
  PHONE_LABEL,
  WHATSAPP_LINK,
} from "@/lib/site";
import { WhatsappIcon } from "@/components/brand-icons";
import { BrandMark } from "@/components/brand-mark";
import { Tilt } from "@/components/tilt";
import { SocialLinks } from "@/components/social-links";

const INSTITUTIONAL_LINKS = [
  { to: "/quem-somos", label: "Quem somos" },
  { to: "/etica", label: "Ética e valores" },
  { to: "/blog", label: "Blog" },
] as const;

const headingClass = "text-xs tracking-[0.24em] text-gold uppercase";
const linkClass = "inline-flex min-h-11 items-center gap-2.5 transition-colors hover:text-gold";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-[80rem] px-[5vw] py-14 sm:px-8 sm:py-16 xl:px-12">
        <div className="grid gap-10 sm:grid-cols-2">
          {/* Faixa da marca em largura total: a assinatura horizontal ganha espaço próprio */}
          <div className="grid gap-6 border-b border-primary-foreground/15 pb-10 sm:col-span-2 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-center lg:gap-16">
            <Link
              to="/"
              aria-label={`${FIRM_NAME} — página inicial`}
              className="-m-1 block w-full max-w-[17rem] rounded-md p-1 sm:max-w-[26rem]"
            >
              {/* Versão em dourado claro da marca: contraste adequado sobre o azul-marinho */}
              <Tilt maxDeg={3}>
                <BrandMark variant="logo-reverse" className="h-auto w-full" />
              </Tilt>
            </Link>
            <div>
              <p className="max-w-md text-sm leading-relaxed text-primary-foreground/75">
                Atendimento presencial em Cuiabá (MT), mediante agendamento, e atendimento remoto
                por videoconferência para todo o Brasil.
              </p>
              <address className="mt-5 text-sm leading-relaxed text-primary-foreground/85 not-italic">
                {ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={MAPS_LINK}
                {...EXTERNAL_LINK}
                aria-label="Ver no mapa (Google Maps, abre em nova aba)"
                className={`${linkClass} underline underline-offset-4`}
              >
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                Ver no mapa
              </a>
            </div>
          </div>

          <nav aria-label="Áreas de atuação (rodapé)">
            <p className={headingClass}>Áreas de atuação</p>
            <ul className="mt-3 text-sm">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link to="/areas/$slug" params={{ slug: a.slug }} className={linkClass}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={headingClass}>Contato</p>
            <ul className="mt-3 text-sm">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <WhatsappIcon className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={PHONE_HREF} className={linkClass}>
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {PHONE_LABEL}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className={`${linkClass} break-all`}>
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
            </ul>
            <p className={`${headingClass} mt-6`}>Redes sociais</p>
            <SocialLinks className="mt-2" />
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-primary-foreground/15 pt-6 text-xs leading-relaxed text-primary-foreground/70">
          <p>
            <strong className="font-medium text-primary-foreground">Aviso OAB:</strong> este site
            tem caráter meramente informativo, sem captação de clientela, mercantilização da
            profissão ou promessa de resultados, em conformidade com o Código de Ética e Disciplina
            da OAB e com o Provimento nº 205/2021 do Conselho Federal da OAB. O conteúdo publicado
            não constitui consulta ou parecer jurídico; cada caso exige análise individual.
          </p>
          <p>
            <strong className="font-medium text-primary-foreground">Aviso LGPD:</strong> os dados
            pessoais enviados por WhatsApp, e-mail ou formulário são tratados exclusivamente para
            contato e eventual prestação de serviços advocatícios, com base no art. 7º da Lei nº
            13.709/2018 (LGPD), protegidos por sigilo profissional e não compartilhados com
            terceiros sem autorização ou dever legal. Você pode solicitar acesso, correção ou
            exclusão dos seus dados pelo e-mail {EMAIL}.
          </p>
          <nav aria-label="Institucional (rodapé)" className="pt-2">
            <ul className="flex flex-wrap justify-center gap-x-6 text-sm">
              {INSTITUTIONAL_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-11 items-center hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-center">
            © {new Date().getFullYear()} {FIRM_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Botão flutuante do WhatsApp — exibido apenas a partir de 1366 px, onde fica na margem
 * lateral livre (conteúdo limitado a 80rem): por geometria, nunca cobre textos, links,
 * campos ou avisos. Abaixo disso, o WhatsApp fica no cabeçalho, no menu e no contato.
 */
export function WhatsappFab() {
  return (
    <aside aria-label="Atalho de contato" className="hidden min-[1366px]:block">
      <a
        href={WHATSAPP_LINK}
        {...EXTERNAL_LINK}
        aria-label="Conversar no WhatsApp (abre em nova aba)"
        className="wa-react wa-pulse fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp-strong text-white shadow-[var(--shadow-lift)] transition-colors hover:bg-whatsapp-strong/90"
      >
        <WhatsappIcon className="h-7 w-7" />
      </a>
    </aside>
  );
}
