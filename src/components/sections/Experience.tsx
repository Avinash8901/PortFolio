"use client";

import { useMemo, useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { useInView, useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  place: string;
  detail: string;
  kind: "education" | "experience";
  groups?: readonly { title: string; tech: string; bullets: readonly string[] }[];
};

function dateKey(value: string) {
  const match = value.match(/(\d{2})\/(\d{4})/);
  if (match) return Number(match[2]) * 100 + Number(match[1]);
  const year = value.match(/\d{4}/)?.[0];
  return year ? Number(year) * 100 : Number.MAX_SAFE_INTEGER;
}

function TimelineStop({ item, index }: { item: TimelineItem; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.22 });
  return (
    <article ref={ref} className={`timeline-row ${inView ? "is-lit" : ""}`} style={{ "--i": index } as React.CSSProperties}>
      <div className="timeline-date mono-label">{item.date || <span className="sr-only">Date not listed</span>}</div>
      <span className="timeline-marker" aria-hidden="true"><i /></span>
      <div className="timeline-content">
        <p className="timeline-kind mono-label">{item.kind === "education" ? "Education" : "Experience"}</p>
        <div className="timeline-title-row"><h3>{item.title}</h3><span className="timeline-place">{item.place}</span></div>
        {item.detail ? <p className="timeline-detail">{item.detail}</p> : null}
        {item.groups?.length ? (
          <details className="timeline-details">
            <summary><span>V9 and V8 résumé details</span><span aria-hidden="true">＋</span></summary>
            <div className="timeline-groups">
              {item.groups.map((group) => (
                <section key={group.title} className="timeline-group">
                  <div className="timeline-group-heading"><h4>{group.title}</h4><p>{group.tech}</p></div>
                  <ul>{group.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </section>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </article>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const items = useMemo<TimelineItem[]>(() => [
    ...EDUCATION.map((item): TimelineItem => ({ ...item, kind: "education" })),
    ...EXPERIENCE.map((item): TimelineItem => ({ ...item, kind: "experience" } as TimelineItem)),
  ].sort((a, b) => dateKey(a.date) - dateKey(b.date)), []);

  return (
    <section id="experience" ref={sectionRef} className="experience-section section-space" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading id="experience-title" index="05" label="Experience" before="The path " accent="so far" after="." />
        <div className="timeline" style={{ "--timeline-progress": progress } as React.CSSProperties}>
          <span className="timeline-spine" aria-hidden="true" />
          {items.map((item, index) => <TimelineStop key={item.id} item={item} index={index} />)}
          <div className="timeline-next"><span className="timeline-marker timeline-marker-next" aria-hidden="true" /><p className="mono-label">Next</p><h3>Your team?</h3><button type="button" onClick={() => scrollToTarget("#contact")} aria-label="Go to contact section">↗</button></div>
        </div>
      </div>
      <style jsx>{`
        .timeline-spine { transform: scaleY(var(--timeline-progress, 0)); }
        .timeline-row.is-lit .timeline-marker i { transform: scale(1); }
        .timeline-row.is-lit .timeline-content { opacity: 1; transform: translateY(0); }
        .timeline-row .timeline-content { transition: opacity 700ms cubic-bezier(.16, 1, .3, 1), transform 700ms cubic-bezier(.16, 1, .3, 1); transition-delay: calc(var(--i, 0) * 60ms); }
        @media (prefers-reduced-motion: reduce) { .timeline-spine { transform: scaleY(1); } .timeline-row .timeline-content { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </section>
  );
}
