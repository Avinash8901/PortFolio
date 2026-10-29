"use client";

import { PROJECTS } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";

function projectBrand(tech: string) {
  if (tech.includes("Supabase")) return "postgresql";
  return tech;
}

function IllustrativeProjectUI() {
  return (
    <div className="project-art-shell">
      <div className="project-art-window">
        <div className="project-art-topbar"><span className="art-dots"><i /><i /><i /></span><span>Padmaja Palm</span><span className="art-top-icon">···</span></div>
        <div className="project-art-body">
          <div className="project-art-sidebar">
            <span className="art-brand-mark">P</span>
            <span className="art-nav-item is-current">Events</span>
            <span className="art-nav-item">Media</span>
            <span className="art-nav-item">Storage</span>
          </div>
          <div className="project-art-content">
            <div className="art-content-head"><div><span className="mono-label">EVENT MANAGEMENT</span><h4>Media library</h4></div><span className="art-add">＋ New event</span></div>
            <div className="art-toolbar"><span>All events</span><span>Search media&nbsp;⌕</span><span>Filter&nbsp;⌄</span></div>
            <div className="art-event-grid">
              <div className="art-event-card"><span className="art-event-photo photo-one" /><span className="art-event-lines"><i /><i /></span></div>
              <div className="art-event-card"><span className="art-event-photo photo-two" /><span className="art-event-lines"><i /><i /></span></div>
              <div className="art-event-card"><span className="art-event-photo photo-three" /><span className="art-event-lines"><i /><i /></span></div>
            </div>
            <div className="art-usage-card"><span className="mono-label">STORAGE ANALYTICS</span><div className="art-usage-title"><strong>Usage by event</strong><span>Quota reporting ↗</span></div><div className="art-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
          </div>
        </div>
      </div>
      <span className="project-art-caption"><span className="art-caption-dot" />Illustrative UI</span>
    </div>
  );
}

export default function Work() {
  const project = PROJECTS[0];
  return (
    <section id="work" className="work-section section-space" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading id="work-title" index="03" label="Selected work" before="Things I’ve " accent="built" after="." />
        <div className="work-count rv"><span className="mono-label">01 / {String(PROJECTS.length).padStart(2, "0")}</span><span className="work-count-line" /><span className="mono-label">Project listed in résumé</span></div>
        <article className="project-panel rv" aria-labelledby="project-title">
          <div className="project-copy">
            <div className="project-topline"><span className="project-index">{project.index}</span><span className="project-kicker">{project.kicker}</span></div>
            <h3 id="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <p className="mono-label project-feature-label">Implementation notes</p>
            <ul className="project-features">
              {project.features.map((feature, index) => <li key={feature} style={{ "--i": index } as React.CSSProperties}><span className="feature-check" aria-hidden="true">↗</span><span>{feature}</span></li>)}
            </ul>
            <div className="project-bottom">
              <div className="project-tech" aria-label="Technologies">
                {project.tech.map((tech) => <span className="tech-chip" key={tech}><TechLogo name={tech} brand={projectBrand(tech)} size={20} decorative />{tech}</span>)}
              </div>
              {project.github ? <a className="pill-button pill-button--primary" href={project.github} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true">↗</span></a> : null}
            </div>
          </div>
          <div className="project-visual"><IllustrativeProjectUI /></div>
        </article>
      </div>
      <style jsx>{`
        .project-art-window { animation: artReveal 900ms cubic-bezier(.16, 1, .3, 1) both; }
        @keyframes artReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @media (prefers-reduced-motion: reduce) { .project-art-window { animation: none; } }
      `}</style>
    </section>
  );
}
