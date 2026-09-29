import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Professional skill descriptions for hover tooltips
const skillDescriptions: Record<string, string> = {
  // Languages
  "C++": "Object-oriented programming, data structures, algorithms, STL, problem solving",
  "Python": "Scripting, backend development, data processing, machine learning integrations",
  "JavaScript": "Modern ES6+, asynchronous programming, frontend & full-stack development",
  "SQL": "Relational schema design, complex joins, data manipulation, indexing",
  "Java": "Object-oriented design, core programming concepts, software development",
  
  // Frontend
  "React.js": "Component architecture, hooks, state management, modern interactive UIs",
  "Next.js": "Server-side rendering, App Router, full-stack React framework",
  "HTML": "Semantic markup, accessibility, modern HTML5 web standards",
  "CSS": "Modern layouts, responsive design, animations, CSS variables",
  "Tailwind CSS": "Utility-first design system, responsive styles, modern aesthetics",
  
  // Backend
  "Node.js": "Asynchronous JavaScript server runtime, event-driven architecture",
  "Express.js": "RESTful API development, middleware, controllers, routes",
  "REST APIs": "Resource modeling, HTTP methods, JSON payloads, clean endpoint design",
  
  // Databases
  "MySQL": "Relational database management, querying, schema design, constraints",
  "MongoDB": "NoSQL document store, JSON collections, flexible data modeling",
  
  // AI / ML
  "Machine Learning": "Supervised & unsupervised learning algorithms, model evaluation",
  "Deep Learning": "Neural network architectures, training, optimization techniques",
  "Self-Supervised Learning": "Representation learning without manual annotations",
  "Computer Vision": "Image processing, feature extraction, visual recognition",
  "SimCLR": "Simple framework for contrastive learning of visual representations",
  "BYOL": "Bootstrap Your Own Latent representation learning",
  
  // Core CS
  "Data Structures & Algorithms": "Arrays, trees, graphs, sorting, searching, time & space complexity",
  "Object-Oriented Programming": "Encapsulation, inheritance, polymorphism, abstraction, modular design",
  "DBMS": "Relational algebra, normalization, ACID properties, transactions",
  "Operating Systems": "Processes, threads, synchronization, memory management, scheduling",
  "Computer Networks": "TCP/IP, HTTP/HTTPS, OSI model, routing, network protocols",
  "Software Engineering": "SDLC, design patterns, testing, system architecture, Agile practices",
  
  // Tools & Platforms
  "Git": "Version control, branching, rebasing, merge workflows, commit history",
  "GitHub": "Collaborative development, pull requests, issue tracking, repositories",
  "Vercel": "Frontend deployment, continuous integration, global edge delivery",
  "Render": "Backend web services, database hosting, production deployment",
  "VS Code": "Primary code editor, debugging, extensions, productive workspace",
  
  // Specialized Technologies
  "Fabric.js": "Interactive canvas library for visual editing, object manipulation, rendering",
  "Liveblocks": "Real-time presence, state synchronization, multiplayer collaborative tools",
  "Unity": "Real-time 3D engine for interactive applications and spatial computing",
  "Vuforia": "Augmented reality SDK for image recognition and ground plane tracking",
  "ARCore": "Google augmented reality platform for environmental understanding",
};

const categories = [
  { title: "Languages", items: ["C++", "Python", "JavaScript", "SQL", "Java"] },
  { title: "Frontend", items: ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS"] },
  { title: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { title: "Databases", items: ["MySQL", "MongoDB", "SQL"] },
  { title: "AI / ML", items: ["Machine Learning", "Deep Learning", "Self-Supervised Learning", "Computer Vision", "SimCLR", "BYOL"] },
  { title: "Core Computer Science", items: ["Data Structures & Algorithms", "Object-Oriented Programming", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"] },
  { title: "Tools & Platforms", items: ["Git", "GitHub", "Vercel", "Render", "VS Code"] },
  { title: "Specialized Technologies", items: ["Fabric.js", "Liveblocks", "Unity", "Vuforia", "ARCore"] },
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
