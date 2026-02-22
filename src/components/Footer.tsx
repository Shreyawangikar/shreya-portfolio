import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigation = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  const socials = [
    { icon: Github, href: "https://github.com/Shreyawangikar", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/shreya-wangikar", label: "LinkedIn" },
    { icon: Mail, href: "mailto:wangikarshreya@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border/30">
      {/* Gradient decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={32} animate={false} />
              <span className="text-lg font-semibold gradient-text">shreya.</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
              Full Stack Developer passionate about building intelligent, scalable digital experiences.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>wangikarshreya@gmail.com</li>
              <li>Pune, India</li>
            </ul>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()}{" "}
            <span className="gradient-text font-medium">Shreya Wangikar</span>
            <span className="mx-2">·</span>
            Built with <Heart size={12} className="text-red-500 mx-1" /> using React + Three.js
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>

      {/* Easter egg hint */}
      <div className="text-center pb-4">
        <p className="text-[10px] text-muted-foreground/30 font-mono">
          Press ⌘K to explore • Try the AI assistant
        </p>
      </div>
    </footer>
  );
};

export default Footer;
