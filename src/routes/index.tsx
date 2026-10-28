import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import gsap from "gsap";
import { CountUp, paintCount } from "@/components/count-up";
import { FlipLabel } from "@/components/flip-label";

export const Route = createFileRoute("/")({ component: Home });

const STATS = {
  views: "324,941",
  subscribers: "3.51K",
  videos: "629",
  programs: "28",
};

function Home() {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const cards = Array.from(board.querySelectorAll<HTMLElement>("[data-card]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
      cards.forEach((card) => {
        const el = card.querySelector<HTMLElement>("[data-count]");
        if (el) paintCount(el, 0);
      });
      return;
    }

    gsap.set(cards, { autoAlpha: 0, y: 28 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    cards.forEach((card, index) => {
      const countDuration = index === 0 ? 1.35 : 0.95;
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.42 });
      tl.call(() => {
        const el = card.querySelector<HTMLElement>("[data-count]");
        if (el) paintCount(el, countDuration);
      });
      tl.to({}, { duration: countDuration });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <main className="screen-shell bg-bg">
      <div ref={boardRef} className="panel-card stat-board rounded-lg bg-surface">
        <p className="stat-kicker">
          <FlipLabel ar="قناة إذاعة البحرين" en="Radio Bahrain Channel" />
        </p>

        <div data-card className="hero-group">
          <div className="hero-stat stat-hero rounded-lg text-on-primary">
            <CountUp value={STATS.views} className="stat-hero-num" />
          </div>
          <div className="stat-hero-label">
            <FlipLabel ar="إجمالي المشاهدات" en="Total Views" />
          </div>
        </div>

        <div className="stat-tiles">
          <StatCard value={STATS.subscribers} ar="عدد المشتركين" en="Subscribers" />
          <StatCard value={STATS.videos} ar="عدد الفيديوهات" en="Videos" />
          <StatCard value={STATS.programs} ar="البرامج" en="Programs" />
        </div>
      </div>
    </main>
  );
}

function StatCard({ value, ar, en }: { value: string; ar: string; en: string }) {
  return (
    <article data-card className="tile-card rounded-md bg-surface">
      <CountUp value={value} className="tile-num" />
      <div className="tile-label">
        <FlipLabel ar={ar} en={en} />
      </div>
    </article>
  );
}
