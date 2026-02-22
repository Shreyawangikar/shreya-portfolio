import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import avatarImg from "@/assets/avatar.jpeg";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
  };

  return (
    <section id="about" className="py-20 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
          {/* Image */}
          <motion.div {...fadeUp} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative mx-auto lg:mx-0 w-64 h-64 lg:w-80 lg:h-80">
              <div className="w-full h-full rounded-3xl overflow-hidden border border-border/50 glow-sm">
                <img src={avatarImg} alt="Shreya Wangikar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass px-5 py-2 rounded-full text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Pune, India
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
            >
              About
            </motion.p>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] font-semibold tracking-tight mb-6 leading-tight"
            >
              From algorithms
              <br />
              <span className="text-muted-foreground">to production systems.</span>
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-base leading-relaxed mb-4"
            >
              I design and ship production-ready full-stack systems with strong backend architecture and algorithmic foundations. My work spans ERP lifecycle engines, real-time SaaS platforms, entropy-driven search systems, and cloud-deployed applications. 
              <br /><br />
              Proven track record: 2x hackathon finalist (Odoo, Mastercard), shipped production apps on AWS & Firebase, and 200+ DSA problems solved demonstrating deep algorithmic rigor.
            </motion.p>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-sm leading-relaxed mb-6"
            >
              B.E. Information Technology (2023–2027) · CGPA 8.8
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6"
            >
              {[
                { num: "200+", label: "DSA Problems" },
                { num: "5+", label: "Production Apps" },
                { num: "2x", label: "Hackathon Finalist" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-foreground">{stat.num}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
