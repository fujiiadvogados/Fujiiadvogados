import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { Area } from "@/lib/areas";

type AreaCardProps = {
  area: Area;
  /**
   * "compact" (página inicial): sem foto, subáreas resumidas numa linha.
   * "full" (página de áreas): com foto e lista completa de subáreas.
   */
  variant?: "compact" | "full";
};

export function AreaCard({ area, variant = "full" }: AreaCardProps) {
  const titleId = `area-card-${area.slug}`;
  const isCompact = variant === "compact";

  return (
    <article
      aria-labelledby={titleId}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      {!isCompact && (
        <img
          src={area.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          className="aspect-[3/2] w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 id={titleId} className="text-2xl leading-tight text-primary">
          {area.title}
        </h3>
        <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold/80" />
        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
          {area.promise}
        </p>

        {isCompact ? (
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-foreground/80">
            <span className="sr-only">Subáreas: </span>
            {area.subareas.join(" · ")}
          </p>
        ) : (
          <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm leading-snug text-foreground/85">
            {area.subareas.map((s) => (
              <li key={s} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-gold" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <Link
            to="/areas/$slug"
            params={{ slug: area.slug }}
            aria-label={`Conheça a área: ${area.title}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs tracking-[0.14em] text-primary uppercase underline-offset-4 transition-colors group-hover:text-gold-ink hover:underline"
          >
            Conheça a área
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
