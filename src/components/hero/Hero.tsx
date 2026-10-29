"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundState = useRef(false);
  const userActivatedAudio = useRef(false);
  const [soundOn, setSoundOn] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    let disposed = false;
    const setSound = (on: boolean) => {
      soundState.current = on;
      setSoundOn(on);
    };
    const startMuted = async () => {
      if (userActivatedAudio.current) return;
      video.muted = true;
      try {
        await video.play();
      } catch {
        if (!disposed) setAutoplayBlocked(true);
      }
    };
    const tryUnmuted = async () => {
      if (disposed || !video.isConnected) return;
      video.muted = false;
      try {
        await video.play();
        if (disposed) return;
        setSound(true);
        setAutoplayBlocked(false);
        userActivatedAudio.current = true;
      } catch {
        if (disposed) return;
        video.muted = true;
        setSound(false);
        setAutoplayBlocked(true);
        void startMuted();
      }
    };

    const attemptAudio = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".sound-toggle")) return;
      if (userActivatedAudio.current) return;
      userActivatedAudio.current = true;
      void tryUnmuted();
    };

    video.muted = false;
    video.play().then(() => {
      if (!disposed && !userActivatedAudio.current) {
        setSound(true);
        setAutoplayBlocked(false);
      }
    }).catch(() => {
      if (!disposed && !userActivatedAudio.current) {
        setSound(false);
        setAutoplayBlocked(true);
        void startMuted();
      }
    });

    window.addEventListener("pointerdown", attemptAudio, { passive: true });
    window.addEventListener("touchend", attemptAudio, { passive: true });
    window.addEventListener("keydown", attemptAudio);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.35) {
          video.pause();
          return;
        }
        video.muted = !soundState.current;
        video.play().catch(() => {
          if (!soundState.current) setAutoplayBlocked(true);
        });
      },
      { threshold: [0, 0.35, 1] },
    );
    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("pointerdown", attemptAudio);
      window.removeEventListener("touchend", attemptAudio);
      window.removeEventListener("keydown", attemptAudio);
      video.pause();
    };
  }, []);

  async function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.muted) {
      userActivatedAudio.current = true;
      video.muted = true;
      soundState.current = false;
      setSoundOn(false);
      return;
    }
    userActivatedAudio.current = true;
    video.muted = false;
    try {
      await video.play();
      soundState.current = true;
      setSoundOn(true);
      setAutoplayBlocked(false);
    } catch {
      video.muted = true;
      soundState.current = false;
      setSoundOn(false);
      setAutoplayBlocked(true);
    }
  }

  return (
    <section ref={sectionRef} className="hero-section" aria-labelledby="hero-title">
      <div className="hero-ghost" aria-hidden="true">{PROFILE.firstName.toUpperCase()}</div>
      <div className="hero-copy container">
        <p className="hero-kicker rv"><span className="hero-kicker-dot" />Portfolio <span className="hero-kicker-separator">/</span> {PROFILE.location}</p>
        <h1 id="hero-title" className="hero-title rv-mask"><span>{PROFILE.role}<em>.</em></span></h1>
        <p className="hero-summary rv">{PROFILE.resumeSummary.split(". ")[0]}</p>
        <div className="hero-actions rv">
          <a href="#work" className="pill-button pill-button--primary" onClick={(event) => { event.preventDefault(); scrollToTarget("#work"); }}>
            Explore work <span aria-hidden="true">↘</span>
          </a>
          <a href="#contact" className="pill-button" onClick={(event) => { event.preventDefault(); scrollToTarget("#contact"); }}>Let’s talk</a>
          <a className="hero-resume" href={PROFILE.resumePath} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="hero-portrait-wrap" aria-label={`Video introduction of ${PROFILE.name}`}>
        <video
          ref={videoRef}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/portrait/portrait-bust.webp"
          aria-label={`${PROFILE.name} speaking to camera`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-bottom container rv">
        <div className="hero-bottom-meta"><span className="mono-label">01 / 07</span><span className="hero-bottom-rule" /><span>{PROFILE.role}</span></div>
        <button
          className={`sound-toggle ${autoplayBlocked && !soundOn ? "is-pinging" : ""}`}
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={soundOn}
        >
          <span aria-hidden="true">{soundOn ? "❚❚" : "▶"}</span>
          <span className="sr-only">{soundOn ? "Sound is on" : "Sound is off"}</span>
        </button>
      </div>
      <style jsx>{`
        .hero-video { animation: heroArrive 1.2s cubic-bezier(.16, 1, .3, 1) both; }
        @keyframes heroArrive { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hero-video { animation: none; } }
      `}</style>
    </section>
  );
}
