import { motion } from "framer-motion";
import { Award, Cloud, Glasses, ExternalLink } from "lucide-react";

const certifications = [
  {
    title: "AWS Cloud Fundamentals Bootcamp",
    organization: "AWS Cloud Club at PICT",
    year: "2025",
    icon: Cloud,
    description: "Completed cloud fundamentals training via AWS Cloud Club at PICT.",
    highlights: [
      "Hands-on exposure to EC2, S3, IAM",
      "Cloud security basics",
      "Deployment concepts",
    ],
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    title: "AR/VR Bootcamp — Unity & Vuforia",
    organization: "PICT IT Department × CDAC Pune",
    year: "2025",
    icon: Glasses,
    description: "Completed a 3-day immersive bootcamp organized by PICT IT Department in collaboration with CDAC Pune.",
    highlights: [
      "Image Target implementation",
      "Multi-Image Target techniques",
      "Ground Plane technology",
    ],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3 flex items-center gap-2">
            <Award size={14} />
            Certifications
          </p>
          <h2 className="text-[32px] font-semibold tracking-tight">
            Professional Training<span className="gradient-text">.</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Hands-on learning experiences and certifications that complement my development skills.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-6 rounded-xl border ${cert.borderColor} ${cert.bgColor} backdrop-blur-sm hover:border-primary/30 transition-all duration-300`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${cert.color} text-white`}>
                      <Icon size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-secondary/50 text-muted-foreground">
                      {cert.year}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{cert.organization}</p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground/80 mb-4 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-primary/80 uppercase tracking-wider">Key Learnings:</p>
                    <ul className="space-y-1.5">
                      {cert.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cert.color}`} />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
