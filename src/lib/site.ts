export const SITE_URL = "https://fujiiadvogados.com.br";

/** Número oficial (WhatsApp e telefone): código do país + DDD + número, só dígitos. */
export const PHONE_E164_DIGITS = "5565992348575";
export const PHONE_LABEL = "+55 (65) 99234-8575";
export const PHONE_HREF = `tel:+${PHONE_E164_DIGITS}`;
export const EMAIL = "atendimento@fujiiadvogados.com.br";

/** Endereço profissional do escritório (fonte única para página, rodapé e dados estruturados). */
export const ADDRESS = {
  street: "Rua Quatro, n° 53",
  neighborhood: "Altos do Cerrado",
  city: "Cuiabá",
  state: "Mato Grosso",
  stateCode: "MT",
  country: "Brasil",
  countryCode: "BR",
} as const;

export const ADDRESS_LINES: string[] = [
  `${ADDRESS.street} — ${ADDRESS.neighborhood}`,
  `${ADDRESS.city} — ${ADDRESS.state}, ${ADDRESS.country}`,
];

export const OFFICE_HOURS = "Segunda a sexta, das 8h às 18h (horário de Cuiabá).";

/*
 * Coordenadas do escritório informadas pelo responsável em 31/10/2026.
 * Usadas no lugar da busca textual: a busca por "Rua Quatro, 53" apontava para o
 * centro do "Residencial Altos do Cerrado", e não para o escritório.
 */
export const OFFICE_COORDS = { lat: -15.6048971, lng: -55.9929694 } as const;
const MAPS_POINT = `${OFFICE_COORDS.lat},${OFFICE_COORDS.lng}`;
/** "Ver no mapa" */
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_POINT}`;
/** "Como chegar" (rota a partir da localização do visitante) */
export const MAPS_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_POINT}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_POINT}&z=17&output=embed`;

/** Link wa.me com mensagem inicial (texto codificado para URL). */
export const whatsappLink = (text: string) =>
  `https://wa.me/${PHONE_E164_DIGITS}?text=${encodeURIComponent(text)}`;

export const WHATSAPP_LINK = whatsappLink(
  "Olá! Gostaria de agendar um atendimento com a Fujii Advocacia & Consultoria Jurídica.",
);

export const areaLink = (area: string) =>
  whatsappLink(`Olá! Gostaria de informações sobre atendimento em ${area}.`);

/** Atributos para links externos que abrem em nova aba. */
export const EXTERNAL_LINK = { target: "_blank", rel: "noopener noreferrer" } as const;

export const SOCIAL = {
  // Endereço já existente no projeto; nome informado: "Fujii Advogados" (pendente de confirmação)
  facebook: "https://www.facebook.com/fujiiadvogados",
  instagram: "https://www.instagram.com/fujiiadvogados/",
  tiktok: "https://www.tiktok.com/@fujii.advogados",
  blog: "https://fujiiadvogados.com.br/blog",
};

export const SOCIAL_HANDLES = {
  facebook: "Fujii Advogados",
  instagram: "@fujiiadvogados",
  tiktok: "@fujii.advogados",
};

export const FIRM_NAME = "Fujii Advocacia & Consultoria Jurídica";

type NavItem = {
  to: "/" | "/areas" | "/quem-somos" | "/etica" | "/blog";
  hash?: string;
  label: string;
};

/** Menu principal: a logo leva à página inicial; a localização fica junto do contato. */
export const NAV: NavItem[] = [
  { to: "/areas", label: "Áreas de atuação" },
  { to: "/quem-somos", label: "Quem somos" },
  { to: "/etica", label: "Ética e valores" },
  { to: "/blog", label: "Blog" },
  { to: "/", hash: "contato", label: "Contato" },
];

/** Base da API do backend Express (contato por e-mail). */
export const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";
