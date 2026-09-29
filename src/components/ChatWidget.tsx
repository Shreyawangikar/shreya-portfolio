import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

// Multi-tier AI configuration
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "AIzaSyBxxqedL9xlHd12H3hKNQ-O_9dnWeDm_L8";
const BACKEND_BASE = (import.meta.env.VITE_PYTHON_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const BACKEND_CHAT_URL = BACKEND_BASE.endsWith("/api/chat") ? BACKEND_BASE : `${BACKEND_BASE}/api/chat`;
const RENDER_CHAT_URL = "https://shreya-portfolio-p5o1.onrender.com/api/chat";

const SHREYA_SYSTEM_PROMPT = `You are an AI assistant for Shreya Wangikar's personal portfolio website.
Answer professionally, clearly, and concisely with technical depth.

About Shreya:
- Final-year B.E. Information Technology student (2023–2027) at Pune Institute of Computer Technology (PICT), Savitribai Phule Pune University, CGPA: 8.53.
- Contact: wangikarshreya@gmail.com | +91 89838 07663 | Pune, Maharashtra, India.
- GitHub: https://github.com/Shreyawangikar | LinkedIn: https://www.linkedin.com/in/shreya-wangikar

Key Projects:
1. Collaborative Design Platform (Next.js 14, TypeScript, Fabric.js, Liveblocks): Real-time collaborative canvas design tool enabling multiplayer editing, live presence, and state synchronization.
2. TaskForge — Multithreaded Job Scheduler (C++, STL, CMake): Worker thread pool, priority execution, cycle-detected DAG dependency resolution, thread-safe synchronization with mutexes & condition variables.
3. JanNivaran — Civic Issue Reporting & Resolution Platform (React, Node.js, Express.js, MongoDB, Google Gemini, Google Maps): Geotagged complaint tracking, AI priority classification, role-based authorization for 3 user tiers.
4. Career Tracking Platform: Mastercard Code for Change 2.0 (2025) Finalist. AI alumni tracking & recommendations.
5. Subscription Management System (ERP): Odoo x SNS Coimbatore Hackathon 2026 Finalist. Recurring billing, invoice generation, tax & discount engines, RBAC.
6. AR Image & Surface Tracking Experience: Unity & Vuforia immersive AR application with Ground Plane & Image Target tracking.
7. Self-Supervised Visual Representation Learning: Academic exploration of SimCLR and BYOL contrastive learning.

Skills:
- Languages: C++, Python, JavaScript, SQL, Java
- Frontend: React.js, Next.js, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express.js, REST APIs
- Databases: MySQL, MongoDB, SQL
- Core CS: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, Software Engineering
- AI/ML: Machine Learning, Deep Learning, Self-Supervised Learning (SimCLR, BYOL), Computer Vision
- Tools & Specialized: Fabric.js, Liveblocks, Unity, Vuforia, ARCore, Git, GitHub, Vercel, Render, VS Code`;

const quickQuestions = [
  "What projects has Shreya built?",
  "Tell me about TaskForge and JanNivaran",
  "What technologies does she know?",
  "Tell me about her hackathons",
];

// Animated Chat Prompt Component
const ChatPrompt = ({ show, onClick }: { show: boolean; onClick: () => void }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={onClick}
          className="fixed bottom-24 right-6 z-40 cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-3 rounded-2xl rounded-br-sm shadow-lg"
          >
            <motion.div 
              className="flex items-center gap-2"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} className="text-primary-foreground/90" />
              <span className="text-sm font-medium whitespace-nowrap">
                Have questions? Ask me!
              </span>
            </motion.div>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-primary/80 transform rotate-45" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
  }, []);

  // Show chat prompt after 3 seconds if chat hasn't been opened
  useEffect(() => {
    const hasDismissed = sessionStorage.getItem("chatPromptDismissed");
    if (hasDismissed) return;

    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Hide prompt when chat opens
  useEffect(() => {
    if (open) {
      setShowPrompt(false);
      sessionStorage.setItem("chatPromptDismissed", "true");
    }
  }, [open]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const recentMessages = [...messages, userMsg].slice(-5);
      let reply = "";

      // 1. Try local or configured backend first
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const resp = await fetch(BACKEND_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: recentMessages }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (resp.ok) {
          const data = await resp.json();
          if (data.reply) reply = data.reply;
        }
      } catch (err) {
        console.warn("Backend chat unavailable, attempting direct fallback...", err);
      }

      // 2. Try direct Gemini API if backend didn't respond
      if (!reply && GEMINI_KEY) {
        try {
          const contents = recentMessages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          }));
          const geminiResp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: SHREYA_SYSTEM_PROMPT }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
              }),
            }
          );
          if (geminiResp.ok) {
            const data = await geminiResp.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) reply = text.trim();
          }
        } catch (err) {
          console.warn("Direct Gemini fallback failed:", err);
        }
      }

      // 3. Try Render production backend as last resort
      if (!reply) {
        try {
          const resp = await fetch(RENDER_CHAT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: recentMessages }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.reply) reply = data.reply;
          }
        } catch (err) {
          console.error("Render chat request failed:", err);
        }
      }

      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
        throw new Error("All chat providers failed");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please feel free to reach out to Shreya directly at wangikarshreya@gmail.com or +91 89838 07663!" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Animated Chat Prompt - shows when chat is closed */}
      <ChatPrompt 
        show={showPrompt && !open} 
        onClick={() => { setOpen(true); setShowPrompt(false); }} 
      />

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200"
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with AI"
        title="Chat with AI assistant"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ask about Shreya</p>
                <p className="text-xs text-muted-foreground">AI-powered assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">Quick questions:</p>
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose-chat">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border/40">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  maxLength={500}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
