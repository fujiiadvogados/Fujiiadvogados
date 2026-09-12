export const SITE_URL = "https://fujiiadvogados.com.br";

export const WHATSAPP_BASE = "https://wa.me/5565992348575?text=";
export const PHONE_LABEL = "+55 (65) 99234-8575";
export const PHONE_HREF = "tel:+5565992348575";
export const EMAIL = "atendimento@fujiiadvogados.com.br";

/** Endereço profissional do escritório. */
export const ADDRESS_LINES: string[] = [
  "Rua 4, n° 53 — Altos do Cerrado",
  "Cuiabá — Mato Grosso, Brasil",
  "Atendimento presencial mediante agendamento prévio",
  "Atendimento remoto por videoconferência para todo o Brasil",
];

export const OFFICE_HOURS = "Segunda a sexta, das 8h às 18h (horário de Cuiabá).";

const MAPS_QUERY = encodeURIComponent("Rua 4, 53 - Altos do Cerrado, Cuiabá - MT, Brasil");
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`;

export const WHATSAPP_LINK =
  WHATSAPP_BASE +
  encodeURIComponent(
    "Olá! Sobre seus serviços jurídicos, poderia me fornecer maiores informações?",
  );

export const areaLink = (area: string) =>
  WHATSAPP_BASE +
  encodeURIComponent(
    `Olá! Sobre seu serviço jurídico na área de ${area}, poderia me fornecer maiores informações?`,
  );

export const SOCIAL = {
  facebook: "https://www.facebook.com/fujiiadvogados",
  instagram: "https://www.instagram.com/fujiiadvogados",
  tiktok: "https://www.tiktok.com/@fujiiadvogados",
  blog: "https://fujiiadvogados.com.br/blog",
};

type NavItem = {
  to: "/" | "/areas" | "/quem-somos" | "/etica" | "/blog";
  hash?: string;
  label: string;
};

export const NAV: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/areas", label: "Áreas de atuação" },
  { to: "/quem-somos", label: "Quem somos" },
  { to: "/etica", label: "Ética e valores" },
  { to: "/blog", label: "Blog" },
  { to: "/", hash: "localizacao", label: "Localização" },
  { to: "/", hash: "contato", label: "Contato" },
];

/** Base da API do backend Express (contato por e-mail). */
export const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";
