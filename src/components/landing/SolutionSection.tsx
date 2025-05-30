
import { Check, Calendar, FileText, Star, ArrowRight } from "lucide-react";

export const SolutionSection = () => {
  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Summaries",
      description: "Let Recap write your daily, weekly, or career recaps in your tone and voice."
    },
    {
      icon: "✅",
      title: "Task-first Workflow",
      description: "Mark tasks as completed, pending, or carried over — all built around daily momentum."
    },
    {
      icon: "📝",
      title: "Linked Notes That Add Context",
      description: "Link multiple tasks to a note. Track insights, lessons, mistakes — all searchable later."
    },
    {
      icon: "📈",
      title: "Progress Timeline",
      description: "See your personal timeline of wins, effort, and growth across time."
    },
    {
      icon: "📤",
      title: "Portfolio & Resume Ready",
      description: "Export professional-style recaps and achievements in one click."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your workflow, supercharged with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recap fits seamlessly into your daily routine and provides clear value from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
