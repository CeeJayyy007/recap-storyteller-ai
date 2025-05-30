
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track your progress.{" "}
              <span className="text-blue-600">Tell your story.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Recap is your daily workflow companion that turns tasks and notes into powerful AI-generated summaries — perfect for standups, career portfolios, and resumes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Start Tracking Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Try a Sample Recap
            </Button>
          </div>
        </div>

        {/* Right Content - App Mockup */}
        <div className="relative">
          <div className="relative mx-auto">
            {/* Desktop Mockup */}
            <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-3 hover:rotate-1 transition-transform duration-300">
              <div className="bg-gray-100 rounded-t-lg h-8 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="bg-white p-6 rounded-b-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-semibold mb-2">AI Generated Summary:</div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-200 rounded w-full"></div>
                      <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Mockup */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-2 w-32 transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
              <div className="bg-gray-900 rounded-xl h-24 flex flex-col justify-between p-2">
                <div className="flex justify-center">
                  <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-600 rounded w-full"></div>
                  <div className="h-1 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
