import { MapPin, Navigation } from "lucide-react";

import {
  ADDRESS_LINES,
  EXTERNAL_LINK,
  MAPS_DIRECTIONS_LINK,
  MAPS_EMBED_URL,
  MAPS_LINK,
  OFFICE_HOURS,
} from "@/lib/site";

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/60 px-5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary";

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
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
            <address className="text-sm leading-relaxed text-muted-foreground not-italic">
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{OFFICE_HOURS}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={MAPS_LINK}
              {...EXTERNAL_LINK}
              aria-label="Ver no mapa (Google Maps, abre em nova aba)"
              className={buttonClass}
            >
              <MapPin className="h-4 w-4 text-gold-ink" aria-hidden="true" />
              Ver no mapa
            </a>
            <a
              href={MAPS_DIRECTIONS_LINK}
              {...EXTERNAL_LINK}
              aria-label="Como chegar (rota no Google Maps, abre em nova aba)"
              className={buttonClass}
            >
              <Navigation className="h-4 w-4 text-gold-ink" aria-hidden="true" />
              Como chegar
            </a>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl border border-border">
          <iframe
            title={`Mapa do escritório: ${ADDRESS_LINES.join(", ")}`}
            src={MAPS_EMBED_URL}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[20rem] w-full border-0 sm:h-[24rem] lg:h-full lg:min-h-[22rem]"
          />
        </div>
      </div>
    </section>
  );
}
