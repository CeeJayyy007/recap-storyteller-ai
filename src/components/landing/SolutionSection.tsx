
import { BarChart3, Zap, Shield, Palette, Bot, Headphones } from "lucide-react";

export const SolutionSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "AI-Powered Summaries",
      description: "Let Recap write your daily, weekly, or career recaps in your tone and voice with advanced AI technology."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Task-first Workflow", 
      description: "Mark tasks as completed, pending, or carried over — all built around daily momentum and productivity."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Linked Notes & Context",
      description: "Link multiple tasks to notes. Track insights, lessons, mistakes — all searchable and organized later."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Progress Timeline",
      description: "See your personal timeline of wins, effort, and growth across time with beautiful visualizations."
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Portfolio & Resume Ready",
      description: "Export professional-style recaps and achievements in one click for career advancement."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Smart Sync",
      description: "Your data syncs across all devices with intelligent backup and version control."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-nunito">
            Empowering your workflow with cutting-edge AI tools and intuitive functionality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group hover:scale-105"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-6 flex justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-poppins">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-nunito">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
