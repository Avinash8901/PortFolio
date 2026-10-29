"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function HoppingHeading() {
  const words = ["Let’s", "build", "something", "together."];
  const renderWord = (word: string, wordIndex: number) => (
    <span className="contact-word" key={word} aria-hidden="true">
      {Array.from(word).map((letter, index) => <span key={`${wordIndex}-${index}`} onMouseEnter={(event) => { event.currentTarget.classList.remove("is-hopping"); void event.currentTarget.offsetWidth; event.currentTarget.classList.add("is-hopping"); }} onAnimationEnd={(event) => event.currentTarget.classList.remove("is-hopping")}>{letter}</span>)}
    </span>
  );
  return (
    <h2 id="contact-title" className="contact-title" aria-label="Let’s build something together.">
      <span className="contact-line">{words.slice(0, 2).map((word, index) => renderWord(word, index))}</span>
      <span className="contact-line">{words.slice(2).map((word, index) => renderWord(word, index + 2))}</span>
    </h2>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = PROFILE.email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      textarea.remove();
      setCopied(success);
      setCopyError(!success);
    }
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      <section id="contact" className="contact-section section-space" aria-labelledby="contact-title">
        <div className="container contact-container">
          <p className="section-tag rv">07 — Contact</p>
          <HoppingHeading />
          <div className="contact-main rv">
            <div className="contact-email-wrap">
              <a className="contact-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button className="copy-email" type="button" onClick={copyEmail} aria-label="Copy email address">{copied ? "Copied ✓" : "Copy"}</button>
              <span className="sr-only" aria-live="polite">{copied ? "Email address copied." : copyError ? "Could not copy email address." : ""}</span>
            </div>
            <div className="contact-details">
              <a href={PROFILE.phoneHref}>{PROFILE.phone}<span aria-hidden="true">↗</span></a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub<span aria-hidden="true">↗</span></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn<span aria-hidden="true">↗</span></a>
            </div>
            <div className="hello-badge" aria-hidden="true"><svg viewBox="0 0 140 140"><defs><path id="hello-circle" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" /></defs><text><textPath href="#hello-circle">SAY HELLO · SAY HELLO · SAY HELLO · </textPath></text></svg><span>↗</span></div>
          </div>
        </div>
        <style jsx>{`
          .contact-word > span { display: inline-block; }
          .contact-word > span.is-hopping { animation: letterHop 520ms cubic-bezier(.16, 1, .3, 1); }
          @keyframes letterHop { 0%, 100% { transform: translateY(0); } 38% { transform: translateY(-.16em); } }
          @media (prefers-reduced-motion: reduce) { .contact-word > span.is-hopping { animation: none; } }
        `}</style>
      </section>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <a href="#top" onClick={(event) => { event.preventDefault(); scrollToTarget("#top"); }}>Back to top <span aria-hidden="true">↑</span></a>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}
