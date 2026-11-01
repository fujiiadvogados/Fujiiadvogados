import logo from "@/assets/brand-logo.png";
import logoReverse from "@/assets/brand-logo-reverse.png";
import symbol from "@/assets/brand-symbol.png";

/*
 * Marca a partir da arte "Logo 1" (src/assets/Logo1.jpeg):
 * - logo: assinatura completa, fundo removido e margens vazias recortadas (1335×321);
 * - logo-reverse: mesma assinatura em dourado claro, para fundos azul-marinho;
 * - symbol: apenas o escudo "DF" (257×325).
 */
const SOURCES = {
  logo: { src: logo, width: 1335, height: 321 },
  "logo-reverse": { src: logoReverse, width: 1335, height: 321 },
  symbol: { src: symbol, width: 257, height: 325 },
} as const;

type BrandMarkProps = {
  variant?: keyof typeof SOURCES;
  /** Defina a altura OU a largura; a outra dimensão segue a proporção da imagem. */
  className?: string;
  /**
   * Vazio (padrão) quando o nome já é anunciado pelo link que envolve a marca;
   * informe o nome do escritório quando a imagem estiver sozinha.
   */
  alt?: string;
  priority?: boolean;
};

export function BrandMark({
  variant = "logo",
  className = "h-12 w-auto",
  alt = "",
  priority = false,
}: BrandMarkProps) {
  const { src, width, height } = SOURCES[variant];
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`block max-w-full shrink-0 object-contain ${className}`}
    />
  );
}
