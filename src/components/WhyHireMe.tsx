import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Built 5+ production-grade full-stack systems (ERP, SaaS, AI)",
  "Strong backend architecture — Node.js, Express, Prisma, PostgreSQL",
  "200+ DSA problems solved on LeetCode",
  "2x Hackathon Finalist (Odoo, Mastercard)",
  "CI/CD pipelines with GitHub Actions, deployed on AWS & Firebase",
  "Applied AI: LLM integration, RAG pipelines, prompt optimization",
  "System-level thinking — lifecycle engines, RBAC, schema design",
  "Rapid execution: shipped complex systems in 36–48 hour hackathons",
];

const WhyHireMe = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-hire-me" className="py-20 relative" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
        >
          The Value I Bring
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-[32px] font-semibold tracking-tight mb-10"
        >
          Why Hire Me<span className="gradient-text">?</span>
        </motion.h2>

        <ul className="space-y-4">
          {highlights.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
              className="flex items-start gap-3 text-base text-foreground/90"
            >
              <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 flex gap-3 flex-wrap"
        >
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors duration-200"
          >
            Let's Connect
          </a>
          <a
            href="/resume.pdf"
            className="px-6 py-3 rounded-lg border border-border text-foreground text-sm hover:border-primary/30 hover:bg-primary/5 transition-colors duration-200"
          >
            View Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyHireMe;
