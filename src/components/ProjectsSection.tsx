import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, Globe, Zap, Brain, CreditCard, Sparkles, Layout } from "lucide-react";
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
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>

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

          {/* Links */}
          <div className="flex gap-2 mt-auto">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
            >
              <Github size={14} />
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="mt-3 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view details
          </div>
        </div>
      </ParticleCard>
    </motion.div>
  );
};

const projects: ProjectDetails[] = [
  {
    title: "Career Tracking Platform",
    tag: "AI / Full-stack",
    description: "AI-powered career recommendations with alumni tracking dashboards. Built during a 36-hour hackathon.",
    tech: ["React", "Node.js", "MongoDB", "OpenAI", "TailwindCSS"],
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
    architecture: "React frontend → Express API → MongoDB → OpenAI GPT-4 for recommendations → Real-time updates via WebSockets",
    achievements: ["Hackathon Finalist", "36-hour build", "500+ recommendations generated"],
    duration: "36 hours",
    role: "Full Stack Developer"
  },
  {
    title: "GlobeTrotter",
    tag: "Full-stack",
    description: "Multi-city travel planner with budget tracking, interactive calendar, and itinerary suggestions.",
    tech: ["React", "Express", "PostgreSQL", "Maps API", "Chart.js"],
    icon: Globe,
    github: "https://github.com/Shreyawangikar",
    problem: "Planning multi-city trips is complex and time-consuming, with budget tracking often done separately.",
    solution: "An integrated travel planning platform that combines itinerary creation, budget management, and real-time suggestions in one seamless experience.",
    features: [
      "Multi-city trip planning",
      "Interactive budget tracker with charts",
      "Calendar-based itinerary view",
      "Smart destination suggestions",
      "Expense categorization",
      "Shareable trip plans"
    ],
    architecture: "React + Redux → REST API → PostgreSQL with pg_trgm for search → Google Maps integration",
    duration: "3 weeks",
    role: "Full Stack Developer"
  },
  {
    title: "SkillSprint",
    tag: "SaaS",
    description: "Productivity tool with Kanban boards, real-time tracking, and authentication for team management.",
    tech: ["React", "Node.js", "MongoDB", "Socket.io", "JWT"],
    icon: Zap,
    github: "https://github.com/Shreyawangikar",
    problem: "Teams need a simple yet powerful tool to manage tasks and track project progress in real-time.",
    solution: "A real-time collaborative platform with Kanban boards, team management, and customizable workflows.",
    features: [
      "Drag-and-drop Kanban boards",
      "Real-time collaboration",
      "Team management with roles",
      "Custom workflow automation",
      "Progress analytics dashboard",
      "Notification system"
    ],
    architecture: "React frontend → Socket.io for real-time → Express API → MongoDB with change streams",
    duration: "4 weeks",
    role: "Lead Developer"
  },
  {
    title: "Subscription Management System",
    tag: "ERP",
    description: "Production-style ERP platform for subscription-based businesses. Manages recurring billing, lifecycle workflows, invoicing, and financial rules. Finalist at Odoo x SNS Hackathon 2026.",
    tech: ["JavaScript", "Node.js", "Express", "Prisma", "React", "Vite", "TailwindCSS", "PostgreSQL"],
    icon: CreditCard,
    github: "https://github.com/Shreyawangikar",
    problem: "Subscription-based businesses need a unified system to manage complex workflows: recurring billing, plan configuration, tax/discount rules, lifecycle transitions, invoicing, and financial reporting — typically handled by fragmented tools.",
    solution: "A modular ERP-style web application with MVC architecture that automates the complete subscription lifecycle, from quotation through activation to closure, with integrated tax/discount engines, recurring billing automation, and comprehensive analytics.",
    features: [
      "Subscription lifecycle engine (Draft → Quotation → Confirmed → Active → Closed)",
      "Auto-generated invoices based on billing intervals (Daily/Weekly/Monthly/Yearly)",
      "Role-based access control (Admin, Internal User, Portal User)",
      "Dynamic tax & discount rule engine with usage limits & thresholds",
      "Configurable recurring plans with minimum quantity enforcement",
      "Real-time payment tracking & overdue invoice alerts",
      "Revenue summaries & subscription analytics dashboards",
      "JWT-based authentication with email/password validation",
      "Status transitions with validation checks",
      "Shareable customer portal views"
    ],
    architecture: "Backend: Controllers (auth, invoices, payments, plans, reports) → Routes → Auth/Role/Error handling Middleware → Prisma ORM → PostgreSQL. Frontend: React components with Context API (Auth, Theme) → Protected routes via RBAC → TailwindCSS styling. Lifecycle modeling at controller level, financial computation with safeguards.",
    achievements: [
      "Selected as Hackathon Finalist",
      "3–4 structured architectural review rounds",
      "Production-grade system design evaluation",
      "Deep-dive mentoring on database schema, lifecycle modeling, and scalability planning"
    ],
    duration: "Hackathon (48 hours) + Production refinement",
    role: "Full Stack / System Architect"
  },
  {
    title: "WordleX — Entropy-Driven Wordle Solver",
    tag: "Algorithm / Product",
    description: "Production-deployed entropy-based Wordle solver combining information theory, optimized search algorithms, and cloud infrastructure with CI/CD automation.",
    tech: ["React", "TypeScript", "Vite", "Firebase", "GitHub Actions", "Framer Motion"],
    icon: Brain,
    github: "https://github.com/Shreyawangikar",
    live: "https://wordlex-solver.web.app/",
    problem: "Standard Wordle solvers use naive filtering. They lack algorithmic sophistication, visual explanation, or production-level deployment — making them unsuitable as portfolio projects showcasing computer science rigor.",
    solution: "WordleX uses information theory to select optimal guesses by maximizing expected information gain (entropy). Each guess partitions the solution space, and the algorithm ranks guesses by their ability to reduce uncertainty most effectively.",
    features: [
      "Entropy-based guess ranking using information theory",
      "Dynamic candidate set partitioning by feedback patterns",
      "Interactive visualization of partition distributions",
      "Tooltip explanations for entropy calculations",
      "Real-time feedback integration (Gray/Yellow/Green)",
      "Animated candidate elimination",
      "Daily puzzle reset logic with streak tracking",
      "Firebase authentication & persistent state",
      "Responsive mobile-first design",
      "Dark mode toggle",
      "Polished UX with win celebrations & onboarding"
    ],
    architecture: "Frontend: React + TypeScript for type safety → Vite for fast bundling → Framer Motion for animations. Algorithm: Entropy computation for candidate set → Partition modeling by feedback patterns → Probabilistic ranking. Deployment: Firebase Hosting, GitHub Actions CI/CD, automatic deployment on push. State sync: Complex synchronization between grid, keyboard, candidate set, and entropy rankings.",
    achievements: [
      "Production-deployed on Firebase",
      "Integrated CI/CD pipeline with GitHub Actions",
      "Information theory & algorithmic optimization",
      "Complex React state management",
      "DevOps & cloud infrastructure experience"
    ],
    duration: "3-4 weeks",
    role: "Algorithm Engineer / Full Stack Developer"
  },
  {
    title: "Shreya's Portfolio Website",
    tag: "Full-stack",
    description: "A modern, interactive developer portfolio featuring an AI-powered chatbot, 3D animations, dark/light themes, and a Flask backend deployed on Render.",
    tech: ["React", "TypeScript", "Vite", "TailwindCSS", "Framer Motion", "Flask", "Python", "OpenRouter API"],
    icon: Layout,
    github: "https://github.com/Shreyawangikar/shreya-portfolio",
    live: "https://shreya-portfolio-azure.vercel.app",
    problem: "Generic portfolio templates lack personality, interactivity, and fail to showcase real engineering skills — recruiters rarely remember them.",
    solution: "A custom-built portfolio with an AI chatbot that answers questions about Shreya, smooth animations, a command palette, and a fully deployed Flask backend with rate limiting and conversation memory.",
    features: [
      "AI chatbot powered by OpenRouter (Liquid LFM model)",
      "Conversation memory with last 5 messages for context",
      "Rate limiting (20 req/min) with sliding window",
      "3D scene with Three.js",
      "Command palette (Ctrl+K) for quick navigation",
      "Dark/light theme toggle",
      "Interactive project modals with detailed case studies",
      "GitHub & LeetCode stats integration",
      "Responsive design with mobile support",
      "SQLite chat logging for analytics"
    ],
    architecture: "Frontend: React + TypeScript + Vite → TailwindCSS + Framer Motion for UI → Vercel deployment. Backend: Flask + Gunicorn → OpenRouter API for AI → SQLite for chat logs → Render deployment. CORS configured for cross-origin communication.",
    achievements: [
      "Full-stack deployment (Vercel + Render)",
      "AI integration with conversation context",
      "Production-grade backend with rate limiting",
      "Custom design from scratch — no templates"
    ],
    duration: "2 weeks",
    role: "Full Stack Developer / Designer"
  },
];

const categories = ["All", "AI / Full-stack", "Full-stack", "SaaS", "ERP", "Algorithm / Product"];

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
    : projects.filter(p => p.tag === activeFilter);

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
