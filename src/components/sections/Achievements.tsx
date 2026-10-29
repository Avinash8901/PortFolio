"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, PROFILE } from "@/lib/data";
import TechLogo, { isBrand } from "@/components/ui/TechLogo";
import { useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

function CountValue({ value }: { value: string }) {
  const target = Number(value.replace(/[^\d]/g, ""));
  const suffix = value.includes("+") ? "+" : "";
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const didCount = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || didCount.current) return;
    didCount.current = true;
    if (reducedMotion) {
      setCount(target);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let frame = 0;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, target]);

  return <span ref={ref}>{count.toLocaleString("en-US")}{suffix}</span>;
}

function AchievementCard({ item, active }: { item: (typeof ACHIEVEMENTS)[number]; active: boolean }) {
  const brandKey = item.logo === "jntuh" ? "" : item.logo;
  return (
    <article className={`achievement-card ${active ? "is-active" : ""}`} aria-label={`${item.label}: ${item.caption}`}>
      <div className="achievement-card-top">
        <div className={`achievement-brand ${isBrand(brandKey) ? "has-logo" : ""}`}>
          {isBrand(brandKey) ? <TechLogo name={item.platform} brand={brandKey} size={42} decorative /> : <span>{item.platform.slice(0, 5)}</span>}
        </div>
        <span className="achievement-index mono-label">{item.index} / {String(ACHIEVEMENTS.length).padStart(2, "0")}</span>
      </div>
      <div className="achievement-card-bottom">
        <div className="achievement-copy"><p className="mono-label">{item.platform}</p><h3>{item.label}</h3><p>{item.caption}</p></div>
        <div className="achievement-value"><strong><CountValue value={item.value} /></strong>{item.valueLabel ? <span>{item.valueLabel}</span> : null}</div>
      </div>
    </article>
  );
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    let frame = 0;
    const measure = () => {
      const nextTravel = Math.max(0, track.scrollWidth - window.innerWidth);
      setTravel(nextTravel);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const next = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
        setProgress(next);
        const cards = Array.from(track.querySelectorAll<HTMLElement>(".achievement-card"));
        let nearest = 0;
        let distance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const bounds = card.getBoundingClientRect();
          const center = bounds.left + bounds.width / 2;
          const nextDistance = Math.abs(center - window.innerWidth / 2);
          if (nextDistance < distance) { nearest = index; distance = nextDistance; }
        });
        setActiveIndex(nearest);
      });
    };
    measure();
    update();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, [travel]);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="achievements-section"
      style={{ height: `calc(100svh + ${travel}px)` }}
      aria-label="Achievements gallery"
    >
      <div className="achievement-pin">
        <div className="achievement-header container">
          <div><p className="section-tag">06 — Achievements</p><h2 className="achievement-heading">A few <em>milestones.</em></h2></div>
          <div className="achievement-progress-wrap"><span className="mono-label">Scroll through</span><span className="achievement-progress"><i style={{ transform: `scaleX(${progress})` }} /></span></div>
        </div>
        <div className="achievement-viewport">
          <div ref={trackRef} className="achievement-track" style={{ transform: `translate3d(${-progress * travel}px, 0, 0)` }}>
            {ACHIEVEMENTS.map((item, index) => <AchievementCard key={item.id} item={item} active={activeIndex === index} />)}
            <div className="achievement-end"><span className="mono-label">A work in progress</span><p>and counting <span aria-hidden="true">→</span></p><a href="#contact" onClick={(event) => { event.preventDefault(); scrollToTarget("#contact"); }}>Say hello</a></div>
          </div>
        </div>
        <p className="sr-only">Scroll vertically to move through the achievements gallery. Contact {PROFILE.name} at {PROFILE.email}.</p>
      </div>
      <style jsx>{`
        .achievement-card { transition: transform 500ms cubic-bezier(.16, 1, .3, 1), box-shadow 500ms cubic-bezier(.16, 1, .3, 1); }
        .achievement-card.is-active { transform: translateY(-12px); }
        @media (prefers-reduced-motion: reduce) { .achievement-card.is-active { transform: none; } }
      `}</style>
    </section>
  );
}
