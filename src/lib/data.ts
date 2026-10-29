export const PROFILE = {
  name: "Avinash Batchu",
  initials: "AB",
  firstName: "Avinash",
  role: "Backend Software Engineer",
  email: "avinashbatchu10@gmail.com",
  phone: "9390333167",
  phoneHref: "tel:9390333167",
  location: "Hyderabad, India",
  github: "https://github.com/Avinash8901",
  linkedin: "https://www.linkedin.com/in/avinash-batchu-3792701a7/",
  resumePath: "/resume.pdf",
  resumeSummary:
    "Backend Software Engineer with 3+ years of experience developing enterprise platforms and backend services using Java, Spring Boot, Python, SQL, and REST APIs. Experienced in metadata-driven code generation, API versioning, reusable Maven runtime libraries, database-backed idempotency, and production troubleshooting. Independently developed a modular Python/FastAPI backend integrating Neo4j graph operations and TCS MasterCraft MCCI agent workflows, with structured event processing and Server-Sent Events (SSE). Delivered platform improvements that reduced API-modelling effort and application-generation time by approximately 50% each.",
  shortLine:
    "Delivered platform improvements that reduced API-modelling effort and application-generation time by approximately 50% each.",
} as const;

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
] as const;

export type Skill = {
  name: string;
  symbol: string;
  logo?: string;
  projects: string[];
};

