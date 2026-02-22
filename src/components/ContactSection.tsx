import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitContactMessage } from "@/hooks/useSupabase";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    setSending(true);
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setShowSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({ 
        title: "Failed to send", 
        description: "Please try again or email me directly.",
        variant: "destructive" 
      });
    } finally {
      setSending(false);
    }
  };

  const handleDismissSuccess = () => {
    setShowSuccess(false);
  };

  const inputClasses = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 text-sm";

  return (
    <section id="contact" className="py-20 relative" ref={ref}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[32px] font-semibold tracking-tight mb-4"
        >
          Let's work together<span className="gradient-text">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-12 max-w-md mx-auto"
        >
          Have a project in mind or want to collaborate? Feel free to reach out.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-xl p-6 space-y-4 text-left relative overflow-hidden"
        >
          {/* Success Overlay Animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-secondary/95 backdrop-blur-sm rounded-xl"
              >
                {/* Close button */}
                <button
                  onClick={handleDismissSuccess}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1 
                  }}
                  className="relative mb-4"
                >
                  {/* Outer ring animation */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute inset-0 -m-2 rounded-full border-2 border-green-500/30"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 1] }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2} />
                  </motion.div>
                </motion.div>

                {/* Text content */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-xl font-semibold text-foreground mb-2"
                >
                  Message Sent!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="text-muted-foreground text-sm text-center max-w-xs mb-6"
                >
                  Thank you for reaching out. I'll get back to you soon!
                </motion.p>

                {/* Got it button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  onClick={handleDismissSuccess}
                  className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Got it!
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className={inputClasses} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className={inputClasses} />
          </div>
          <textarea placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} rows={4} className={`${inputClasses} resize-none`} />
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90"
          >
            {sending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-background border-t-transparent rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send size={15} />
              </>
            )}
          </button>
        </motion.form>

        <div className="flex justify-center gap-4 mt-10">
          {[
            { icon: Github, href: "https://github.com/Shreyawangikar", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/shreya-wangikar", label: "LinkedIn" },
            { icon: Mail, href: "mailto:wangikarshreya@gmail.com", label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
