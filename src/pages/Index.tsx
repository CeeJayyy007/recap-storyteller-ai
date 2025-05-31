import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { CTASection } from "@/components/landing/CTASection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { NavigationHeader } from "@/components/landing/NavigationHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors relative">
      {/* Light mode background pattern - made more visible */}
      <div className="absolute inset-0 dark:hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 10% 60%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
            `,
            backgroundSize:
              "600px 600px, 700px 700px, 800px 800px, 650px 650px, 550px 550px",
            backgroundPosition: "0% 0%, 100% 100%, 50% 0%, 0% 50%, 100% 20%",
            filter: "blur(30px)",
          }}
        />
        {/* Additional subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        <NavigationHeader />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <SocialProofSection />
        <CTASection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
