
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
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <SocialProofSection />
      <CTASection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
