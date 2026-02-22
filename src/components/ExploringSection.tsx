import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Zap, TrendingUp } from "lucide-react";

const explorations = [
  {
    icon: TrendingUp,
    title: "System Design Fundamentals",
    description: "Deep diving into distributed systems, scalability patterns, database optimization, and architectural trade-offs for large-scale applications.",
  },
  {
    icon: Zap,
    title: "Backend Scalability Patterns",
    description: "Exploring caching strategies, microservices architecture, event-driven systems, and message queues for building resilient backends.",
  },
  {
    icon: Lightbulb,
    title: "AI-Driven Automation Systems",
    description: "Building intelligent automation using LLMs, multi-agent systems, and AI-powered workflow optimization.",
  },
];

const ExploringSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="exploring" className="py-32 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-4"
        >
          Learning Path
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
        >
          Currently Exploring<span className="gradient-text">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-muted-foreground max-w-2xl mb-16"
        >
          Continuous learning is core to my engineering practice. Here's what I'm diving deep into right now.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {explorations.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 hover:glow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <item.icon className="text-primary" size={22} />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground/70 italic">
                  Active learning · Building side projects
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploringSection;
