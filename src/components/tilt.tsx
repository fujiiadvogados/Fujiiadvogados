import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

/** Somente mouse/trackpad com hover e sem preferência por movimento reduzido. */
const CAN_TILT = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type TiltProps = {
  /** Inclinação máxima em graus (bloco principal: maior; cabeçalho/rodapé: menor). */
  maxDeg: number;
  className?: string;
  children: ReactNode;
};

/**
 * Inclinação 3D sutil que acompanha o ponteiro e volta suavemente a 0°.
 * O elemento externo recebe os eventos; apenas o interno é transformado.
 */
export function Tilt({ maxDeg, className = "", children }: TiltProps) {
  const enabled = useMediaQuery(CAN_TILT);
  const innerRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0,5 … 0,5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.setProperty("--tilt-x", `${(-y * 2 * maxDeg).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * 2 * maxDeg).toFixed(2)}deg`);
      el.dataset["tilt"] = "active";
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    const el = innerRef.current;
    if (!el || !el.dataset["tilt"]) return;
    el.dataset["tilt"] = "returning";
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  // Após o retorno, remove o transform (imagem volta a ser desenhada sem 3D, com nitidez total)
  const onTransitionEnd = () => {
    const el = innerRef.current;
    if (el?.dataset["tilt"] !== "returning") return;
    el.style.transition = "none"; // 0° → sem transform: visualmente idêntico, sem nova transição
    delete el.dataset["tilt"];
    void el.offsetWidth; // aplica o estado sem transição antes de restaurá-la
    requestAnimationFrame(() => {
      el.style.transition = "";
    });
  };

  return (
    <span
      className={`block ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span ref={innerRef} className="tilt-inner" onTransitionEnd={onTransitionEnd}>
        {children}
      </span>
    </span>
  );
}
