import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, Send, ShieldCheck } from "lucide-react";

import { AREAS } from "@/lib/areas";
import { EMAIL, EXTERNAL_LINK, PHONE_HREF, PHONE_LABEL, whatsappLink } from "@/lib/site";
import {
  LIMITS,
  URGENCIES,
  newRequestId,
  submitContact,
  validateContact,
  whatsappTextFrom,
  type ContactField,
  type ContactValues,
  type FieldErrors,
} from "@/lib/contact";
import { WhatsappIcon } from "@/components/brand-icons";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: ContactValues = {
  name: "",
  email: "",
  phone: "",
  area: "",
  urgency: "normal",
  message: "",
};

const FIELD_ORDER: ContactField[] = ["name", "email", "phone", "area", "message"];

const fieldBase =
  "peer w-full rounded-xl border bg-card px-4 pt-6 pb-2 text-base text-foreground outline-none transition-colors placeholder:text-transparent focus:border-gold focus:ring-2 focus:ring-gold/25 sm:text-sm";
const labelClass =
  "pointer-events-none absolute top-2 left-4 text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase";

function mailtoFrom(v: ContactValues): string {
  const area = AREAS.find((a) => a.slug === v.area)?.title ?? "Não informada";
  const subject = encodeURIComponent(`Contato pelo site — ${area}`);
  const body = encodeURIComponent(
    [
      `Nome: ${v.name}`,
      `E-mail: ${v.email}`,
      `Telefone/WhatsApp: ${v.phone}`,
      `Área de interesse: ${area}`,
      "",
      v.message,
    ].join("\n"),
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const requestIdRef = useRef("");
  const startedAtRef = useRef(0);

  useEffect(() => {
    requestIdRef.current = newRequestId();
    startedAtRef.current = Date.now();
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as ContactField];
        return next;
      });
    }
  };

  const focusFirstInvalid = (fieldErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return; // evita envio duplicado (duplo clique/Enter repetido)

    const fieldErrors = validateContact(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("idle");
      setFeedback("");
      focusFirstInvalid(fieldErrors);
      return;
    }

    const website =
      formRef.current?.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? "";
    sendingRef.current = true;
    setErrors({});
    setStatus("sending");
    setFeedback("");

    const result = await submitContact(values, {
      requestId: requestIdRef.current,
      elapsedMs: Date.now() - startedAtRef.current,
      website,
    });
    sendingRef.current = false;

    if (result.kind === "sent") {
      setStatus("sent");
      setValues(EMPTY);
      requestIdRef.current = newRequestId();
      startedAtRef.current = Date.now();
    } else if (result.kind === "invalid") {
      setStatus("idle");
      setErrors(result.fields);
      focusFirstInvalid(result.fields);
    } else {
      // Mantém o mesmo request_id: se a 1ª tentativa chegou ao servidor, o reenvio não duplica.
      setStatus("error");
      setFeedback(result.message);
    }
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }

  const openWhatsapp = () => {
    window.open(whatsappLink(whatsappTextFrom(values)), "_blank", "noopener,noreferrer");
  };

  const errorCount = Object.keys(errors).length;
  const sending = status === "sending";

  if (status === "sent") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-gold/50 bg-secondary/60 p-6 outline-none"
      >
        <CheckCircle2 className="h-6 w-6 text-gold-ink" aria-hidden="true" />
        <p className="mt-3 font-display text-2xl text-primary">Mensagem enviada</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sua mensagem foi entregue ao e-mail do escritório. O retorno será feito pelo e-mail ou
          telefone informado.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex min-h-11 items-center rounded-full border border-gold/60 px-5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-card"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="form-obrigatorios"
      aria-busy={sending}
      className="grid gap-4"
    >
      <p id="form-obrigatorios" className="text-xs text-muted-foreground">
        Campos marcados com * são obrigatórios.
      </p>

      {errorCount > 0 && (
        <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorCount === 1 ? "Há 1 campo para revisar." : `Há ${errorCount} campos para revisar.`}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Nome completo *" error={errors.name}>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            required
            maxLength={LIMITS.name}
            autoComplete="name"
            placeholder="Nome completo"
            {...fieldA11y("name", errors.name)}
          />
        </Field>

        <Field name="email" label="E-mail *" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={onChange}
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            placeholder="E-mail"
            {...fieldA11y("email", errors.email)}
          />
        </Field>

        <Field name="phone" label="Telefone / WhatsApp *" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={onChange}
            required
            maxLength={LIMITS.phone}
            autoComplete="tel"
            placeholder="(65) 99999-9999"
            {...fieldA11y("phone", errors.phone)}
          />
        </Field>

        <Field name="area" label="Área de interesse *" error={errors.area}>
          <select
            id="area"
            name="area"
            value={values.area}
            onChange={onChange}
            required
            {...fieldA11y("area", errors.area, "appearance-none pr-10")}
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
        </Field>
      </div>

      <Field name="urgency" label="Sua demanda é urgente?">
        <select
          id="urgency"
          name="urgency"
          value={values.urgency}
          onChange={onChange}
          {...fieldA11y("urgency", undefined, "appearance-none pr-10")}
        >
          {URGENCIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="message"
        label="Descreva sua demanda *"
        error={errors.message}
        hint={`${values.message.length}/${LIMITS.message}`}
      >
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={onChange}
          required
          maxLength={LIMITS.message}
          rows={5}
          placeholder="Descreva sua demanda"
          {...fieldA11y("message", errors.message, "resize-y")}
        />
      </Field>

      {/* Honeypot antispam: fora da tela e fora da ordem de tabulação */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm leading-relaxed outline-none"
        >
          <p className="flex items-start gap-2 font-medium text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {feedback}
          </p>
          <p className="mt-2 text-muted-foreground">
            Você pode tentar novamente ou usar outro canal:
          </p>
          <ul className="mt-1 text-primary">
            <li>
              <a
                href={whatsappLink(whatsappTextFrom(values))}
                {...EXTERNAL_LINK}
                aria-describedby="whatsapp-aviso"
                className="wa-react inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
              >
                <WhatsappIcon className="h-4 w-4 text-whatsapp-strong" />
                Enviar pelo WhatsApp (com os dados preenchidos)
              </a>
            </li>
            <li>
              <a
                href={mailtoFrom(values)}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Enviar por e-mail ({EMAIL})
              </a>
            </li>
            <li>
              <a
                href={PHONE_HREF}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Ligar para {PHONE_LABEL}
              </a>
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {sending ? "Enviando…" : status === "error" ? "Tentar novamente" : "Enviar mensagem"}
        </button>

        <button
          type="button"
          onClick={openWhatsapp}
          aria-describedby="whatsapp-aviso"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/60 px-5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-secondary"
        >
          <WhatsappIcon className="h-4 w-4 text-whatsapp" />
          Enviar pelo WhatsApp
        </button>
      </div>

      <p id="whatsapp-aviso" className="text-xs leading-relaxed text-muted-foreground">
        “Enviar pelo WhatsApp” abre a conversa com o escritório já com o que você preencheu. A
        mensagem só é enviada quando você confirmar no aplicativo.
      </p>

      <p role="status" className="sr-only">
        {sending ? "Enviando sua mensagem…" : ""}
      </p>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
        Envio por conexão criptografada (HTTPS). Seus dados são tratados apenas para retorno do
        contato, sob sigilo profissional e conforme a LGPD (Lei nº 13.709/2018).
      </p>
    </form>
  );
}

function fieldA11y(name: string, error: string | undefined, extra = "") {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-erro` : undefined,
    className: `${fieldBase} ${error ? "border-destructive" : "border-border"} ${extra}`,
  };
}

type FieldProps = {
  name: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
};

function Field({ name, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <div className="relative">
        {children}
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
      </div>
      {hint && (
        <p aria-hidden="true" className="mt-1 text-right text-[0.7rem] text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-erro`} className="mt-1.5 flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
