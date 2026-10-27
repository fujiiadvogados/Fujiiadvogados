import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";

import { AREAS } from "@/lib/areas";
import { NAV, WHATSAPP_LINK } from "@/lib/site";
import { WhatsappIcon } from "@/components/brand-icons";
import emblem from "@/assets/emblem.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const location = useRouterState({ select: (s) => s.location.href });

  // Fecha o menu ao navegar
  useEffect(() => {
    setOpen(false);
    setAreasOpen(false);
  }, [location]);

  // Fecha no desktop, com Escape, e bloqueia o scroll do body enquanto aberto
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const { style } = document.body;
    const previous = style.overflow;
    if (open) style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-3 px-[5vw] py-3 sm:px-8 sm:py-4 xl:px-12">
        <Link
          to="/"
          aria-label="Fujii Advocacia & Consultoria Jurídica — página inicial"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <img
            src={emblem}
            alt=""
            aria-hidden="true"
            width={225}
            height={270}
            className="h-11 w-auto shrink-0 object-contain sm:h-12"
          />
          <span className="flex flex-col leading-none">
            <span className="max-w-[11rem] font-display text-[0.7rem] leading-snug tracking-[0.14em] text-gilded uppercase sm:max-w-[14rem] sm:text-sm xl:text-[0.95rem]">
              Fujii Advocacia & Consultoria Jurídica
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <nav aria-label="Navegação principal" className="hidden items-center gap-4 xl:flex xl:gap-5">
            {NAV.map((item) =>
              item.to === "/areas" ? (
                <div key={item.label} className="group relative">
                  <Link
                    to="/areas"
                    activeProps={{ className: "text-gold-ink" }}
                    className="inline-flex items-center gap-1 text-[0.7rem] tracking-[0.14em] text-primary uppercase transition-colors hover:text-gold-ink xl:text-xs"
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>
                  <div className="pointer-events-none absolute top-full left-1/2 z-50 w-[58rem] max-w-[92vw] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] md:grid-cols-3">
                      {AREAS.map((a) => (
                        <div key={a.slug}>
                          <Link
                            to="/areas/$slug"
                            params={{ slug: a.slug }}
                            className="block text-[0.68rem] tracking-[0.16em] text-gold-ink uppercase transition-colors hover:text-primary"
                          >
                            {a.title}
                          </Link>
                          <ul className="mt-2 space-y-1">
                            {a.subareas.slice(0, 5).map((s) => (
                              <li key={s} className="text-[0.76rem] leading-snug text-foreground/70">
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
                  className="text-[0.7rem] tracking-[0.14em] text-primary uppercase transition-colors hover:text-gold-ink xl:text-xs"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs tracking-[0.16em] text-primary uppercase transition-colors hover:bg-secondary sm:inline-flex"
          >
            <WhatsappIcon className="h-4 w-4 text-whatsapp" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gold/60 text-primary transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none xl:hidden"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
                open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-[var(--header-h,4.25rem)] -z-10 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="menu-mobile"
        className={`grid overflow-hidden border-t border-border/60 bg-background transition-[grid-template-rows,opacity] duration-400 ease-out xl:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav
          aria-label="Navegação principal (mobile)"
          className="mx-auto flex max-h-[80vh] w-full max-w-[80rem] flex-col gap-1 overflow-y-auto px-[5vw] py-3 sm:px-8"
        >
          {NAV.map((item, i) => {
            const style = { transitionDelay: open ? `${80 + i * 45}ms` : "0ms" } as const;
            const anim = open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0";
            if (item.to === "/areas") {
              return (
                <div key={item.label} style={style} className={`transition-all duration-300 ${anim}`}>
                  <button
                    type="button"
                    onClick={() => setAreasOpen((v) => !v)}
                    aria-expanded={areasOpen}
                    className="flex w-full items-center justify-between rounded-md border-l-2 border-transparent px-3 py-3 text-sm tracking-[0.12em] text-primary uppercase transition-colors hover:border-gold hover:bg-secondary"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${areasOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      areasOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 space-y-4 py-2 pl-5">
                      <ul className="space-y-1">
                        {AREAS.map((a) => (
                          <li key={a.slug}>
                            <Link
                              to="/areas/$slug"
                              params={{ slug: a.slug }}
                              onClick={() => setOpen(false)}
                              className="block py-1.5 text-sm text-foreground/75 transition-colors hover:text-gold-ink"
                            >
                              {a.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/areas"
                        onClick={() => setOpen(false)}
                        className="inline-block py-1.5 text-xs tracking-[0.14em] text-gold-ink uppercase"
                      >
                        Ver todas as áreas
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                activeOptions={{ exact: item.to === "/", includeHash: true }}
                activeProps={{ className: "text-gold-ink" }}
                onClick={() => setOpen(false)}
                style={style}
                className={`rounded-md border-l-2 border-transparent px-3 py-3 text-sm tracking-[0.12em] text-primary uppercase transition-all duration-300 hover:border-gold hover:bg-secondary motion-reduce:transition-none ${anim}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${80 + NAV.length * 45}ms` : "0ms" }}
            className={`mt-2 mb-1 inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-4 py-3 text-xs tracking-[0.16em] text-primary uppercase transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <WhatsappIcon className="h-4 w-4 text-whatsapp" />
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
