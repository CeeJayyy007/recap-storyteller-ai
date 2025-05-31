export const ProblemSection = () => {
  return (
    <section className="py-16 bg-gray-50/70 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6 group">
              <div className="text-6xl group-hover:scale-110 transition-transform">
                😩
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Always scrambling to remember what you did yesterday?
              </h3>
            </div>

            <div className="space-y-6 group">
              <div className="text-6xl group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Stuck writing weekly standups or resume updates from scratch?
              </h3>
            </div>

            <div className="space-y-6 group">
              <div className="text-6xl group-hover:scale-110 transition-transform">
                🗂️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Struggling to show proof of your growth at work?
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-nunito">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                🎯 Recap solves this
              </span>{" "}
              with a simple habit: track what you do daily, and let AI write the
              rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
