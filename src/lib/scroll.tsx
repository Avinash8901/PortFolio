"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./hooks";

type ScrollContextValue = { lenis: Lenis | null };
const ScrollContext = createContext<ScrollContextValue>({ lenis: null });

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null);
      return;
    }
    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      autoRaf: false,
    });
    setLenis(instance);
    let raf = 0;
    const tick = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  const value = useMemo(() => ({ lenis }), [lenis]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  return useContext(ScrollContext);
}

export function scrollToTarget(target: string | HTMLElement) {
  if (typeof window === "undefined") return;
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;
  const headerOffset = 84;
  const { lenis } = scrollContextCache;
  if (lenis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lenis.scrollTo(element, { offset: -headerOffset, duration: 1.1 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
}

// Kept in sync by the provider so anchor handlers can remain simple.
const scrollContextCache: { lenis: Lenis | null } = { lenis: null };
export function ScrollCacheSync() {
  const { lenis } = useScroll();
  useEffect(() => {
    scrollContextCache.lenis = lenis;
  }, [lenis]);
  return null;
}
