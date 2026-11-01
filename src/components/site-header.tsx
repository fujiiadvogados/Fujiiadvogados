import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";

import { AREAS } from "@/lib/areas";
import { EXTERNAL_LINK, FIRM_NAME, NAV, WHATSAPP_LINK } from "@/lib/site";
import { WhatsappIcon } from "@/components/brand-icons";
import { BrandMark } from "@/components/brand-mark";
import { Tilt } from "@/components/tilt";
import symbol from "@/assets/logo1.png";

const MENU_ID = "menu-mobile";
const DESKTOP_MIN_WIDTH = 1280;
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const location = useRouterState({ select: (s) => s.location.href });

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Fecha o menu ao navegar
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Fecha ao passar para o layout desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Bloqueia a rolagem do fundo enquanto o menu está aberto
  useEffect(() => {
    if (!open) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  // O painel móvel fica fora do <header>: o backdrop-filter do cabeçalho criaria
  // um containing block e o "position: fixed" deixaria de cobrir a viewport.
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-3 px-[5vw] py-2.5 sm:px-8 xl:px-12">
          <Link
            to="/"
            aria-label={`${FIRM_NAME} — página inicial`}
            className="-m-1 inline-flex shrink-0 items-center rounded-md p-1"
          >
            <Tilt maxDeg={3}>
              <BrandMark priority className="h-[3.25rem] w-auto min-[380px]:h-14 sm:h-16" />
            </Tilt>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <DesktopNav />

            <Link
              to="/"
              hash="contato"
              className="hidden min-h-11 shrink-0 items-center rounded-full bg-primary px-5 text-xs tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Entre em contato
            </Link>

            {/* WhatsApp no cabeçalho onde o botão flutuante não é exibido (< 1366 px) */}
            <a
              href={WHATSAPP_LINK}
              {...EXTERNAL_LINK}
              aria-label="Conversar no WhatsApp (abre em nova aba)"
              className="wa-react inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 text-whatsapp-strong transition-colors hover:bg-secondary min-[1366px]:hidden"
            >
              <WhatsappIcon className="h-5 w-5" />
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-label="Abrir menu de navegação"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-primary transition-colors hover:bg-secondary xl:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} />
    </>
  );
}

