import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github, Globe, Zap, Brain, CreditCard, Sparkles } from "lucide-react";
import ProjectModal, { ProjectDetails } from "./ProjectModal";

const projects: ProjectDetails[] = [
  {
    title: "Career Tracking Platform",
    tag: "AI / Full-stack",
    description: "AI-powered career recommendations with alumni tracking dashboards. Built during a 36-hour hackathon.",
    tech: ["React", "Node.js", "MongoDB", "OpenAI", "TailwindCSS"],
    icon: Sparkles,
    github: "https://github.com/Shreyawangikar",
    live: "#",
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
    live: "#",
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
    live: "#",
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
    live: "#",
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
];

const categories = ["All", "AI / Full-stack", "Full-stack", "SaaS", "ERP", "Algorithm / Product"];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.tag === activeFilter);

  const openProjectModal = (project: ProjectDetails) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section id="projects" className="py-20 relative" ref={ref}>
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

        {/* Project grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.08, duration: 0.5 }}
              onClick={() => openProjectModal(project)}
              className="group glass rounded-xl p-6 hover:border-primary/20 transition-all duration-200 cursor-pointer card-hover"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
                    <project.icon className="text-primary" size={22} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {project.tag}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xl">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-mono group-hover:bg-primary/10 group-hover:text-primary/80 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 md:flex-col">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
                  >
                    <Github size={16} />
                  </a>
                  <a 
                    href={project.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view details
              </div>
            </motion.div>
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
