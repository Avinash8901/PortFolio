import { CERTIFICATIONS } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Certifications() {
  return (
    <section id="certifications" className="certifications-section section-space" aria-labelledby="certifications-title">
      <div className="container certifications-layout">
        <div className="certifications-heading">
          <SectionHeading id="certifications-title" index="04" label="Certifications" before="Always " accent="learning" after="." />
          <p className="cert-count"><span className="cert-count-number">{String(CERTIFICATIONS.length).padStart(2, "0")}</span><span>Résumé-backed certification statement</span></p>
        </div>
        <div className="cert-list" aria-label="Certifications">
          {CERTIFICATIONS.map((certification, index) => (
            <div className="cert-row" key={certification.title} tabIndex={0}>
              <span className="cert-row-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="cert-row-copy"><strong>{certification.title}</strong><small>{certification.issuer}</small></span>
              <span className="cert-row-arrow" aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .cert-row { position: relative; isolation: isolate; }
        .cert-row::before { position: absolute; z-index: -1; inset: 0; content: ""; background: #0d0d0d; transform: scaleX(0); transform-origin: left; transition: transform 520ms cubic-bezier(.16, 1, .3, 1); }
        .cert-row:hover::before, .cert-row:focus-visible::before { transform: scaleX(1); }
        .cert-row:hover, .cert-row:focus-visible { color: #fff; }
        @media (prefers-reduced-motion: reduce) { .cert-row::before { transition: none; } }
      `}</style>
    </section>
  );
}
