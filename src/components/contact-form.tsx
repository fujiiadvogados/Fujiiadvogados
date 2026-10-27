import { useState, type FormEvent } from "react";
import { Loader2, Send, ShieldCheck } from "lucide-react";

import { AREAS } from "@/lib/areas";
import { API_URL, EMAIL, WHATSAPP_LINK } from "@/lib/site";
import { WhatsappIcon } from "@/components/brand-icons";

type Status = "idle" | "sending" | "sent" | "error";

const URGENCIES = [
  { value: "normal", label: "Não — posso aguardar retorno" },
  { value: "prioritaria", label: "Sim — tenho prazo próximo" },
  { value: "urgente", label: "Urgente — prazo em 48 horas" },
];

const fieldClass =
  "peer w-full rounded-xl border border-border bg-card px-4 pt-6 pb-2 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-gold focus:ring-2 focus:ring-gold/25";
const labelClass =
  "pointer-events-none absolute left-4 top-2 text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase transition-all";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "")
        .trim()
        .slice(0, 120),
      email: String(data.get("email") ?? "")
        .trim()
        .slice(0, 255),
      phone: String(data.get("phone") ?? "")
        .trim()
        .slice(0, 30),
      area: String(data.get("area") ?? ""),
      urgency: String(data.get("urgency") ?? "normal"),
      message: String(data.get("message") ?? "")
        .trim()
        .slice(0, 2000),
      website: String(data.get("website") ?? ""),
    };

    if (payload.website) return; // honeypot

    if (!payload.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
      setStatus("error");
      setFeedback("Verifique seu nome e um e-mail válido para que possamos retornar o contato.");
      return;
    }
    if (payload.message.length < 10) {
      setStatus("error");
      setFeedback("Descreva sua demanda com pelo menos 10 caracteres.");
      return;
    }

    const areaTitle = AREAS.find((a) => a.slug === payload.area)?.title ?? "Não informada";
    const urgencyLabel =
      URGENCIES.find((u) => u.value === payload.urgency)?.label ?? "Não informada";

    const lines = [
      `Nome: ${payload.name}`,
      `E-mail: ${payload.email}`,
      `Telefone: ${payload.phone || "não informado"}`,
      `Área de interesse: ${areaTitle}`,
      `Urgência: ${urgencyLabel}`,
      "",
      payload.message,
    ].join("\n");

    if (API_URL) {
      setStatus("sending");
      setFeedback("");
      try {
        const response = await fetch(`${API_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(String(response.status));
        setStatus("sent");
        setFeedback(
          "Mensagem enviada. Retornaremos o contato no menor prazo possível, com sigilo profissional.",
        );
        form.reset();
        return;
      } catch {
        // segue para o envio assistido abaixo
      }
    }

    const subject = encodeURIComponent(`Contato pelo site — ${areaTitle}`);
    const body = encodeURIComponent(`Olá! Contato pelo site Fujii Advocacia & Consultoria Jurídica.\n\n${lines}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("sent");
    setFeedback(
      `Abrimos seu programa de e-mail com a mensagem pronta para envio a ${EMAIL}. Prefere WhatsApp? Use o botão ao lado.`,
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            placeholder="Nome completo"
            className={fieldClass}
          />
          <label htmlFor="name" className={labelClass}>
            Nome completo *
          </label>
        </div>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            placeholder="E-mail"
            className={fieldClass}
          />
          <label htmlFor="email" className={labelClass}>
            E-mail *
          </label>
        </div>

        <div className="relative">
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            placeholder="Telefone / WhatsApp"
            className={fieldClass}
          />
          <label htmlFor="phone" className={labelClass}>
            Telefone / WhatsApp
          </label>
        </div>

        <div className="relative">
          <select
            id="area"
            name="area"
            required
            defaultValue=""
            className={`${fieldClass} appearance-none bg-[length:0.7rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Selecione uma área
            </option>
            {AREAS.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
          <label htmlFor="area" className={labelClass}>
            Área de interesse *
          </label>
        </div>
      </div>

      <div className="relative">
        <select
          id="urgency"
          name="urgency"
          defaultValue="normal"
          className={`${fieldClass} appearance-none pr-10`}
        >
          {URGENCIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <label htmlFor="urgency" className={labelClass}>
          Sua demanda é urgente?
        </label>
      </div>

      <div className="relative">
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Descreva brevemente a sua demanda"
          className={`${fieldClass} resize-y`}
        />
        <label htmlFor="message" className={labelClass}>
          Descreva brevemente a sua demanda *
        </label>
      </div>

      {/* honeypot anti-spam: invisível para pessoas, preenchido por robôs */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "sending" ? "Enviando…" : "Enviar mensagem"}
        </button>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-3 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
        >
          <WhatsappIcon className="h-4 w-4 text-whatsapp" />
          Falar no WhatsApp
        </a>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm leading-relaxed text-muted-foreground">
        {feedback}
      </p>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
        Envio protegido por conexão criptografada (HTTPS). Seus dados são tratados apenas para
        retorno do contato, sob sigilo profissional e conforme a LGPD (Lei nº 13.709/2018).
      </p>
    </form>
  );
}
