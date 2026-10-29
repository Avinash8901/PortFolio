"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/hooks";

export default function About() {
  const hangerRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const education = EDUCATION[0];
  const currentRole = EXPERIENCE.find((item) => item.id === "tcs") ?? EXPERIENCE[0];

  useEffect(() => {
    const hanger = hangerRef.current;
    if (!hanger || reducedMotion) return;
    let angle = 0;
    let velocity = 0;
    let target = 0;
    let pointerActive = false;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      const bounds = hanger.getBoundingClientRect();
      const relative = (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
      target = Math.max(-1, Math.min(1, relative)) * 5.5;
      pointerActive = true;
    };
    const onPointerLeave = () => { pointerActive = false; };
    const animate = (time: number) => {
      const idle = pointerActive ? target : Math.sin(time * 0.0011) * 1.5;
      velocity += (idle - angle) * 0.055;
      velocity *= 0.88;
      angle += velocity;
      hanger.style.setProperty("--swing", `${angle.toFixed(2)}deg`);
      frame = requestAnimationFrame(animate);
    };
    hanger.addEventListener("pointermove", onPointerMove);
    hanger.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      hanger.removeEventListener("pointermove", onPointerMove);
      hanger.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reducedMotion]);

  function onCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlipped((value) => !value);
    }
  }

  return (
    <section id="about" className="about-section section-space" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading id="about-title" index="01" label="About me" before="A little " accent="about" after="." />
        <div className="about-grid">
          <div className="about-copy rv">
            <p className="about-greeting">Hi, I’m <span>{PROFILE.firstName}.</span></p>
            <p className="about-summary">{PROFILE.resumeSummary}</p>
            <p className="about-note">{PROFILE.shortLine}</p>
            <div className="about-links" aria-label="Résumé and profiles">
              <a className="pill-button pill-button--small pill-button--primary" href={PROFILE.resumePath} download>Résumé <span aria-hidden="true">↓</span></a>
              <a className="pill-button pill-button--small" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a className="pill-button pill-button--small" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="id-stage rv" ref={hangerRef}>
            <div className="lanyard-anchor" aria-hidden="true"><span /></div>
            <div className="lanyard-strap" aria-hidden="true">
              <span>{PROFILE.name.toUpperCase()} · {PROFILE.role.toUpperCase()} · {PROFILE.name.toUpperCase()} · {PROFILE.role.toUpperCase()} ·</span>
            </div>
            <div className="lanyard-clip" aria-hidden="true"><i /><i /></div>
            <div
              className={`id-card ${flipped ? "is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-label="Flip Avinash’s developer ID card"
              onClick={() => setFlipped((value) => !value)}
              onKeyDown={onCardKeyDown}
            >
              <div className="id-card-inner">
                <article className="id-face id-front" aria-label="Developer ID card front">
                  <div className="id-band"><span>DEVELOPER ID</span></div>
                  <div className="id-photo-frame">
                    <img src="/portrait/portrait-bust.webp" alt={`Portrait of ${PROFILE.name} from the introduction video`} width="128" height="156" />
                  </div>
                  <div className="id-person">
                    <h3>{PROFILE.name}</h3>
                    <p>{PROFILE.role}</p>
                  </div>
                  <div className="id-info-rows">
                    <div><span>Degree</span><strong>Information Technology</strong></div>
                    <div><span>Institute</span><strong>VNR Vignana Jyothi Institute of Engineering and Technology</strong></div>
                    <div><span>Graduated</span><strong>May 2023</strong></div>
                  </div>
                  <div className="id-bottom-row"><span className="id-barcode" aria-hidden="true" /><span className="id-holo" aria-hidden="true">AB</span></div>
                  <span className="id-card-hint">Tap or hover to flip</span>
                </article>
                <article className="id-face id-back" aria-label="Developer ID card back">
                  <div className="id-back-mark">{PROFILE.initials}</div>
                  <p className="mono-label">What I am</p>
                  <ul>
                    <li>Backend software engineer</li>
                    <li>B.Tech in Information Technology</li>
                    <li>3+ years developing enterprise platforms</li>
                    <li>Padmaja Palm · resort event & media platform</li>
                    <li>Winner · Blind Code 2020</li>
                  </ul>
                  <div className="id-signature"><span>{PROFILE.name}</span><small>If found, say hello · {PROFILE.email}</small></div>
                </article>
              </div>
            </div>
          </div>

          <aside className="about-facts rv" aria-label="Quick facts">
            <p className="mono-label">Quick facts</p>
            <dl>
              <div><dt>Location</dt><dd>{PROFILE.location}</dd></div>
              <div><dt>Education</dt><dd>{education.title}</dd></div>
              <div><dt>Current role</dt><dd>{currentRole.title}<br /><span>{currentRole.place}</span></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></dd></div>
            </dl>
            <blockquote className="about-quote">
              <span className="quote-mark" aria-hidden="true">“</span>
              <p>The résumé describes platform improvements that cut modelling effort and application-generation time by about half.</p>
              <cite>From the professional summary</cite>
            </blockquote>
          </aside>
        </div>
      </div>
      <style jsx>{`
        .id-card-inner { transition: transform 800ms cubic-bezier(.16, 1, .3, 1); }
        .id-card:hover .id-card-inner, .id-card.is-flipped .id-card-inner { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) { .id-card-inner { transition: none; } }
      `}</style>
    </section>
  );
}
