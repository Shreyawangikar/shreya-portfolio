import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { 
  Search, 
  User, 
  Briefcase, 
  Code2, 
  Trophy, 
  Mail, 
  Moon, 
  Sun,
  Github,
  Linkedin,
  FileText,
  Sparkles,
  Home,
  Award,
  Globe,
  Zap,
  Brain,
  CreditCard,
  Cloud,
  Glasses,
  ExternalLink,
  MessageCircle,
  Rocket,
  Database,
  Server,
  Palette,
  Terminal
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Projects data for search
const projects = [
  {
    title: "Career Tracking Platform",
    tag: "AI / Full-stack",
    description: "AI-powered career recommendations with alumni tracking dashboards",
    tech: ["React", "Node.js", "MongoDB", "OpenAI", "TailwindCSS"],
    icon: Sparkles,
  },
  {
    title: "GlobeTrotter",
    tag: "Full-stack",
    description: "Multi-city travel planner with budget tracking and itinerary suggestions",
    tech: ["React", "Express", "PostgreSQL", "Maps API", "Chart.js"],
    icon: Globe,
  },
  {
    title: "SkillSprint",
    tag: "SaaS",
    description: "Productivity tool with Kanban boards and real-time tracking",
    tech: ["React", "Node.js", "MongoDB", "Socket.io", "JWT"],
    icon: Zap,
  },
  {
    title: "Subscription Management System",
    tag: "ERP",
    description: "Production ERP for subscription businesses with recurring billing",
    tech: ["JavaScript", "Node.js", "Prisma", "PostgreSQL"],
    icon: CreditCard,
  },
  {
    title: "WordleX — Entropy-Driven Solver",
    tag: "Algorithm",
    description: "Information theory-based Wordle solver with Firebase deployment",
    tech: ["React", "TypeScript", "Firebase", "GitHub Actions"],
    icon: Brain,
    live: "https://wordlex-solver.web.app/",
  },
];

// Skills data for search
const skills = [
  { name: "JavaScript", category: "Languages", description: "ES6+ features, async/await, modern DOM manipulation" },
  { name: "TypeScript", category: "Languages", description: "Type-safe development with interfaces & generics" },
  { name: "Python", category: "Languages", description: "Backend scripting, data processing, AI/ML integrations" },
  { name: "C++", category: "Languages", description: "DSA problem solving, competitive programming" },
  { name: "React.js", category: "Frontend", description: "Component architecture, hooks, context API" },
  { name: "Vite", category: "Frontend", description: "Fast build tool with HMR for modern web development" },
  { name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS for rapid, responsive UI" },
  { name: "Framer Motion", category: "Frontend", description: "Production-ready animations and gestures" },
  { name: "Node.js", category: "Backend", description: "Server-side JavaScript runtime for scalable apps" },
  { name: "Express.js", category: "Backend", description: "RESTful API development with middleware" },
  { name: "Prisma ORM", category: "Backend", description: "Type-safe database access with migrations" },
  { name: "REST APIs", category: "Backend", description: "Design and implementation of RESTful services" },
  { name: "PostgreSQL", category: "Databases", description: "Relational database design, complex queries" },
  { name: "MongoDB", category: "Databases", description: "NoSQL document database for flexible data" },
  { name: "MySQL", category: "Databases", description: "Relational database management & optimization" },
  { name: "Firebase", category: "Databases", description: "Real-time database, auth, cloud functions" },
  { name: "AWS", category: "DevOps", description: "EC2, S3, IAM - Cloud infrastructure & storage" },
  { name: "GitHub Actions", category: "DevOps", description: "CI/CD automation for build, test, deploy" },
  { name: "LLM Integration", category: "AI", description: "OpenRouter, OpenAI API integration" },
  { name: "Prompt Engineering", category: "AI", description: "Engineering effective prompts for AI models" },
];

// Certifications
const certifications = [
  {
    title: "AWS Cloud Fundamentals Bootcamp",
    org: "AWS Cloud Club at PICT",
    description: "EC2, S3, IAM, cloud security, deployment concepts",
    icon: Cloud,
  },
  {
    title: "AR/VR Bootcamp — Unity & Vuforia",
    org: "PICT IT × CDAC Pune",
    description: "Image Target, Multi-Image Target, Ground Plane",
    icon: Glasses,
  },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Toggle command palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get category icon for skills
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Languages": return Terminal;
      case "Frontend": return Palette;
      case "Backend": return Server;
      case "Databases": return Database;
      case "DevOps": return Rocket;
      case "AI": return Brain;
      default: return Code2;
    }
  };

  return (
    <>
      {/* Trigger hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground text-xs hover:bg-secondary transition-colors"
      >
        <Search size={12} />
        <span>Search</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Command palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4"
            >
              <Command className="glass rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 border-b border-border/50">
                  <Search className="text-muted-foreground" size={18} />
                  <Command.Input
                    autoFocus
                    placeholder="Search projects, skills, certifications..."
                    className="flex-1 py-4 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm"
                  />
                  <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono">ESC</kbd>
                </div>

                <Command.List className="max-h-[420px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-muted-foreground text-sm">
                    No results found. Try searching for a project, skill, or section.
                  </Command.Empty>

                  {/* Navigation */}
                  <Command.Group heading="Navigation">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Navigation
                    </div>
                    {[
                      { icon: Home, label: "Home", shortcut: "↑", id: "hero" },
                      { icon: User, label: "About Me", shortcut: "A", id: "about" },
                      { icon: Briefcase, label: "Projects", shortcut: "P", id: "projects" },
                      { icon: Code2, label: "Skills", shortcut: "S", id: "skills" },
                      { icon: Award, label: "Certifications", shortcut: "C", id: "certifications" },
                      { icon: Trophy, label: "Achievements", shortcut: "V", id: "achievements" },
                      { icon: Sparkles, label: "Why Hire Me", shortcut: "W", id: "why-hire-me" },
                      { icon: Mail, label: "Contact", shortcut: "M", id: "contact" },
                    ].map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`nav ${item.label} section`}
                        onSelect={() => runCommand(() => scrollTo(item.id))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                      >
                        <item.icon size={16} className="text-primary/70" />
                        <span className="flex-1">{item.label}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">
                          {item.shortcut}
                        </kbd>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* Projects */}
                  <Command.Group heading="Projects">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Projects
                    </div>
                    {projects.map((project) => (
                      <Command.Item
                        key={project.title}
                        value={`project ${project.title} ${project.tag} ${project.description} ${project.tech.join(" ")}`}
                        onSelect={() => runCommand(() => scrollTo("projects"))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                      >
                        <project.icon size={16} className="text-primary/70" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{project.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                              {project.tag}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                        </div>
                        {project.live && (
                          <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* Skills */}
                  <Command.Group heading="Skills">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Skills & Technologies
                    </div>
                    {skills.map((skill) => {
                      const Icon = getCategoryIcon(skill.category);
                      return (
                        <Command.Item
                          key={skill.name}
                          value={`skill ${skill.name} ${skill.category} ${skill.description}`}
                          onSelect={() => runCommand(() => scrollTo("skills"))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                        >
                          <Icon size={16} className="text-primary/70" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0">
                                {skill.category}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                          </div>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>

                  {/* Certifications */}
                  <Command.Group heading="Certifications">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Certifications
                    </div>
                    {certifications.map((cert) => (
                      <Command.Item
                        key={cert.title}
                        value={`certification ${cert.title} ${cert.org} ${cert.description} aws cloud arvr unity vuforia`}
                        onSelect={() => runCommand(() => scrollTo("certifications"))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                      >
                        <cert.icon size={16} className="text-primary/70" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{cert.title}</span>
                          <p className="text-xs text-muted-foreground truncate">{cert.org} — {cert.description}</p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* Actions */}
                  <Command.Group heading="Actions">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Quick Actions
                    </div>
                    <Command.Item
                      value="toggle theme dark light mode appearance"
                      onSelect={() => runCommand(toggleTheme)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      {theme === "dark" ? <Sun size={16} className="text-primary/70" /> : <Moon size={16} className="text-primary/70" />}
                      <span className="flex-1">Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">T</kbd>
                    </Command.Item>
                    <Command.Item
                      value="download resume pdf cv curriculum"
                      onSelect={() => runCommand(() => {
                        const link = document.createElement('a');
                        link.href = '/resume.pdf';
                        link.download = 'Shreya_Wangikar_Resume.pdf';
                        link.click();
                      })}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      <FileText size={16} className="text-primary/70" />
                      <span className="flex-1">Download Resume</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">R</kbd>
                    </Command.Item>
                    <Command.Item
                      value="chat ai assistant bot help shreya questions"
                      onSelect={() => runCommand(() => {
                        document.querySelector<HTMLButtonElement>('[aria-label="Chat with AI"]')?.click();
                      })}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      <MessageCircle size={16} className="text-primary/70" />
                      <span className="flex-1">Chat with AI Assistant</span>
                    </Command.Item>
                  </Command.Group>

                  {/* Social */}
                  <Command.Group heading="Social">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Social Links
                    </div>
                    <Command.Item
                      value="github profile repository code source"
                      onSelect={() => runCommand(() => window.open("https://github.com/Shreyawangikar", "_blank"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      <Github size={16} className="text-primary/70" />
                      <span className="flex-1">GitHub Profile</span>
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </Command.Item>
                    <Command.Item
                      value="linkedin professional profile network connect"
                      onSelect={() => runCommand(() => window.open("https://www.linkedin.com/in/shreya-wangikar", "_blank"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      <Linkedin size={16} className="text-primary/70" />
                      <span className="flex-1">LinkedIn Profile</span>
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </Command.Item>
                    <Command.Item
                      value="email contact mail message hire"
                      onSelect={() => runCommand(() => window.open("mailto:wangikarshreya@gmail.com", "_blank"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                    >
                      <Mail size={16} className="text-primary/70" />
                      <span className="flex-1">Send Email</span>
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="border-t border-border/50 px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground/60">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">ESC</kbd> Close
                  </span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
