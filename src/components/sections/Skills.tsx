"use client";

import { useState } from "react";
import { SKILL_GROUPS, type Skill } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";

const FAMILY_ACCENTS = ["#397566", "#496b9a", "#9a6b32", "#755990", "#a15745", "#4b7389"] as const;
type ElementSkill = Skill & { family: string; familyIndex: number; number: string };

const elementGroups = SKILL_GROUPS.map((group, familyIndex) => {
  const previousSkillCount = SKILL_GROUPS.slice(0, familyIndex).reduce((sum, previous) => sum + previous.skills.length, 0);
  return {
    ...group,
    familyIndex,
    skills: group.skills.map((skill, index): ElementSkill => ({
      ...skill,
      family: group.family,
      familyIndex,
      number: String(previousSkillCount + index + 1).padStart(2, "0"),
    })),
  };
});

const allSkills = elementGroups.flatMap((group) => group.skills);
const familyNames = ["All skills", ...SKILL_GROUPS.map((group) => group.family)];

export default function Skills() {
  const [family, setFamily] = useState("All skills");
  const [selected, setSelected] = useState<ElementSkill>(allSkills[0]);
  const visibleGroups = family === "All skills"
    ? elementGroups
    : elementGroups.filter((group) => group.family === family);

  function selectFamily(next: string) {
    setFamily(next);
    if (next !== "All skills") {
      const firstSkill = allSkills.find((skill) => skill.family === next);
      if (firstSkill) setSelected(firstSkill);
    }
  }

  return (
    <section id="skills" className="skills-section section-space" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title" index="02" label="Skills" before="The periodic table of my " accent="skills" after="." />
        <div className="skills-intro rv">
          <p>Choose a category to explore. Each element shows its number, short symbol, and full skill name.</p>
          <span className="mono-label">{allSkills.length} skills · {SKILL_GROUPS.length} groups</span>
        </div>
        <div className="skill-filters rv" role="group" aria-label="Filter skills by category">
          {familyNames.map((name, index) => (
            <button
              key={name}
              type="button"
              className={`skill-filter ${family === name ? "is-selected" : ""}`}
              data-family-index={index === 0 ? undefined : index - 1}
              style={index === 0 ? undefined : { "--skill-accent": FAMILY_ACCENTS[index - 1] } as React.CSSProperties}
              onClick={() => selectFamily(name)}
              aria-pressed={family === name}
            >
              {index > 0 ? <span className="skill-filter-dot" aria-hidden="true" /> : null}
              {name}
            </button>
          ))}
        </div>
        <div className="skills-layout">
          <div className="skill-groups" key={family}>
            {visibleGroups.map((group) => (
              <section className="skill-group" key={group.family} aria-labelledby={`skill-group-${group.familyIndex}`}>
                <div className="skill-group-heading">
                  <h3 id={`skill-group-${group.familyIndex}`}>{group.family}</h3>
                  <span className="mono-label">{group.skills.length} elements</span>
                </div>
                <div className="skill-grid" role="group" aria-label={`${group.family} skills`}>
                  {group.skills.map((skill, index) => {
                    const isSelected = selected.name === skill.name;
                    return (
                      <button
                        type="button"
                        key={skill.name}
                        className={`skill-element ${isSelected ? "is-selected" : ""}`}
                        data-family-index={skill.familyIndex}
                        style={{ "--i": index, "--skill-accent": FAMILY_ACCENTS[skill.familyIndex] } as React.CSSProperties}
                        onFocus={() => setSelected(skill)}
                        onClick={() => setSelected(skill)}
                        aria-label={`${skill.family}: ${skill.name}`}
                        aria-pressed={isSelected}
                      >
                        <span className="element-number">{skill.number}</span>
                        <span className="element-symbol" aria-hidden="true">{skill.symbol}</span>
                        <span className="element-name">{skill.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <aside className="skill-inspector" aria-live="polite" aria-label="Selected skill details">
            <div className="inspector-top"><span className="mono-label">Selected skill</span><span className="inspector-index">{selected.number}</span></div>
            <div className="inspector-logo" key={selected.name}><TechLogo name={selected.name} brand={selected.logo} size={150} /></div>
            <p className="mono-label">{selected.family}</p>
            <h3>{selected.name}</h3>
            <div className="inspector-related">
              <span className="mono-label">Related résumé projects</span>
              {selected.projects.length ? (
                <ul>{selected.projects.map((project) => <li key={project}>{project}</li>)}</ul>
              ) : <p>This skill is listed in the résumé, with no project association specified.</p>}
            </div>
            <div className="inspector-rule" />
            <p className="inspector-foot">Select an element to see where the skill is used.</p>
          </aside>
        </div>
      </div>
      <style jsx>{`
        .inspector-logo :global(.tech-logo), .inspector-logo :global(.concept-logo) { animation: skillPop 480ms cubic-bezier(.16, 1, .3, 1) both; }
        @keyframes skillPop { from { opacity: .4; transform: scale(.8) rotate(-6deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
        @media (prefers-reduced-motion: reduce) { .inspector-logo :global(.tech-logo), .inspector-logo :global(.concept-logo) { animation: none; } }
      `}</style>
    </section>
  );
}
