
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Track your progress.{" "}
            <br />
            <span className="text-gray-900">Tell your story.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Recap is your daily workflow companion that turns tasks and notes into powerful AI-generated summaries — perfect for standups, career portfolios, and resumes.
          </p>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg"
          >
            Call To Action
          </Button>
        </div>
      </div>
    </section>
  );
};
