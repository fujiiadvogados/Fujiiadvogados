import { EXTERNAL_LINK, SOCIAL, SOCIAL_HANDLES } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/brand-icons";

const CHANNELS = [
  {
    key: "facebook",
    href: SOCIAL.facebook,
    label: "Facebook",
    detail: SOCIAL_HANDLES.facebook,
    Icon: FacebookIcon,
  },
  {
    key: "instagram",
    href: SOCIAL.instagram,
    label: "Instagram",
    detail: SOCIAL_HANDLES.instagram,
    Icon: InstagramIcon,
  },
  {
    key: "tiktok",
    href: SOCIAL.tiktok,
    label: "TikTok",
    detail: SOCIAL_HANDLES.tiktok,
    Icon: TiktokIcon,
  },
] as const;

type SocialLinksProps = {
  /** "list": ícone + rótulo (rodapé). "icons": apenas ícones (seção de contato). */
  variant?: "list" | "icons";
  className?: string;
};

export function SocialLinks({ variant = "list", className = "" }: SocialLinksProps) {
  if (variant === "icons") {
    return (
      <ul className={`flex flex-wrap gap-3 ${className}`}>
        {CHANNELS.map(({ key, href, label, detail, Icon }) => (
          <li key={key}>
            <a
              href={href}
              {...EXTERNAL_LINK}
              aria-label={`${label} — ${detail} (abre em nova aba)`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-gold hover:text-gold-ink"
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`space-y-1 text-sm ${className}`}>
      {CHANNELS.map(({ key, href, label, detail, Icon }) => (
        <li key={key}>
          <a
            href={href}
            {...EXTERNAL_LINK}
            className="inline-flex min-h-11 items-center gap-2.5 transition-colors hover:text-gold"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>
              {label} <span className="opacity-70">· {detail}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