export const SKILL_GROUPS: { family: string; skills: Skill[] }[] = [
  {
    family: "Languages",
    skills: [
      { name: "Java", symbol: "Ja", logo: "java", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Python", symbol: "Py", logo: "python", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "SQL", symbol: "Sq", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Cypher", symbol: "Cy", logo: "neo4j", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
  {
    family: "Backend & Frameworks",
    skills: [
      { name: "Spring Boot", symbol: "Sp", logo: "spring", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "FastAPI", symbol: "Fa", logo: "fastapi", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Django", symbol: "Dj", logo: "django", projects: ["Padmaja Palm"] },
      { name: "REST APIs", symbol: "Rs", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Server-Sent Events (SSE)", symbol: "Ss", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
  {
    family: "Databases",
    skills: [
      { name: "PostgreSQL", symbol: "Pg", logo: "postgresql", projects: ["TCS MasterCraft TransformPlus", "Padmaja Palm"] },
      { name: "Oracle", symbol: "Or", logo: "oracle", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Neo4j", symbol: "N4", logo: "neo4j", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
  {
    family: "Platform Engineering",
    skills: [
      { name: "Metadata-Driven Development", symbol: "Md", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Code Generation", symbol: "Cg", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "API Versioning", symbol: "Av", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Microservices", symbol: "Mi", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Maven-based runtime libraries", symbol: "Mr", logo: "maven", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Idempotency", symbol: "Id", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
  {
    family: "Engineering Fundamentals",
    skills: [
      { name: "Object-Oriented Programming", symbol: "Oo", projects: [] },
      { name: "Design Patterns", symbol: "Dp", projects: [] },
      { name: "System Design", symbol: "Sd", projects: [] },
      { name: "Data Structures and Algorithms", symbol: "Ds", projects: ["Smart Interviews"] },
      { name: "Debugging", symbol: "De", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Production Troubleshooting", symbol: "Pt", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "Git", symbol: "Gt", logo: "git", projects: [] },
      { name: "Maven", symbol: "Mv", logo: "maven", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Eclipse RCP", symbol: "Er", logo: "eclipse", projects: ["TCS MasterCraft TransformPlus"] },
      { name: "Swagger/OpenAPI", symbol: "Sw", logo: "swagger", projects: ["TCS MasterCraft TransformPlus"] },
    ],
  },
];

export const EXPERIENCE = [
   {
    id: "acm",
    date: "2021 — 2022",
    title: "Treasurer",
    place: "ACM VNRVJIET",
    detail:
      "Managed operations for a 450+ member student chapter and organized 15+ technical events, including workshops and a national-level coding competition.",
    groups: [],
  },
  {
    id: "ta",
    date: "2021 — 2022",
    title: "Teaching Assistant (DSA)",
    place: "SMART INTERVIEWS",
    detail:
      "Mentored 100+ students in Data Structures and Algorithms, explaining core concepts and guiding students through coding exercises and algorithmic questions.",
    groups: [],
  },
  {
    id: "tcs",
    date: "06/2023 — Present",
    title: "Backend Engineer",
    place: "Tata Consultancy Services (TCS)",
    detail:
      "TCS MasterCraft TransformPlus Forward Engineering Edition (FEE), an enterprise platform for metadata-driven code generation and Java Spring Boot application development.",
    groups: [
      {
        title: "V9 · AI-Integrated Backend (Under Development)",
        tech: "Python, FastAPI, Neo4j, PostgreSQL, OMgen KDM, Cypher, Server-Sent Events (SSE)",
        bullets: [
          "Independently developed a modular Python/FastAPI backend for the next-generation low-code/no-code platform, providing a middleware layer connecting the UI, databases, and AI-related application capabilities.",
          "Integrated backend services with TCS MasterCraft MCCI's visual AI-agent platform through exposed APIs, invoking agents, parsing and processing structured streaming events, and delivering processed events to the frontend for real-time AI workflow updates.",
          "Organized backend functionality into modular router and service layers for graph operations, AI-agent invocation, and file management; implemented Server-Sent Events (SSE) streaming and structured logging across application, request/response, streaming, and database workflows, with time- and size-based log rotation.",
          "Engineered multi-database Neo4j access with transaction handling and batch Cypher operations using UNWIND to support graph-based workflows across segregated databases.",
          "Developed a metamodel conversion utility to transfer the V8 metamodel from PostgreSQL to Neo4j, enabling exploration of the existing application metamodel in V9.",
          "Leveraged Microsoft Copilot in Work mode to assist with V9 Python/FastAPI backend development, using engineering judgment to evaluate and refine AI-assisted implementation work.",
        ],
      },
      {
        title: "V8 · Enterprise LCNC Platform",
        tech: "Java, Spring Boot, OSC, Eclipse RCP, Kafka, Oracle, PostgreSQL",
        bullets: [
          "Architected and delivered a metadata-driven REST API versioning feature in collaboration with key stakeholders, deriving new API versions from existing metadata models while supporting model/schema changes and preserving backward compatibility; reduced API modelling effort.",
          "Enhanced Java/Spring Boot code-generation capabilities to automate REST APIs, persistence layers, Oracle/PostgreSQL DDL, Swagger/OpenAPI specifications, and configuration artifacts, reducing application-generation time by approximately 50%.",
          "Owned OSC scripting for Java code generation, developing and maintaining scripts compiled into JAR artifacts within the platform's code-generation workflow.",
          "Developed and enhanced reusable Maven-based runtime libraries for generated Java/Spring Boot microservices, including database-backed idempotency using UUID-based request identification, request metadata, and persisted request state/results to determine duplicate-request behaviour.",
          "Investigated root causes and resolved 150+ production issues across Java code generation, Oracle/PostgreSQL, Eclipse RCP, Kafka, and Swagger/OpenAPI.",
          "Supported 15+ backend applications by diagnosing application-specific code-generation failures, resolving platform defects, and troubleshooting issues caused by metadata changes.",
        ],
      },
    ],
  },
] as const;

export const EDUCATION = [
  {
    id: "btech",
    date: "08/2019 — 05/2023",
    title: "Bachelor of Technology in Information Technology",
    place: "VNR Vignana Jyothi Institute of Engineering and Technology",
    detail: "",
  },
] as const;

export const PROJECTS = [
  {
    id: "padmaja-palm",
    index: "01",
    title: "Padmaja Palm",
    kicker: "Resort Event & Media Management Platform",
    description:
      "Developed a full-stack resort event and media management platform using Django, React, and PostgreSQL (Supabase), with role-based administration and cloud deployment.",
    features: [
      "Staff-scoped media authorization and Cloudinary-signed download URLs with a five-minute expiry to restrict access to protected media.",
      "Storage analytics service integrating Cloudinary APIs to aggregate per-event and account-wide media usage through paginated resource retrieval and quota reporting.",
      "Media lifecycle management with image/video limits, file-size validation, and minimum-image constraints.",
      "Cascading cleanup across PostgreSQL and Cloudinary to prevent orphaned resources.",
    ],
    tech: ["Django", "React", "PostgreSQL (Supabase)", "Cloudinary", "Render", "Netlify"],
    github: null,
  },
] as const;

export const CERTIFICATIONS = [
  {
    title: "HackerRank certified in Algorithms, Python, SQL, and Java.",
    issuer: "HackerRank",
    link: null,
  },
] as const;

export const ACHIEVEMENTS = [
  {
    id: "hackerrank",
    platform: "HackerRank",
    index: "01",
    label: "Certified in",
    caption: "Algorithms · Python · SQL · Java",
    value: "4",
    valueLabel: "topics",
    logo: "hackerrank",
  },
  {
    id: "blind-code",
    platform: "JNTUH",
    index: "02",
    label: "Winner",
    caption: "Blind Code · national-level coding competition",
    value: "2020",
    valueLabel: "",
    logo: "jntuh",
  },
  {
    id: "acm",
    platform: "ACM VNRVJIET",
    index: "03",
    label: "Student chapter",
    caption: "Treasurer · organized 15+ technical events",
    value: "450+",
    valueLabel: "members",
    logo: "acm",
  },
  {
    id: "teaching",
    platform: "SMART INTERVIEWS",
    index: "04",
    label: "Teaching Assistant · DSA",
    caption: "Mentored students through concepts and coding exercises",
    value: "100+",
    valueLabel: "students",
    logo: "smart-interviews",
  },
] as const;
