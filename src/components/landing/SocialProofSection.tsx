import { Star } from "lucide-react";

export const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      avatar: "SC",
      content:
        "Recap helped me prove my value during performance reviews — no more guessing what I did last month! The AI summaries are incredibly accurate.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Product Designer",
      avatar: "MJ",
      content:
        "Honestly, this makes standups a breeze. I just show the AI summary and my team knows exactly what I've been working on.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gray-50/70 dark:bg-slate-900 transition-colors"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Wall of Love
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-nunito">
            Discover what our happy users have to say
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold font-poppins">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white font-poppins">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-nunito">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-nunito">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Example Recap Preview */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-poppins">
              📋 Example AI-Generated Recap
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-3 font-nunito">
              <p className="font-medium">Today's Highlights:</p>
              <ul className="space-y-2 pl-4">
                <li>✅ Completed user authentication system implementation</li>
                <li>📝 Documented API endpoints for team review</li>
                <li>🐛 Fixed 3 critical bugs in payment processing</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Generated from 3 tasks + 1 note in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
