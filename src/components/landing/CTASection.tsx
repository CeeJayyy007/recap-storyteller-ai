
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Monitor, Smartphone, Globe } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight font-poppins">
            Stop forgetting.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start recapping.
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-nunito">
            Daily streaks. Weekly wins. Career clarity. It starts with one recap.
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-600 dark:text-gray-300 font-nunito">Desktop</span>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-600 dark:text-gray-300 font-nunito">Mobile</span>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <Globe className="w-8 h-8 text-green-600 dark:text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-600 dark:text-gray-300 font-nunito">Web</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium font-nunito shadow-xl group"
            >
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Free - No Credit Card
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-medium font-nunito border-2 group"
            >
              Try Demo Mode
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 font-nunito">
            Join 1,000+ professionals tracking their progress
          </p>
        </div>
      </div>
    </section>
  );
};
