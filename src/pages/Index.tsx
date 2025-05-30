
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
      {/* Light mode background pattern */}
      <div className="absolute inset-0 dark:hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 0% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)
            `,
            backgroundSize: '800px 800px, 600px 600px, 1000px 1000px, 700px 700px',
            backgroundPosition: '0% 0%, 100% 100%, 50% 0%, 0% 50%',
            filter: 'blur(40px)'
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
