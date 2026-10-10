import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, Globe, Zap, Brain, CreditCard, Sparkles, Layout, Cpu, ShieldCheck } from "lucide-react";
import ProjectModal, { ProjectDetails } from "./ProjectModal";
import { useTheme } from "../contexts/ThemeContext";
import {
  ParticleCard,
  GlobalSpotlight,
  DEFAULT_GLOW_COLOR,
  LIGHT_MODE_GLOW_COLOR,
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_SPOTLIGHT_RADIUS,
} from "./MagicBento";

// ── Mobile breakpoint ──
const MOBILE_BREAKPOINT = 768;

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const ProjectCard = ({
  project,
  inView,
  index,
  onClick,
  glowColor,
  isMobile,
}: {
  project: ProjectDetails;
  inView: boolean;
  index: number;
  onClick: () => void;
  glowColor: string;
  isMobile: boolean;
}) => {
  return (
    <motion.div
      key={project.title}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.05 + index * 0.08, duration: 0.5 }}
    >
      <ParticleCard
        className="card card--border-glow group cursor-pointer rounded-xl p-5 border border-solid transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg h-full flex flex-col"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
          color: "hsl(var(--card-foreground))",
          // @ts-expect-error CSS custom properties
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": "0",
          "--glow-radius": "200px",
        }}
        disableAnimations={isMobile}
        particleCount={DEFAULT_PARTICLE_COUNT}
        glowColor={glowColor}
        enableTilt={false}
        clickEffect={true}
        enableMagnetism={true}
      >
        <div onClick={onClick} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
              <project.icon className="text-primary" size={20} />
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {project.tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
            {project.description}
          </p>

          {/* Key Technical Highlights if available */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-3 space-y-1">
              {project.highlights.slice(0, 2).map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono group-hover:bg-primary/10 group-hover:text-primary/80 transition-colors"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Links — Only show valid buttons */}
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                title="View GitHub Repository"
              >
                <Github size={13} />
                <span>Code</span>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                title="View Live Demo"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}
            <span className="ml-auto text-[11px] text-muted-foreground/60 group-hover:text-primary transition-colors">
              Details →
            </span>
          </div>
        </div>
      </ParticleCard>
    </motion.div>
  );
};