function DesktopNav() {
  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-5 xl:flex">
      {NAV.map((item) =>
        item.to === "/areas" ? (
          <div key={item.label} className="group relative">
            <Link
              to="/areas"
              activeProps={{ className: "text-gold-ink" }}
              className="inline-flex min-h-11 items-center gap-1 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:text-gold-ink"
            >
              {item.label}
              <ChevronDown
                aria-hidden="true"
                className="h-3 w-3 transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180 motion-reduce:transition-none"
              />
            </Link>
            <div className="invisible absolute top-full left-1/2 z-50 w-[60rem] max-w-[94vw] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:transition-opacity group-hover:visible group-hover:opacity-100 group-hover:transition-opacity">
              <div className="grid grid-cols-3 gap-x-8 gap-y-7 rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-lift)]">
                {AREAS.map((a) => (
                  <div key={a.slug}>
                    <Link
                      to="/areas/$slug"
                      params={{ slug: a.slug }}
                      className="flex min-h-11 w-full items-center rounded-md py-1 font-display text-lg leading-tight text-balance text-primary transition-colors hover:text-gold-ink"
                    >
                      {a.title}
                    </Link>
                    <div className="mt-2 h-px w-8 bg-gold/70" aria-hidden="true" />
                    <ul className="mt-3 space-y-1.5">
                      {a.subareas.map((s) => (
                        <li key={s} className="text-[0.8rem] leading-snug text-muted-foreground">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={item.label}
            to={item.to}
            {...(item.hash ? { hash: item.hash } : {})}
            activeOptions={{ exact: item.to === "/", includeHash: true }}
            activeProps={{ className: "text-gold-ink" }}
            className="inline-flex min-h-11 items-center text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:text-gold-ink"
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}

type MobileMenuProps = {
  open: boolean;
  onClose: (restoreFocus: boolean) => void;
};

function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else setExpanded(null);
  }, [open]);

  // Escape fecha; Tab permanece dentro do painel (focus trap)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose(true);
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (items.length === 0) return;
    // Tabulação controlada aqui (circular): o WebKit/Safari pula links no Tab por padrão,
    // o que faria o foco escapar do painel se dependêssemos da ordem nativa.
    e.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const step = e.shiftKey ? -1 : 1;
    const next = current === -1 ? (e.shiftKey ? items.length - 1 : 0) : current + step;
    items[(next + items.length) % items.length]?.focus();
  };

  const onNavigate = () => onClose(false);
  const linkClass =
    "flex min-h-12 items-center border-b border-border/70 text-[0.95rem] tracking-[0.08em] text-primary uppercase transition-colors hover:text-gold-ink";

  return (
    <div
      ref={panelRef}
      id={MENU_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      inert={!open}
      onKeyDown={onKeyDown}
      className={`fixed inset-0 z-[60] flex h-dvh flex-col bg-background duration-300 ease-out motion-reduce:transition-none xl:hidden ${
        open
          ? "visible translate-y-0 opacity-100 transition-[opacity,transform]"
          : "invisible -translate-y-2 opacity-0 transition-[opacity,transform,visibility]"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-[5vw] py-2.5 sm:px-8">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label={`${FIRM_NAME} — página inicial`}
          className="-m-1 inline-flex rounded-md p-1"
        >
          <BrandMark className="h-[3.25rem] w-auto min-[380px]:h-14 sm:h-16" />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(true)}
          aria-label="Fechar menu de navegação"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-primary transition-colors hover:bg-secondary"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav
        aria-label="Navegação principal (celular)"
        className="flex-1 overflow-y-auto overscroll-contain px-[5vw] pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8"
      >
        <div className="mx-auto max-w-xl">
          <section aria-labelledby="menu-areas-title" className="border-b border-border/70 py-3">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="menu-areas-title"
                className="font-body text-xs font-normal tracking-[0.2em] text-muted-foreground uppercase"
              >
                Áreas de atuação
              </h2>
              <Link
                to="/areas"
                onClick={onNavigate}
                className="inline-flex min-h-11 items-center text-xs tracking-[0.14em] text-gold-ink uppercase underline-offset-4 hover:underline"
              >
                Ver todas
              </Link>
            </div>
            <ul>
              {AREAS.map((a) => {
                const isOpen = expanded === a.slug;
                const panelId = `menu-area-${a.slug}`;
                return (
                  <li key={a.slug}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : a.slug)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex min-h-12 w-full items-center justify-between gap-3 text-left font-display text-lg leading-tight text-primary"
                    >
                      {a.title}
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 text-gold-ink transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div id={panelId} hidden={!isOpen} className="pb-3 pl-3">
                      <ul className="border-l border-gold/50 pl-4">
                        <li>
                          <Link
                            to="/areas/$slug"
                            params={{ slug: a.slug }}
                            onClick={onNavigate}
                            className="flex min-h-11 items-center text-sm font-medium text-primary hover:text-gold-ink"
                          >
                            Visão geral da área
                          </Link>
                        </li>
                        {a.subareas.map((s) => (
                          <li key={s}>
                            <Link
                              to="/areas/$slug"
                              params={{ slug: a.slug }}
                              hash="subareas"
                              onClick={onNavigate}
                              className="flex min-h-11 items-center py-1 text-sm leading-snug text-muted-foreground hover:text-gold-ink"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {NAV.map((item) =>
            item.to === "/areas" ? null : (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                onClick={onNavigate}
                className={linkClass}
              >
                {item.label}
              </Link>
            ),
          )}

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="wa-react mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs tracking-[0.16em] text-primary-foreground uppercase"
          >
            <WhatsappIcon className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>
      </nav>
    </div>
  );
}
