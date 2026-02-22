import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Professional skill descriptions for hover tooltips
const skillDescriptions: Record<string, string> = {
  // Languages
  "JavaScript": "ES6+ features, async/await, modern DOM manipulation",
  "TypeScript": "Type-safe development with interfaces, generics & decorators",
  "Python": "Backend scripting, data processing, AI/ML integrations",
  "C++": "DSA problem solving, competitive programming, system-level code",
  
  // Frontend
  "React.js": "Component architecture, hooks, context API, state management",
  "Vite": "Fast build tool with HMR for modern web development",
  "Tailwind CSS": "Utility-first CSS for rapid, responsive UI development",
  "Framer Motion": "Production-ready animations and gesture interactions",
  
  // Backend
  "Node.js": "Server-side JavaScript runtime for scalable applications",
  "Express.js": "RESTful API development with middleware architecture",
  "Prisma ORM": "Type-safe database access with migrations & queries",
  "REST APIs": "Design and implementation of RESTful web services",
  
  // Databases
  "PostgreSQL": "Relational database design, complex queries, indexing",
  "MongoDB": "NoSQL document database for flexible data models",
  "MySQL": "Relational database management & query optimization",
  "Firebase": "Real-time database, authentication, cloud functions",
  
  // DevOps
  "AWS (EC2, S3, IAM)": "Cloud infrastructure, storage, and access management",
  "Firebase Hosting": "Fast, secure hosting with CDN distribution",
  "GitHub Actions": "CI/CD automation for build, test, and deployment",
  "CI/CD Pipelines": "Automated workflows for continuous integration",
  
  // AI & Systems
  "LLM Integration": "OpenRouter, OpenAI API integration for AI features",
  "Prompt Optimization": "Engineering effective prompts for AI models",
  "RAG Pipelines": "Retrieval-augmented generation for context-aware AI",
  "Information Theory": "Entropy-based optimization algorithms",
};

const categories = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Python", "C++"] },
  { title: "Frontend", items: ["React.js", "Vite", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend", items: ["Node.js", "Express.js", "Prisma ORM", "REST APIs"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "Firebase"] },
  { title: "DevOps & Cloud", items: ["AWS (EC2, S3, IAM)", "Firebase Hosting", "GitHub Actions", "CI/CD Pipelines"] },
  { title: "AI & Systems", items: ["LLM Integration", "Prompt Optimization", "RAG Pipelines", "Information Theory"] },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <TooltipProvider delayDuration={200}>
      <section id="skills" className="py-20 relative" ref={ref}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
          >
            Tech Stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="text-[32px] font-semibold tracking-tight mb-3"
          >
            Tech Stack & Tools<span className="gradient-text">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground text-sm max-w-2xl mb-10"
          >
            Production-grade technologies for building scalable systems, from cloud infrastructure to algorithmic optimization.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, catIdx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * catIdx, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-xl p-6 hover:border-primary/20 transition-colors duration-200 card-hover"
              >
                <h3 className="text-xs font-mono text-primary uppercase tracking-[0.15em] mb-5">
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <Tooltip key={skill}>
                      <TooltipTrigger asChild>
                        <span
                          className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
                        >
                          {skill}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[250px] text-center">
                        <p className="text-xs">{skillDescriptions[skill] || skill}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default SkillsSection;
