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
              Engineering practical solutions
              <br />
              <span className="text-muted-foreground">with thoughtful design.</span>
            </motion.h2>
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 space-y-3"
            >
              <p>
                I'm Shreya Wangikar, a final-year Information Technology Engineering student at Pune Institute of Computer Technology (PICT), affiliated with Savitribai Phule Pune University.
              </p>
              <p>
                I enjoy solving problems with code and building applications that combine thoughtful user experiences with practical engineering. My interests span full-stack development, data structures and algorithms, databases, and AI/ML.
              </p>
              <p>
                I've worked with technologies including C++, Python, JavaScript, React, Next.js, Node.js, SQL, and modern web development tools. I've also explored AR/VR development and self-supervised learning through academic and personal projects.
              </p>
              <p>
                Beyond coursework, I've participated in hackathons such as Mastercard Code for Change 2025 and continuously work on strengthening my problem-solving and software engineering skills. I'm currently looking for opportunities where I can contribute as a software engineer while continuing to learn and build production-quality systems.
              </p>
            </motion.div>

            {/* Education Timeline */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 mb-6 p-4 rounded-2xl bg-secondary/40 border border-border/50 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">Pune Institute of Computer Technology (PICT)</p>
                  <p className="text-muted-foreground">B.E. Information Technology · Savitribai Phule Pune University</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-primary font-medium">CGPA: 8.87</span>
                  <p className="text-muted-foreground">2023–2027</p>
                </div>
              </div>
              <div className="border-t border-border/30 pt-2 flex justify-between items-center text-[11px] text-muted-foreground">
                <span>Bharat Bharti College · HSC (81%)</span>
                <span>Oasis's English School · SSC (100%)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
