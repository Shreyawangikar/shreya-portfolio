import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ExploringSection from "@/components/ExploringSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import CommandPalette from "@/components/CommandPalette";
import WhyHireMe from "@/components/WhyHireMe";
import GitHubStats from "@/components/GitHubStats";
import LeetCodeStats from "@/components/LeetCodeStats";
import CertificationsSection from "@/components/CertificationsSection";
import MagicBento from "@/components/MagicBento";

const Index = () => {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      
      <main className="bg-background text-foreground min-h-screen overflow-x-hidden noise-bg">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <CertificationsSection />
        
        {/* Magic Bento Showcase */}
        <section className="py-20 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3">
                At a Glance
              </p>
              <h2 className="text-[32px] font-semibold tracking-tight">
                What I Bring<span className="gradient-text">.</span>
              </h2>
            </div>
            <MagicBento 
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              clickEffect={true}
              enableMagnetism={true}
            />
          </div>
        </section>

        <WhyHireMe />
        <AchievementsSection />
        
        {/* Coding Stats — moved to bottom, less prominent */}
        <section className="py-20 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-primary font-mono text-xs tracking-[0.15em] uppercase mb-3">
                Live Activity
              </p>
              <h2 className="text-[32px] font-semibold tracking-tight">
                Coding Stats<span className="gradient-text">.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <GitHubStats username="Shreyawangikar" />
              <LeetCodeStats username="shreya_wangikar" />
            </div>
          </div>
        </section>

        <ExploringSection />
        <ContactSection />
        <Footer />
        <ChatWidget />
        <CommandPalette />
      </main>
    </>
  );
};

export default Index;
