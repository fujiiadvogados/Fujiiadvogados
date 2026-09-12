import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { WhatsappIcon } from "@/components/brand-icons";
import { areaLink } from "@/lib/site";
import type { Area } from "@/lib/areas";

export function AreaCard({ area }: { area: Area }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]">
      <Link
        to="/areas/$slug"
        params={{ slug: area.slug }}
        className="relative block overflow-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        aria-label={`${area.commercial} — ${area.title}`}
      >
        <img
          src={area.image}
          alt={area.alt}
          loading="lazy"
          width={1200}
          height={800}
          className="h-40 w-full origin-center scale-[1.03] object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.12] motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-image-veil)] transition-opacity duration-700 group-hover:opacity-70" />
        <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent_35%,color-mix(in_oklab,var(--color-gold)_26%,transparent)_50%,transparent_65%)] transition-transform duration-[1100ms] ease-out group-hover:translate-x-[120%] motion-reduce:hidden" />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.65rem] tracking-[0.2em] text-gold-ink uppercase">{area.title}</p>
        <h3 className="mt-2 text-xl leading-snug font-normal text-primary">
          <Link
            to="/areas/$slug"
            params={{ slug: area.slug }}
            className="transition-colors hover:text-gold-ink"
          >
            {area.commercial}
          </Link>
        </h3>
        <div className="mt-3 h-px w-10 rule-gold transition-[width] duration-500 group-hover:w-20" />
        <p className="mt-3 text-sm leading-relaxed text-pretty text-foreground/75 hyphens-none">
          {area.promise}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            to="/areas/$slug"
            params={{ slug: area.slug }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs tracking-[0.12em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5"
          >
            Ver solução
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={areaLink(area.title)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs tracking-[0.12em] text-primary uppercase transition-colors hover:bg-secondary"
          >
            <WhatsappIcon className="h-4 w-4 text-whatsapp" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
