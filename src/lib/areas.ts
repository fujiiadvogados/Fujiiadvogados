import practiceAreas from "../../packages/shared/practice-areas.json";

import imgPrevidenciario from "@/assets/area-previdenciario.jpg";
import imgTributario from "@/assets/area-tributario.jpg";
import imgExecucoes from "@/assets/area-execucoes.jpg";
import imgAgronegocio from "@/assets/area-agronegocio.jpg";
import imgCreditoRural from "@/assets/area-credito-rural.jpg";
import imgEndividamento from "@/assets/area-endividamento-rural.jpg";
import imgConsumidor from "@/assets/area-consumidor.jpg";
import imgMedico from "@/assets/area-medico.jpg";
import imgTrabalhista from "@/assets/area-trabalhista.jpg";
import imgAereo from "@/assets/area-aereo.jpg";
import imgConcessionarias from "@/assets/area-concessionarias.jpg";

export type GroupId = "empresas" | "rural" | "cidadao";

export type Faq = { q: string; a: string };

export type Area = {
  slug: string;
  group: GroupId;
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
  services: string[];
  faq: Faq[];
};

type RawArea = {
  slug: string;
  group: GroupId;
  title: string;
  commercial: string;
  promise: string;
  description: string;
  problem: string;
  solution: string;
  services: string[];
  faq: Faq[];
};

const IMAGES: Record<string, string> = {
  tributario: imgTributario,
  "execucoes-fiscais": imgExecucoes,
  trabalhista: imgTrabalhista,
  agronegocio: imgAgronegocio,
  "credito-rural": imgCreditoRural,
  "endividamento-rural": imgEndividamento,
  previdenciario: imgPrevidenciario,
  consumidor: imgConsumidor,
  "direito-medico": imgMedico,
  "companhias-aereas": imgAereo,
  concessionarias: imgConcessionarias,
};

export const AREAS: Area[] = (practiceAreas as RawArea[]).map((area) => ({
  slug: area.slug,
  group: area.group,
  title: area.title,
  commercial: area.commercial,
  promise: area.promise,
  text: area.description,
  problem: area.problem,
  solution: area.solution,
  image: IMAGES[area.slug] ?? imgTributario,
  alt: `${area.title} — Fujii Advogados`,
  services: area.services,
  faq: area.faq,
}));

export type Group = {
  id: GroupId;
  label: string;
  short: string;
  tagline: string;
  areas: Area[];
};

const GROUP_META: Record<GroupId, { label: string; short: string; tagline: string }> = {
  empresas: {
    label: "Pessoa Jurídica",
    short: "Pessoa Jurídica",
    tagline:
      "Para empresas, sociedades e contribuintes pessoa jurídica: carga tributária revisada, execuções fiscais defendidas e relações de trabalho sob controle.",
  },
  rural: {
    label: "Produtor Rural e Agronegócio",
    short: "Produtor Rural",
    tagline:
      "Para produtor rural pessoa física ou jurídica: contratos do agro, crédito rural e reestruturação de dívidas para manter a atividade em pé.",
  },
  cidadao: {
    label: "Pessoa Física, Famílias e Servidores",
    short: "Pessoa Física",
    tagline:
      "Para a pessoa física: benefícios previdenciários, saúde, consumo, transporte aéreo e serviços essenciais defendidos com técnica.",
  },
};

export const GROUPS: Group[] = (["empresas", "rural", "cidadao"] as GroupId[]).map((id) => ({
  id,
  ...GROUP_META[id],
  areas: AREAS.filter((a) => a.group === id),
}));

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
