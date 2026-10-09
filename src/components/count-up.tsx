import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

type CountUpProps = {
  value: string;
  className?: string;
};

export type CountUpHandle = {
  play: (duration?: number) => number;
};

function parseStat(value: string) {
  const match = value.trim().match(/^([\d,.]+)([KMB])?$/i);
  if (!match) return { number: 0, decimals: 0, suffix: "", fallback: value };
  const numeric = match[1];
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  return {
    number: Number(numeric.replace(/,/g, "")),
    decimals,
    suffix: match[2] ?? "",
    fallback: value,
  };
}

function formatStat(n: number, decimals: number, suffix: string) {
  const body =
    decimals > 0
      ? n.toFixed(decimals)
      : Math.round(n).toLocaleString("en-US");
  return body + suffix;
}

export const CountUp = forwardRef<CountUpHandle, CountUpProps>(function CountUp(
  { value, className = "" },
  ref,
) {
  const elRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    play(duration = 1.2) {
      const el = elRef.current;
      const parsed = parseStat(value);
      if (!el) return 0;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !parsed.number) {
        el.textContent = parsed.fallback;
        return 0;
      }

      const state = { n: 0 };
      el.textContent = formatStat(0, parsed.decimals, parsed.suffix);
      gsap.to(state, {
        n: parsed.number,
        duration,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = formatStat(state.n, parsed.decimals, parsed.suffix);
        },
      });
      return duration;
    },
  }));

  return (
    <span ref={elRef} className={className}>
      0
    </span>
  );
});
