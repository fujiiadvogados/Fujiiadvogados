import practiceAreas from "../../packages/shared/practice-areas.json";

import imgPrevidenciario from "@/assets/area-previdenciario.jpg";
import imgTributario from "@/assets/area-tributario.jpg";
import imgCivil from "@/assets/area-execucoes.jpg";
import imgAgronegocio from "@/assets/area-agronegocio.jpg";
import imgConsumidor from "@/assets/area-consumidor.jpg";
import imgTrabalhista from "@/assets/area-trabalhista.jpg";

export type Faq = { q: string; a: string };

export type Area = {
  slug: string;
  /** Nome técnico da área (uso jurídico e SEO). */
  title: string;
  /** Nome comercial, focado no benefício ao cliente. */
  commercial: string;
  promise: string;
  text: string;
  problem: string;
  solution: string;
  image: string;
  alt: string;
  /** Subáreas de atuação dentro da área. */
  subareas: string[];
  faq: Faq[];
};

type RawArea = {
  slug: string;
  title: string;
  commercial: string;
  promise: string;
  description: string;
  problem: string;
  solution: string;
  subareas: string[];
  faq: Faq[];
};

const IMAGES: Record<string, string> = {
  tributario: imgTributario,
  agronegocio: imgAgronegocio,
  civil: imgCivil,
  consumidor: imgConsumidor,
  previdenciario: imgPrevidenciario,
  trabalhista: imgTrabalhista,
};

export const AREAS: Area[] = (practiceAreas as RawArea[]).map((area) => ({
  slug: area.slug,
  title: area.title,
  commercial: area.commercial,
  promise: area.promise,
  text: area.description,
  problem: area.problem,
  solution: area.solution,
  image: IMAGES[area.slug] ?? imgTributario,
  alt: `${area.title} — Fujii Advocacia & Consultoria Jurídica`,
  subareas: area.subareas,
  faq: area.faq,
}));

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
