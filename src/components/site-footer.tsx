import { Mail, Phone, Rss } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { EMAIL, NAV, PHONE_HREF, PHONE_LABEL, SOCIAL, WHATSAPP_LINK } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon } from "@/components/brand-icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[image:var(--gradient-veil)]">
      <div className="mx-auto w-full max-w-[80rem] px-[5vw] py-14 sm:px-8 xl:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-base leading-snug tracking-[0.14em] text-gilded uppercase">
              Fujii Advocacia & Consultoria Jurídica
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Atendimento presencial em Cuiabá (MT), mediante agendamento, e atendimento remoto por
              videoconferência para todo o Brasil.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">Navegação</p>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    {...(item.hash ? { hash: item.hash } : {})}
                    className="text-primary transition-colors hover:text-gold-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">Contato</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <WhatsappIcon className="h-4 w-4 text-whatsapp" />
                  WhatsApp {PHONE_LABEL}
                </a>
              </li>
              <li>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <Phone className="h-4 w-4 text-gold-ink" />
                  {PHONE_LABEL}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <Mail className="h-4 w-4 text-gold-ink" />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">Canais</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <FacebookIcon className="h-4 w-4 text-[oklch(0.52_0.16_260)]" />
                  Facebook · Fujii Advocacia & Consultoria Jurídica
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <InstagramIcon className="h-4 w-4 text-[oklch(0.58_0.19_10)]" />
                  Instagram · @fujiiadvogados
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <TiktokIcon className="h-4 w-4 text-foreground" />
                  TikTok · Fujii Advocacia & Consultoria Jurídica
                </a>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-gold-ink"
                >
                  <Rss className="h-4 w-4 text-gold-ink" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground hyphens-none sm:text-justify">
          <p>
            <strong className="font-medium text-primary">Aviso OAB:</strong> este site tem caráter
            meramente informativo, sem captação de clientela, mercantilização da profissão ou
            promessa de resultados, em conformidade com o Código de Ética e Disciplina da OAB e com
            o Provimento nº 205/2021 do Conselho Federal da OAB. O conteúdo publicado não constitui
            consulta ou parecer jurídico; cada caso exige análise individual.
          </p>
          <p>
            <strong className="font-medium text-primary">Aviso LGPD:</strong> os dados pessoais
            enviados por WhatsApp, e-mail ou formulário são tratados exclusivamente para contato e
            eventual prestação de serviços advocatícios, com base no art. 7º da Lei nº 13.709/2018
            (LGPD), protegidos por sigilo profissional e não compartilhados com terceiros sem
            autorização ou dever legal. Você pode solicitar acesso, correção ou exclusão dos seus
            dados pelo e-mail {EMAIL}.
          </p>
          <p className="pt-2 text-center">
            © {new Date().getFullYear()} Fujii Advocacia & Consultoria Jurídica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
