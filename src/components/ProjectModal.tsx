import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, ArrowRight } from "lucide-react";

export interface ProjectDetails {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  // Extended details for modal
  problem?: string;
  solution?: string;
  features?: string[];
  architecture?: string;
  screenshots?: string[];
  achievements?: string[];
  duration?: string;
  role?: string;
}

interface ProjectModalProps {
  project: ProjectDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[101] glass rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <project.icon className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{project.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {project.tag}
                    </span>
                    {project.duration && (
                      <span className="text-xs text-muted-foreground">{project.duration}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                {/* Main content */}
                <div className="space-y-8">
                  {/* Overview */}
                  <section>
                    <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  </section>

                  {/* Problem & Solution */}
                  {(project.problem || project.solution) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.problem && (
                        <section className="bg-secondary/30 rounded-2xl p-5">
                          <h3 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-3">The Problem</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{project.problem}</p>
                        </section>
                      )}
                      {project.solution && (
                        <section className="bg-secondary/30 rounded-2xl p-5">
                          <h3 className="text-xs font-mono text-green-400 uppercase tracking-wider mb-3">The Solution</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{project.solution}</p>
                        </section>
                      )}
                    </div>
                  )}

                  {/* Key Features */}
                  {project.features && project.features.length > 0 && (
                    <section>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Key Features</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {project.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3"
                          >
                            <ArrowRight className="text-primary mt-0.5 flex-shrink-0" size={14} />
                            <span className="text-sm text-foreground/80">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Architecture */}
                  {project.architecture && (
                    <section>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Architecture</h3>
                      <div className="bg-secondary/30 rounded-2xl p-5">
                        <p className="text-muted-foreground text-sm leading-relaxed font-mono">{project.architecture}</p>
                      </div>
                    </section>
                  )}

                  {/* Achievements */}
                  {project.achievements && project.achievements.length > 0 && (
                    <section>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tech Stack */}
                  <section className="bg-secondary/30 rounded-2xl p-5">
                    <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 text-sm rounded-lg bg-muted text-foreground/80 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Role */}
                  {project.role && (
                    <section className="bg-secondary/30 rounded-2xl p-5">
                      <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-2">My Role</h3>
                      <p className="text-foreground/80">{project.role}</p>
                    </section>
                  )}

                  {/* Links */}
                  <section className="bg-secondary/30 rounded-2xl p-5">
                    <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Links</h3>
                    <div className="space-y-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group"
                      >
                        <Github size={18} className="text-muted-foreground group-hover:text-foreground" />
                        <span className="text-sm text-foreground/80 group-hover:text-foreground">View Source Code</span>
                        <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group"
                        >
                          <ExternalLink size={18} className="text-primary" />
                          <span className="text-sm text-foreground/80 group-hover:text-foreground">Live Demo</span>
                          <ArrowRight size={14} className="ml-auto text-primary" />
                        </a>
                      )}
                    </div>
                  </section>

                  {/* Screenshots placeholder */}
                  {project.screenshots && project.screenshots.length > 0 && (
                    <section>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Screenshots</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {project.screenshots.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-xs"
                          >
                            Screenshot {i + 1}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