const projects: ProjectDetails[] = [
  {
    title: "RepoTalk — AI Codebase Explorer & Chat (RAG)",
    tag: "RAG / Full-stack",
    category: "Full Stack",
    description: "An authenticated RAG platform enabling developers to connect any GitHub repository and perform natural-language codebase Q&A with language-aware chunking and citation-backed Gemini answers.",
    tech: ["React 19", "FastAPI", "Python", "LangChain", "MongoDB Atlas", "Gemini API", "Express.js", "Node.js", "Tailwind CSS"],
    highlights: [
      "Production RAG pipeline with LangChain & MongoDB Atlas Vector Search",
      "Language-aware code chunking (150-char overlap) & Gemini embeddings",
      "Decoupled 3-layer architecture: React 19 SPA, Express API, FastAPI AI service",
      "Source-file citation tracking with syntax-highlighted answers"
    ],
    icon: Brain,
    github: "https://github.com/Shreyawangikar",
    live: "https://repo-chat-production-bc53.up.railway.app/chat/anandlavhale/Repo-chat/main",
    problem: "Exploring and understanding unfamiliar codebases requires tedious manual inspection across complex file hierarchies. Generic LLMs lack private or branch-specific repository context and easily exceed context token limits or hallucinate nonexistent functions.",
    solution: "Engineered a robust retrieval-augmented generation (RAG) platform. The system clones GitHub repositories on demand, filters source files (.py, .js, .ts, .java, .cpp, .go, .md), chunks them with language-aware splitters, embeds chunks via Google Gemini, stores vectors in MongoDB Atlas Vector Search, and retrieves top-5 repository-scoped contexts to generate accurate responses with source-file citations.",
    features: [
      "Dynamic GitHub repository cloning and branch indexing using LangChain GitLoader",
      "Language-aware recursive chunking preserving functional boundaries across 7+ programming languages",
      "Vector similarity retrieval (k=5) with repository-scoped metadata filtering in MongoDB Atlas Vector Search",
      "Three-layer decoupled architecture separating web concerns (Express) from AI orchestration (FastAPI)",
      "Interactive chat interface with optimistic UI updates, Markdown rendering, and code syntax highlighting",
      "Automatic source-file attribution displaying referenced files for verifiable answers",
      "Automated TTL vector index expiration (48 hours) to prevent unbounded database growth",
      "Secure stateless authentication with HTTP-only JWT cookies and route protection"
    ],
    architecture: "React 19 Frontend (Vite) → Express.js Gateway (JWT Auth, Cookies & MongoDB Chat History) → FastAPI AI Service → LangChain GitLoader & Splitters → Google Gemini Embeddings → MongoDB Atlas Vector Search (Top-5 Retrieval) → Google Gemini Chat Model",
    achievements: [
      "Sub-second vector similarity retrieval over cloned codebases",
      "Zero-hallucination source attribution citing exact file paths",
      "Decoupled microservice architecture deployed with Docker & Railway"
    ],
    duration: "Full Stack & AI Project",
    role: "Full Stack & AI Engineer"
  },
  {
    title: "JanNivaran — Civic Issue Reporting & Resolution",
    tag: "Full-stack / AI",
    category: "Full Stack",
    description: "Full-stack crowdsourced civic issue platform with reverse-geocoded GPS reporting, Google Gemini AI priority triage, role-based workflows, and photo/audio evidence verification.",
    tech: ["React 19", "Node.js", "Express 5", "MongoDB", "Google Gemini", "Google Maps API", "Cloudinary", "Recharts", "Tailwind CSS"],
    highlights: [
      "AI grievance triage & priority classification with Gemini 1.5 Flash",
      "Geotagged complaint tracking & reverse geocoding via Google Maps",
      "3-tier role-based access control (Citizen, Dept Admin, Superadmin)",
      "Resolution proof upload with citizen rating & dispute reopen loop"
    ],
    icon: ShieldCheck,
    github: "https://github.com/Shreyawangikar",
    live: "https://civic-issue-reporting-topaz.vercel.app/",
    problem: "Municipalities struggle to manage and prioritize civic grievances efficiently, while citizens lack transparent geotagged tracking and accountability mechanisms to verify resolutions.",
    solution: "An end-to-end civic reporting platform featuring automated AI priority triage via Google Gemini 1.5 Flash, browser GPS capture with Google Maps reverse geocoding, multi-tier RBAC (Citizen, Department Admin, Superadmin), Cloudinary streaming for photos and voice notes, and administrative resolution proof verification.",
    features: [
      "Geotagged complaint submission with GPS auto-capture and reverse geocoding via Google Maps API",
      "AI-driven priority classification (Low/Medium/High) using Google Gemini 1.5 Flash with graceful fallback",
      "Multimedia evidence capture with mandatory photo and optional voice note streamed directly to Cloudinary",
      "Interactive map dashboard with priority-colored markers and department-filtered views",
      "3-tier role-based authorization: Citizen reporting, Department Admin resolution, Superadmin governance",
      "Resolution proof workflow requiring photographic evidence from department admins to mark issues resolved",
      "Citizen feedback and satisfaction rating (1-5 stars) with dispute reopen cycle for superadmin arbitration",
      "Superadmin analytics dashboard with departmental workload bar charts and priority pie charts via Recharts"
    ],
    architecture: "React 19 SPA (Vercel) → Express.js 5 REST API (Render) → MongoDB Atlas (GeoJSON 2dsphere) → Google Gemini 1.5 Flash (AI Prioritization) → Google Maps API (Geocoding & Markers) → Cloudinary (Media CDN)",
    achievements: [
      "Deployed full-stack platform live on Vercel & Render",
      "Automated grievance prioritization with Google Gemini AI",
      "3-tier role-based access control with complete proof verification pipeline"
    ],
    duration: "Full Stack Project",
    role: "Full Stack & AI Engineer"
  },
  {
    title: "Collaborative Design Platform",
    tag: "Next.js / Real-time",
    category: "Full Stack",
    description: "A real-time collaborative design platform inspired by modern visual design tools, enabling users to create, edit and collaborate on designs within a shared workspace.",
    tech: ["Next.js 14", "TypeScript", "Fabric.js", "Liveblocks", "Tailwind CSS"],
    highlights: [
      "Real-time multiplayer collaboration with Liveblocks",
      "Interactive canvas-based editing with Fabric.js",
      "Collaborative state synchronization across active users",
      "Responsive UI & shared workspace canvas"
    ],
    icon: Sparkles,
    github: "https://github.com/Shreyawangikar",
    problem: "Modern visual creators require frictionless real-time multiplayer collaboration directly in the browser without cumbersome file exports or desynchronized editing conflicts.",
    solution: "Built a high-performance canvas editing platform combining Fabric.js for 2D object manipulation and Liveblocks for low-latency CRDT-based state synchronization and live cursor presence.",
    features: [
      "Real-time collaboration with multiplayer presence",
      "Canvas-based editing (shapes, text, freehand drawing, images)",
      "Design elements management & layer organization",
      "Collaborative state synchronization",
      "Shared workspace for concurrent team workflows",
      "Responsive UI optimized for modern screens"
    ],
    architecture: "Next.js 14 App Router → Fabric.js Canvas Engine → Liveblocks WebSocket Real-Time Infrastructure → Tailwind CSS Component Layer",
    achievements: [
      "Featured production-grade collaboration architecture",
      "Sub-50ms collaborative state sync",
      "Modular canvas toolset"
    ],
    duration: "Full Stack Project",
    role: "Full Stack Engineer"
  },
  {
    title: "TaskForge — Multithreaded Job Scheduler",
    tag: "C++ / Systems",
    category: "Academic",
    description: "Multithreaded C++ job scheduling engine with worker thread pools, priority-based execution, dependency-aware DAG scheduling, and thread-safe task processing.",
    tech: ["C++", "STL", "CMake", "Multithreading", "Mutexes", "Condition Variables"],
    highlights: [
      "Thread pool with priority-based task dispatching",
      "DAG dependency resolution with cycle detection"
    ],
    icon: Cpu,
    github: "https://github.com/Shreyawangikar",
    problem: "Concurrent workloads with complex inter-task dependencies risk deadlocks, data races, and thread starvation without robust synchronization and lifecycle controls.",
    solution: "Engineered an object-oriented C++ job scheduler with thread pools, synchronization primitives (mutexes, condition variables), dependency resolution via DAG cycle detection, and pluggable scheduling strategies.",
    features: [
      "Worker thread pool architecture for concurrent execution",
      "Priority-based task queue with dynamic scheduling",
      "Dependency-aware execution graph with topological sorting",
      "Cycle detection algorithm preventing deadlock in task pipelines",
      "Thread-safe task queues with mutexes and condition variables",
      "Failure retries and pluggable scheduling strategy patterns using modern STL"
    ],
    architecture: "Worker Thread Pool ⇄ Priority Queue ⇄ Task Dispatcher ⇄ Directed Acyclic Graph (DAG) with Cycle Detection ⇄ Mutex/Condition Variable Synchronization",
    achievements: [
      "Thread-safe concurrent execution with zero race conditions",
      "Modular design with pluggable scheduling strategies",
      "CMake build automation"
    ],
    duration: "Systems Project",
    role: "Systems & Concurrency Engineer"
  },
  {
    title: "Career Tracking Platform",
    tag: "AI / Full-stack",
    category: "AI/ML",
    description: "AI-powered career recommendations with alumni tracking dashboards built during Mastercard Code for Change 2025.",
    tech: ["React", "Node.js", "MongoDB", "REST APIs", "Tailwind CSS"],
    highlights: [
      "Alumni career tracking dashboard",
      "AI-powered mentor and career matching"
    ],
    icon: Sparkles,
    github: "https://github.com/Shreyawangikar",
    problem: "Students struggle to find relevant career paths and lack connection to alumni who could mentor them.",
    solution: "An intelligent platform that uses AI to match students with career opportunities and connects them with relevant alumni mentors based on their skills and interests.",
    features: [
      "AI-powered career path recommendations",
      "Alumni tracking and connection system",
      "Real-time dashboard with analytics",
      "Personalized skill development roadmap",
      "Interactive career exploration tools",
      "Automated mentor matching algorithm"
    ],
    architecture: "React frontend → Express API → MongoDB → Intelligent recommendation services",
    achievements: ["Mastercard Code for Change 2.0 Finalist (2025)", "Rapid 36-hour sprint prototype"],
    duration: "Hackathon Project",
    role: "Full Stack Developer"
  },
  {
    title: "AR Image & Surface Tracking Experience",
    tag: "AR/VR",
    category: "AR/VR",
    description: "Interactive augmented reality application developed using Unity and Vuforia exploring Image Targets, Multi-Image Targets, and Ground Plane detection.",
    tech: ["Unity", "Vuforia", "C#", "ARCore"],
    highlights: [
      "Ground Plane plane-detection for 3D placement",
      "Image Target tracking & interactive overlays"
    ],
    icon: Globe,
    problem: "Understanding spatial computing, environmental surface detection, and target-based tracking principles in interactive immersive media.",
    solution: "Built AR experiences implementing surface anchoring, multi-target tracking, and interactive spatial asset manipulation.",
    features: [
      "Image Target tracking and dynamic 3D asset rendering",
      "Multi-Image target tracking with synchronized animations",
      "Ground Plane surface detection and spatial coordinate mapping"
    ],
    architecture: "Unity 3D Engine → Vuforia SDK / ARCore → Real-time camera feed computer vision",
    duration: "PICT IT × CDAC Pune Training Project",
    role: "AR Developer"
  },
  {
    title: "Self-Supervised Visual Representation Learning",
    tag: "AI / Computer Vision",
    category: "AI/ML",
    description: "Academic exploration of self-supervised visual representation methods (SimCLR and BYOL) for unsupervised feature extraction without manual annotations.",
    tech: ["Python", "Deep Learning", "Computer Vision", "SimCLR", "BYOL"],
    highlights: [
      "Contrastive representation learning with SimCLR",
      "Bootstrap Your Own Latent (BYOL) experimentation"
    ],
    icon: Brain,
    problem: "Supervised visual learning requires vast quantities of expensive labeled data, limiting scalability.",
    solution: "Explored self-supervised contrastive and predictive paradigms (SimCLR & BYOL) to evaluate feature representation quality on image datasets.",
    features: [
      "Data augmentation pipelines (random crops, color jitter, Gaussian blur)",
      "Contrastive loss evaluation & latent space clustering",
      "Representation transferability assessment"
    ],
    architecture: "Python → PyTorch / TensorFlow pipelines → ResNet backbones → Contrastive projection heads",
    duration: "Academic Research Project",
    role: "Machine Learning Researcher"
  },
  {
    title: "Subscription Management System",
    tag: "ERP / Full-stack",
    category: "Full Stack",
    description: "ERP platform for subscription businesses managing recurring billing, lifecycle workflows, invoicing, and financial rules. Finalist at Odoo x SNS Hackathon 2026.",
    tech: ["JavaScript", "Node.js", "Express", "React", "PostgreSQL", "Tailwind CSS"],
    highlights: [
      "Subscription lifecycle engine (Draft to Active)",
      "Automated recurring invoice generation"
    ],
    icon: CreditCard,
    github: "https://github.com/Shreyawangikar",
    problem: "Subscription businesses need a unified system to manage complex workflows: recurring billing, plan configuration, tax/discount rules, lifecycle transitions, invoicing, and financial reporting.",
    solution: "A modular ERP-style web application with MVC architecture that automates the complete subscription lifecycle, from quotation through activation to closure.",
    features: [
      "Subscription lifecycle engine (Draft → Quotation → Confirmed → Active → Closed)",
      "Auto-generated invoices based on billing intervals (Daily/Weekly/Monthly/Yearly)",
      "Role-based access control (Admin, Internal User, Portal User)",
      "Dynamic tax & discount rule engine with usage limits & thresholds"
    ],
    architecture: "Backend: Express controllers & routes with PostgreSQL database. Frontend: React components with Tailwind CSS styling.",
    achievements: [
      "Odoo x SNS Coimbatore Hackathon Finalist (2026)",
      "Production-grade system design review"
    ],
    duration: "Hackathon + Refinement",
    role: "Full Stack / System Architect"
  },
  {
    title: "Shreya's Portfolio Website",
    tag: "Full-stack / AI",
    category: "Full Stack",
    description: "Modern, interactive developer portfolio featuring Google Gemini AI chatbot assistance, responsive design, dark/light themes, and contact notifications via Resend.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Python", "Flask", "Gemini API"],
    highlights: [
      "Integrated Google Gemini AI assistant",
      "Direct Resend email delivery & contact workflow"
    ],
    icon: Layout,
    github: "https://github.com/Shreyawangikar/shreya-portfolio",
    live: "https://shreya-portfolio-azure.vercel.app",
    problem: "Static resumes lack interactivity and conversational depth for recruiters to explore an engineer's technical skills.",
    solution: "Engineered a personalized portfolio featuring an AI assistant backed by Google Gemini, live activity insights, clean project case studies, and responsive design.",
    features: [
      "Interactive AI assistant powered by Google Gemini",
      "Command palette (Ctrl+K) for rapid navigation",
      "Dynamic theme toggle (Dark / Light mode)",
      "Direct Resend email contact workflow",
      "Responsive layout for mobile, tablet, and desktop"
    ],
    architecture: "Frontend: React + Vite + TypeScript + Tailwind CSS. Backend: Python Flask service + Google Gemini API + Resend email service.",
    achievements: [
      "Production-deployed on Vercel & Render",
      "Real-time conversational AI integration"
    ],
    duration: "Full Stack Project",
    role: "Full Stack Developer"
  },
];

