import { AREAS } from "@/lib/areas";
import { API_URL } from "@/lib/site";

/** Endpoint PHP publicado junto com o site estático (public/api/contato.php). */
export const CONTACT_ENDPOINT = `${API_URL}/api/contato.php`;

const REQUEST_TIMEOUT_MS = 20000;

export const LIMITS = { name: 120, email: 254, phone: 30, message: 2000 } as const;

export const URGENCIES = [
  { value: "normal", label: "Não, posso aguardar" },
  { value: "prioritaria", label: "Sim, tenho prazo próximo" },
  { value: "urgente", label: "Urgente: prazo em até 48 h" },
] as const;

export type ContactField = "name" | "email" | "phone" | "area" | "message";

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  area: string;
  urgency: string;
  message: string;
};

export type FieldErrors = Partial<Record<ContactField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^[0-9+()\-. ]*$/;

/** Mesmas regras aplicadas pelo servidor (public/api/contato.php). */
export function validateContact(v: ContactValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > LIMITS.name) {
    errors.name = "Informe seu nome completo (2 a 120 caracteres).";
  }
  const email = v.email.trim();
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    errors.email = "Informe um e-mail válido, por exemplo nome@provedor.com.br.";
  }
  const phone = v.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (
    phone.length > LIMITS.phone ||
    !PHONE_CHARS_RE.test(phone) ||
    digits.length < 10 ||
    digits.length > 13
  ) {
    errors.phone = "Informe um telefone com DDD, por exemplo (65) 99999-9999.";
  }
  if (!AREAS.some((a) => a.slug === v.area)) {
    errors.area = "Selecione uma das áreas de atuação.";
  }
  const message = v.message.trim();
  if (message.length < 10 || message.length > LIMITS.message) {
    errors.message = "Descreva sua demanda em pelo menos 10 caracteres (máximo de 2.000).";
  }
  return errors;
}

export type SubmitResult =
  | { kind: "sent" }
  | { kind: "invalid"; fields: FieldErrors; message: string }
  | { kind: "error"; reason: FailureReason; message: string };

type ServerResponse = {
  ok?: boolean;
  code?: string;
  message?: string;
  fields?: Record<string, string>;
};

function pickFieldErrors(fields: Record<string, string> | undefined): FieldErrors {
  const out: FieldErrors = {};
  const known: ContactField[] = ["name", "email", "phone", "area", "message"];
  for (const key of known) {
    const value = fields?.[key];
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

/** Mensagens exibidas ao visitante (sem detalhes internos de configuração). */
export const FAILURE_MESSAGES = {
  unavailable:
    "Não foi possível enviar pelo formulário neste momento. Seus dados foram mantidos: tente novamente em instantes ou fale conosco pelo WhatsApp.",
  timeout:
    "O servidor demorou a responder. Seus dados foram mantidos: tente novamente ou fale conosco pelo WhatsApp.",
  network:
    "Sem conexão com o servidor. Verifique sua internet; seus dados foram mantidos no formulário.",
  rateLimited:
    "Muitas tentativas em pouco tempo. Tente novamente mais tarde ou fale conosco pelo WhatsApp.",
} as const;

export type FailureReason = "unavailable" | "timeout" | "network" | "rate_limited" | "retry";

/**
 * Envia ao endpoint e só retorna "sent" quando o servidor confirma que o
 * servidor de e-mail aceitou a mensagem (HTTP 2xx com code "sent"/"duplicate").
 * Qualquer resposta que não seja o JSON do endpoint (ex.: HTML de uma rota da SPA ou o
 * arquivo PHP servido sem execução) é tratada como indisponibilidade.
 */
export async function submitContact(
  values: ContactValues,
  meta: { requestId: string; elapsedMs: number; website: string },
): Promise<SubmitResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...values,
        request_id: meta.requestId,
        elapsed_ms: Math.round(meta.elapsedMs),
        website: meta.website,
      }),
      signal: controller.signal,
    });

    let data: ServerResponse | null = null;
    if ((response.headers.get("content-type") ?? "").includes("application/json")) {
      data = (await response.json().catch(() => null)) as ServerResponse | null;
    }
    if (!data || typeof data.code !== "string") {
      return { kind: "error", reason: "unavailable", message: FAILURE_MESSAGES.unavailable };
    }
    if (response.ok && data.ok && (data.code === "sent" || data.code === "duplicate")) {
      return { kind: "sent" };
    }
    if (response.status === 422 && data.code === "invalid") {
      return {
        kind: "invalid",
        fields: pickFieldErrors(data.fields),
        message: "Revise os campos indicados.",
      };
    }
    if (data.code === "rate_limited") {
      return { kind: "error", reason: "rate_limited", message: FAILURE_MESSAGES.rateLimited };
    }
    if (data.code === "too_fast") {
      return {
        kind: "error",
        reason: "retry",
        message: "Aguarde alguns segundos e envie novamente.",
      };
    }
    if (data.code === "in_progress") {
      return {
        kind: "error",
        reason: "retry",
        message: "Seu envio anterior ainda está em processamento. Aguarde um instante.",
      };
    }
    return { kind: "error", reason: "unavailable", message: FAILURE_MESSAGES.unavailable };
  } catch {
    return timedOut
      ? { kind: "error", reason: "timeout", message: FAILURE_MESSAGES.timeout }
      : { kind: "error", reason: "network", message: FAILURE_MESSAGES.network };
  } finally {
    window.clearTimeout(timer);
  }
}

/** Texto para o WhatsApp com o que o visitante já preencheu. */
export function whatsappTextFrom(v: ContactValues): string {
  const area = AREAS.find((a) => a.slug === v.area)?.title;
  const parts = ["Olá! Gostaria de atendimento da Fujii Advocacia & Consultoria Jurídica."];
  if (v.name.trim()) parts.push(`Nome: ${v.name.trim()}`);
  if (area) parts.push(`Área: ${area}`);
  if (v.message.trim()) parts.push(`Mensagem: ${v.message.trim()}`);
  return parts.join("\n");
}

export function newRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-req`;
}
