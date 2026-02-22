import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, MapPin, Briefcase } from "lucide-react";

const Scene3D = lazy(() => import("@/components/Scene3D"));

const roles = ["Backend Systems Engineer", "Full Stack Developer", "Algorithm Architect"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background — reduced opacity */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>

      {/* Subtle gradient orb */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity, scale, y }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Quick overview — recruiter-first */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground mb-8"
          >
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={14} className="text-primary" />
              Full Stack Developer
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              Pune, India
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Open to Internship / Full-time
            </span>
          </motion.div>

          {/* Name */}
          <motion.p
            className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Shreya Wangikar
          </motion.p>

          {/* H1 — 48px/56px as specified */}
          <h1 className="text-4xl sm:text-[48px] lg:text-[56px] font-semibold leading-[1.15] tracking-tight mb-6">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Building Scalable
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="gradient-text"
            >
              Full-Stack
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              {" "}Backend Systems.
            </motion.span>
          </h1>

          {/* Typewriter role */}
          <div className="h-7 mb-8">
            <span className="font-mono text-sm text-muted-foreground">
              &gt; {displayed}
              <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 align-middle animate-pulse" />
            </span>
          </div>

          {/* Impact metrics — scannable in 5 seconds */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-8 mb-10"
          >
            {[
              { num: "5+", label: "Production Apps" },
              { num: "200+", label: "DSA Solved" },
              { num: "2x", label: "Hackathon Finalist" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-semibold text-foreground">{m.num}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div 
            className="flex gap-3 justify-center flex-wrap mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors duration-200 inline-flex items-center gap-2"
            >
              View Projects
              <ArrowDown size={14} />
            </a>
            <a
              href="/resume.pdf"
              download="Shreya_Wangikar_Resume.pdf"
              className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:border-primary/30 hover:bg-primary/5 transition-colors duration-200"
            >
              Download Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/30 transition-colors duration-200"
            >
              Contact
            </a>
          </motion.div>

          {/* Social links — LinkedIn | GitHub | Email */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-3"
          >
            {[
              { icon: Github, href: "https://github.com/Shreyawangikar", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/shreya-wangikar", label: "LinkedIn" },
              { icon: Mail, href: "mailto:wangikarshreya@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] text-muted-foreground/40 font-mono">scroll</span>
            <ArrowDown className="text-muted-foreground/40" size={14} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
