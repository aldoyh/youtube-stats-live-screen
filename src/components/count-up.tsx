import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type CountUpProps = {
  value: string;
  className?: string;
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
    decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US");
  return body + suffix;
}

const tweens = new WeakMap<HTMLElement, gsap.core.Tween>();

export function paintCount(el: HTMLElement, duration = 1.2) {
  const parsed = parseStat(el.dataset.count ?? "");
  tweens.get(el)?.kill();

  if (!parsed.number) {
    el.textContent = parsed.fallback;
    return 0;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || duration <= 0) {
    el.textContent = formatStat(parsed.number, parsed.decimals, parsed.suffix);
    return 0;
  }

  const state = { n: 0 };
  el.textContent = formatStat(0, parsed.decimals, parsed.suffix);
  const tween = gsap.to(state, {
    n: parsed.number,
    duration,
    ease: "power3.out",
    onUpdate: () => {
      el.textContent = formatStat(state.n, parsed.decimals, parsed.suffix);
    },
    onComplete: () => {
      el.textContent = formatStat(parsed.number, parsed.decimals, parsed.suffix);
    },
  });
  tweens.set(el, tween);
  return duration;
}

export function CountUp({ value, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.textContent) return;
    el.textContent = "0";
  }, [value]);

  return <span ref={ref} className={className} data-count={value} />;
}
