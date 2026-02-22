import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

const Logo = ({ size = 40, className = "", animate = true }: LogoProps) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" as const },
    },
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(220, 90%, 56%)" />
          <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
        </linearGradient>
        <linearGradient id="logoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(220, 90%, 56%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(270, 80%, 60%)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background circle with glow */}
      <motion.circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#logoGradientLight)"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* S letter */}
      <motion.path
        d="M18 18C18 18 19.5 14 24 14C28.5 14 30 17 30 19C30 21.5 27 23 24 24C21 25 18 26.5 18 29C18 31 19.5 34 24 34C28.5 34 30 30 30 30"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={pathVariants}
      />

      {/* W letter (simplified as accent) */}
      <motion.path
        d="M14 20L16 28L19 23L22 28L24 20"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
        variants={pathVariants}
        transition={{ delay: 0.3 }}
      />

      {/* Decorative dots */}
      <motion.circle
        cx="34"
        cy="16"
        r="2"
        fill="url(#logoGradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      />
      <motion.circle
        cx="38"
        cy="24"
        r="1.5"
        fill="url(#logoGradient)"
        opacity="0.6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />
    </motion.svg>
  );
};

export default Logo;
