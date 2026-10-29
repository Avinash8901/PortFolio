import type { CSSProperties } from "react";

export const BRAND: Record<string, string> = {
  java: "/logos/java.svg",
  python: "/logos/python.svg",
  spring: "/logos/spring.svg",
  "spring boot": "/logos/spring.svg",
  fastapi: "/logos/fastapi.svg",
  django: "/logos/django.svg",
  postgresql: "/logos/postgresql.svg",
  oracle: "/logos/oracle.svg",
  neo4j: "/logos/neo4j.svg",
  cypher: "/logos/neo4j.svg",
  maven: "/logos/maven.svg",
  "maven-based runtime libraries": "/logos/maven.svg",
  git: "/logos/git.svg",
  eclipse: "/logos/eclipse.svg",
  "eclipse rcp": "/logos/eclipse.svg",
  swagger: "/logos/swagger.svg",
  "swagger/openapi": "/logos/swagger.svg",
  react: "/logos/react.svg",
  supabase: "/logos/supabase.svg",
  cloudinary: "/logos/cloudinary.svg",
  render: "/logos/render.svg",
  netlify: "/logos/netlify.svg",
  hackerrank: "/logos/hackerrank.svg",
  acm: "/logos/acm.svg",
};

export function isBrand(name: string) {
  return Boolean(BRAND[name.trim().toLowerCase()]);
}

type Props = {
  name: string;
  brand?: string;
  size?: number;
  className?: string;
  decorative?: boolean;
};

export default function TechLogo({ name, brand, size = 28, className = "", decorative = false }: Props) {
  const source = BRAND[(brand || name).trim().toLowerCase()];
  const style = { width: size, height: size } satisfies CSSProperties;
  if (source) {
    return (
      <span className={`tech-logo ${className}`} style={style}>
        {/* Local SVGs are copied from Devicon/Simple Icons; they remain offline at runtime. */}
        <img src={source} alt={decorative ? "" : `${name} logo`} aria-hidden={decorative || undefined} />
      </span>
    );
  }

  return (
    <span className={`concept-logo ${className}`} style={style} aria-label={decorative ? undefined : `${name} concept icon`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="11.5" />
        <path d="M10 16h12M16 10v12M12 12l8 8M20 12l-8 8" />
        <circle cx="16" cy="16" r="2.2" />
      </svg>
    </span>
  );
}
