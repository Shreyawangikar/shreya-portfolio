import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Target, Code } from "lucide-react";

const items = [
  { icon: Award, year: "2026", title: "Odoo x SNS Coimbatore Hackathon Finalist", desc: "Designed and implemented a scalable technology solution through collaborative software development and product ideation, demonstrating structured problem solving, rapid prototyping, and technical communication." },
  { icon: Target, year: "2025", title: "Mastercard Code for Change 2.0 Finalist", desc: "Collaborated in a cross-functional team to design and develop an AI-powered solution, contributing to solution architecture, backend development, technical presentations, and iterative Agile development." },
  { icon: Code, year: "2024–Present", title: "250+ Problems Solved across DSA & SQL", desc: "Solved 250+ problems across Data Structures & Algorithms, SQL, and algorithmic problem solving with focus on optimization, edge cases, debugging, and time/space complexity." },
];

const AchievementsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-20 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
        >
          Practical Milestones
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-[32px] font-semibold tracking-tight mb-10"
        >
          Experience & Achievements<span className="gradient-text">.</span>
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center relative z-10">
                  <item.icon className="text-primary" size={22} />
                </div>
                <div className="glass rounded-2xl p-6 flex-1 hover:border-primary/20 transition-all duration-500">
                  <span className="text-xs font-mono text-primary">{item.year}</span>
                  <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
