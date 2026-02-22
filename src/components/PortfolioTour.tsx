import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, X, ChevronRight } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    id: "hero",
    title: "Welcome! 👋",
    description: "This is my portfolio. I'm Shreya, a Full Stack Developer passionate about building intelligent digital experiences.",
    position: "bottom",
  },
  {
    id: "about",
    title: "About Me",
    description: "Here's a quick overview of my background, education, and what drives me as a developer.",
    position: "top",
  },
  {
    id: "projects",
    title: "My Projects",
    description: "Check out the applications I've built - from hackathon winners to production SaaS platforms.",
    position: "top",
  },
  {
    id: "skills",
    title: "Tech Stack",
    description: "The technologies and tools I work with daily - from React to AI/ML.",
    position: "top",
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Hackathon finals, problem-solving milestones, and other highlights of my journey.",
    position: "top",
  },
  {
    id: "why-hire-me",
    title: "Why Hire Me?",
    description: "What makes me a valuable addition to your team beyond the technical skills.",
    position: "top",
  },
  {
    id: "contact",
    title: "Get in Touch",
    description: "Ready to connect? Reach out through the form or my social links!",
    position: "top",
  },
];

interface PortfolioTourProps {
  isActive: boolean;
  onEnd: () => void;
}

const PortfolioTour = ({ isActive, onEnd }: PortfolioTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const scrollToStep = useCallback((stepIndex: number) => {
    const step = tourSteps[stepIndex];
    const element = document.getElementById(step.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Calculate tooltip position after scroll
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let top = 0;
        let left = rect.left + rect.width / 2;
        
        if (step.position === "top") {
          top = Math.max(rect.top - 120, 80);
        } else {
          top = Math.min(rect.bottom + 20, viewportHeight - 200);
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(180, Math.min(left, viewportWidth - 180));
        
        setTooltipPosition({ top, left });
      }, 600);
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      scrollToStep(currentStep);
    }
  }, [isActive, currentStep, isPaused, scrollToStep]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const timer = setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        onEnd();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isActive, isPaused, currentStep, onEnd]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onEnd();
    }
  };

  const handleSkip = () => {
    onEnd();
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-[90] w-[340px] glass rounded-2xl p-5 shadow-2xl pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: "translateX(-50%)",
        }}
      >
        {/* Progress */}
        <div className="flex gap-1 mb-4">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h4 className="text-lg font-semibold text-foreground mb-2">{step.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} / {tourSteps.length}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>Next <ChevronRight size={12} /></>
              ) : (
                "Finish"
              )}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      </motion.div>

      {/* Start Tour button (when at beginning) */}
      {currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto"
        >
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg hover:shadow-xl transition-all"
          >
            <Play size={16} />
            Start Tour
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioTour;
