import { MapPin, Navigation } from "lucide-react";

import { ADDRESS_LINES, MAPS_EMBED_URL, MAPS_LINK, OFFICE_HOURS } from "@/lib/site";

export function LocationMap() {
  return (
    <section
      id="localizacao"
      className="scroll-mt-24 border-y border-border bg-[image:var(--gradient-veil)] py-16 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-[80rem] gap-10 px-[5vw] sm:px-8 lg:grid-cols-[0.8fr_1.2fr] xl:px-12">
        <div>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Localização</p>
          <h2 className="mt-3 text-3xl leading-tight text-primary">Onde nos encontrar</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Atendimento presencial mediante agendamento prévio e atendimento remoto por
            videoconferência para todo o Brasil.
          </p>

          <div className="mt-6 flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
            <address className="text-sm leading-relaxed text-muted-foreground not-italic">
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{OFFICE_HOURS}</p>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
          >
            <Navigation className="h-4 w-4 text-gold-ink" />
            Traçar rota
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-lift)]">
          <iframe
            title="Mapa da localização do escritório Fujii Advogados"
            src={MAPS_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[20rem] w-full border-0 sm:h-[24rem] lg:h-full lg:min-h-[22rem]"
          />
        </div>
      </div>
    </section>
  );
}
