import { useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { AREAS } from "@/lib/areas";
import { FIRM_NAME } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import imgInstitucional from "@/assets/area-execucoes.jpg";

const AUTOPLAY_MS = 7000;

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  /** Rótulo e destino do botão principal. */
  primary: { label: string } & ({ to: "/"; hash: string } | { to: "/areas/$slug"; slug: string });
};

const SLIDES: Slide[] = [
  {
    key: "institucional",
    eyebrow: FIRM_NAME,
    title: "Advocacia e consultoria jurídica",
    text: "Atuação consultiva e contenciosa em seis áreas do Direito, com atendimento presencial em Cuiabá (MT) e remoto para todo o Brasil.",
    image: imgInstitucional,
    primary: { label: "Conheça nossas áreas de atuação", to: "/", hash: "areas" },
  },
  ...AREAS.map<Slide>((a) => ({
    key: a.slug,
    eyebrow: "Área de atuação",
    title: a.title,
    text: a.promise,
    image: a.image,
    primary: { label: "Conheça esta área", to: "/areas/$slug", slug: a.slug },
  })),
];

export function HeroCarousel() {
  const reducedMotion = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selected, setSelected] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  // Os controles só funcionam depois que o Embla inicializa (após a hidratação do React).
  // Até lá eles são renderizados desabilitados — no HTML do servidor inclusive —, para não
  // parecerem disponíveis e descartarem o clique.
  const ready = emblaApi !== undefined;
  const playing = !userPaused && !reducedMotion;
  const autoplayActive = playing && !interacting;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplayActive) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, autoplayActive, selected]);

  const scrollPrev = useCallback(
    () => emblaApi?.scrollPrev(reducedMotion),
    [emblaApi, reducedMotion],
  );
  const scrollNext = useCallback(
    () => emblaApi?.scrollNext(reducedMotion),
    [emblaApi, reducedMotion],
  );
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i, reducedMotion),
    [emblaApi, reducedMotion],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!ready) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques do escritório"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setInteracting(false);
      }}
      className="relative isolate overflow-hidden bg-primary text-primary-foreground"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y" aria-live={autoplayActive ? "off" : "polite"}>
          {SLIDES.map((slide, i) => (
            <HeroSlide
              key={slide.key}
              slide={slide}
              index={i}
              isActive={i === selected}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="pointer-events-auto mx-auto flex w-full max-w-[80rem] flex-wrap items-center gap-x-1 gap-y-1 px-[5vw] sm:gap-x-2 pb-5 sm:px-8 xl:px-12">
          <ControlButton label="Slide anterior" onClick={scrollPrev} disabled={!ready}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </ControlButton>

          <div role="group" aria-label="Escolher slide" className="flex items-center">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => scrollTo(i)}
                disabled={!ready}
                aria-label={`Slide ${i + 1} de ${SLIDES.length}: ${slide.title}`}
                aria-current={i === selected ? "true" : undefined}
                className="group inline-flex h-11 w-6 items-center justify-center disabled:cursor-default disabled:opacity-40 sm:w-7"
              >
                <span
                  aria-hidden="true"
                  className={`block h-[3px] rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    i === selected
                      ? "w-5 bg-gold"
                      : "w-2.5 bg-primary-foreground/45 group-hover:bg-primary-foreground/80"
                  }`}
                />
              </button>
            ))}
          </div>

          <ControlButton label="Próximo slide" onClick={scrollNext} disabled={!ready}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </ControlButton>

          {!reducedMotion && (
            <ControlButton
              label={playing ? "Pausar rotação automática" : "Retomar rotação automática"}
              onClick={() => setUserPaused((v) => !v)}
              disabled={!ready}
            >
              {playing ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
            </ControlButton>
          )}
        </div>
      </div>
    </section>
  );
}

type HeroSlideProps = {
  slide: Slide;
  index: number;
  isActive: boolean;
  isFirst: boolean;
};

function HeroSlide({ slide, index, isActive, isFirst }: HeroSlideProps) {
  const Heading = isFirst ? "h1" : "h2";
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} de ${SLIDES.length}`}
      inert={!isActive}
      className="relative min-w-0 shrink-0 grow-0 basis-full"
    >
      <img
        src={slide.image}
        alt=""
        width={1200}
        height={800}
        loading={isFirst ? "eager" : "lazy"}
        fetchPriority={isFirst ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      {/* Véu azul-marinho: garante contraste do texto sobre qualquer imagem */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.2_0.05_255/0.7)_0%,oklch(0.2_0.05_255/0.9)_50%,oklch(0.2_0.05_255/0.96)_100%)] md:bg-[linear-gradient(90deg,oklch(0.2_0.05_255/0.95)_0%,oklch(0.2_0.05_255/0.86)_45%,oklch(0.2_0.05_255/0.35)_100%)]"
      />

      <div className="mx-auto flex min-h-[34rem] w-full max-w-[80rem] flex-col justify-end px-[5vw] pt-24 pb-24 sm:min-h-[36rem] sm:px-8 md:justify-center md:pb-28 lg:min-h-[38rem] xl:px-12">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] tracking-[0.24em] text-gold uppercase sm:text-xs">
            {slide.eyebrow}
          </p>
          <div aria-hidden="true" className="mt-4 h-px w-12 bg-gold/80" />
          <Heading className="mt-5 text-4xl leading-[1.05] text-balance text-primary-foreground sm:text-5xl lg:text-6xl">
            {slide.title}
          </Heading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-primary-foreground/85 sm:text-lg">
            {slide.text}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {slide.primary.to === "/" ? (
              <Link to="/" hash={slide.primary.hash} className={primaryCta}>
                {slide.primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/areas/$slug" params={{ slug: slide.primary.slug }} className={primaryCta}>
                {slide.primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <Link to="/" hash="contato" className={secondaryCta}>
              Entre em contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const primaryCta =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 text-sm tracking-wide text-primary transition-colors hover:bg-gold-soft";
const secondaryCta =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-primary-foreground/50 px-6 text-sm tracking-wide text-primary-foreground transition-colors hover:border-gold hover:text-gold";

type ControlButtonProps = {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
};

function ControlButton({ label, onClick, disabled, children }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground transition-colors enabled:hover:border-gold enabled:hover:text-gold disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  );
}
