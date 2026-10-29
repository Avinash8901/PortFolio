"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);
  const indicatorStyle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setScrolled(window.scrollY > 40);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const activeIndex = NAV.findIndex((item) => item.href === `#${active}`);
    const target = linkRefs.current[activeIndex];
    const indicator = indicatorStyle.current;
    if (!nav || !target || !indicator) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = target.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  }, [active, scrolled]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => firstMobileLink.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".mobile-menu a"));
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function visit(href: string) {
    setMenuOpen(false);
    scrollToTarget(href);
  }

  return (
    <>
      <div className="top-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a className="nav-brand" href="#top" onClick={(event) => { event.preventDefault(); scrollToTarget("#top"); }} aria-label={`${PROFILE.name}, back to top`}>
          <span className="nav-mark">{PROFILE.initials}</span>
          <span className={`nav-name ${scrolled ? "is-hidden" : ""}`}>{PROFILE.name}</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation" ref={navRef}>
          <span className="nav-indicator" ref={indicatorStyle} aria-hidden="true" />
          {NAV.map((item, index) => (
            <a
              key={item.href}
              ref={(node) => { linkRefs.current[index] = node; }}
              className={`nav-link ${active === item.href.slice(1) ? "is-active" : ""}`}
              href={item.href}
              onClick={(event) => { event.preventDefault(); visit(item.href); }}
              aria-current={active === item.href.slice(1) ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menu-glyph" aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
        </button>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <p className="section-tag">Navigation</p>
          <nav aria-label="Mobile navigation">
            {NAV.map((item, index) => (
              <a
                key={item.href}
                ref={index === 0 ? firstMobileLink : undefined}
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => { event.preventDefault(); visit(item.href); }}
              >
                <span className="mono-label">0{index + 1}</span>
                <span>{item.label}</span>
                <span className="mobile-menu-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <p className="mobile-menu-footer">{PROFILE.location} · {PROFILE.email}</p>
        </div>
      </div>
    </>
  );
}