const categories = ["All", "Full Stack", "AI/ML", "AR/VR", "Academic"];

const ProjectsSection = () => {
  const ref = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  const isMobile = useMobileDetection();

  const glowColor = theme === "light" ? LIGHT_MODE_GLOW_COLOR : DEFAULT_GLOW_COLOR;

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const openProjectModal = (project: ProjectDetails) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section id="projects" className="py-20 relative bento-section" ref={ref}>
      {/* GlobalSpotlight follows cursor across the project grid */}
      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={isMobile}
        enabled={true}
        spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
        glowColor={glowColor}
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
        >
          Selected Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-[32px] font-semibold tracking-tight mb-6"
        >
          Things I’ve built<span className="gradient-text">.</span>
        </motion.h2>

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                activeFilter === cat
                  ? "bg-foreground text-background font-medium"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* MagicBento glow styles — theme-reactive */}
        <style>{`
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
              transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 1;
          }
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(0,0,0,${theme === "light" ? "0.08" : "0.4"}),
                         0 0 30px rgba(${glowColor}, ${theme === "light" ? "0.15" : "0.2"});
          }
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
          }
          .particle::before {
            content: '';
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
        `}</style>

        {/* Project grid — 3 columns */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              inView={inView}
              index={i}
              onClick={() => openProjectModal(project)}
              glowColor={glowColor}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* View more hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/shreyawangikar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github size={16} />
            <span className="text-sm">View more on GitHub</span>
          </a>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default ProjectsSection;
