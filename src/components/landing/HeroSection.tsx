import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32  dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium font-nunito">
              ✨ AI-Powered Progress Tracking
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6 font-poppins">
            Track your progress. <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Tell your story.
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-nunito">
            Recap is your daily workflow companion that turns tasks and notes
            into powerful AI-generated summaries — perfect for standups, career
            portfolios, and resumes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium font-nunito shadow-xl hover:shadow-2xl transition-all group"
            >
              Start Tracking Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-medium font-nunito border-2 hover:bg-gray-50 dark:hover:bg-slate-800 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Try Sample Recap
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
