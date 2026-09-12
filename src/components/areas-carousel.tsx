import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { AreaCard } from "@/components/area-card";
import { AREAS, type Area } from "@/lib/areas";

const AUTOPLAY_MS = 5500;

export function AreasCarousel({ areas = AREAS }: { areas?: Area[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    duration: 26,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    };
    onReInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  // Volta ao início quando o grupo exibido muda
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
  }, [emblaApi, areas]);

  useEffect(() => {
    if (!emblaApi || !playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, playing]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onFocusCapture={() => setPlaying(false)}
    >
      <div className="overflow-hidden" ref={emblaRef} aria-roledescription="carrossel">
        <div className="-ml-6 flex touch-pan-y">
          {areas.map((area) => (
            <div
              key={area.slug}
              className="min-w-0 shrink-0 grow-0 basis-[86%] pl-6 sm:basis-1/2 lg:basis-1/3"
            >
              <AreaCard area={area} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Área anterior"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-primary transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Ir para ${areas[i]?.commercial ?? `slide ${i + 1}`}`}
              aria-current={i === selected}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === selected ? "w-8 bg-[var(--color-gold)]" : "w-2 bg-border hover:bg-gold/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Próxima área"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-primary transition-colors hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pausar carrossel" : "Reproduzir carrossel"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
