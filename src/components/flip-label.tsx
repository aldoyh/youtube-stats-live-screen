import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

type FlipLabelProps = {
  ar: string;
  en: string;
  className?: string;
  intervalMs?: number;
};

function wordsOf(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">");
}

export function FlipLabel({
  ar,
  en,
  className = "",
  intervalMs = 10000,
}: FlipLabelProps) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let showingAr = true;
    let timer: number | undefined;
    let tween: gsap.core.Timeline | null = null;

    const mount = (text: string, dir: "rtl" | "ltr") => {
      el.setAttribute("dir", dir);
      el.setAttribute("lang", dir === "rtl" ? "ar" : "en");
      el.innerHTML = wordsOf(text)
        .map((w) => `<span class="word">${escapeHtml(w)}</span>`)
        .join(" ");
    };

    mount(ar, "rtl");

    const flip = () => {
      const nextAr = !showingAr;
      const nextText = nextAr ? ar : en;
      const nextDir = nextAr ? "rtl" : "ltr";
      const nextWords = wordsOf(nextText);

      if (reduce) {
        showingAr = nextAr;
        mount(nextText, nextDir);
        return;
      }

      tween?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          showingAr = nextAr;
          const leftover = Array.from(el.querySelectorAll<HTMLElement>(".word"));
          leftover.forEach((span, i) => {
            if (!nextWords[i]) span.remove();
          });
        },
      });
      tween = tl;

      while (el.querySelectorAll(".word").length < nextWords.length) {
        const span = document.createElement("span");
        span.className = "word";
        span.innerHTML = "&nbsp;";
        span.style.opacity = "0";
        el.appendChild(span);
      }

      el.setAttribute("dir", nextDir);
      el.setAttribute("lang", nextAr ? "ar" : "en");

      const spans = Array.from(el.querySelectorAll<HTMLElement>(".word"));
      spans.forEach((span, i) => {
        const target = nextWords[i] ?? "";
        const at = i * 0.09;
        tl.to(
          span,
          { rotateX: 88, opacity: 0, duration: 0.24, ease: "power2.in" },
          at,
        );
        tl.to(
          span,
          {
            duration: 0.32,
            text: { value: target || "\u00a0", delimiter: "" },
            ease: "none",
          },
          at + 0.24,
        );
        tl.fromTo(
          span,
          { rotateX: -88 },
          {
            rotateX: 0,
            opacity: target ? 1 : 0,
            duration: 0.34,
            ease: "power2.out",
          },
          at + 0.24,
        );
      });
    };

    timer = window.setInterval(flip, intervalMs);

    return () => {
      if (timer) window.clearInterval(timer);
      tween?.kill();
    };
  }, [ar, en, intervalMs]);

  return (
    <span className={`flip-label-wrap ${className}`.trim()}>
      <span className="flip-label-sizer" aria-hidden="true">
        <span>{ar}</span>
        <span>{en}</span>
      </span>
      <span
        ref={elRef}
        className="flip-label"
        aria-live="polite"
        aria-label={`${ar} / ${en}`}
      >
        {ar}
      </span>
    </span>
  );
}
