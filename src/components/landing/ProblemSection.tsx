
export const ProblemSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl">😩</div>
              <h3 className="text-xl font-bold text-gray-900">
                Always scrambling to remember what you did yesterday?
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl">📄</div>
              <h3 className="text-xl font-bold text-gray-900">
                Stuck writing weekly standups or resume updates from scratch?
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl">🗂️</div>
              <h3 className="text-xl font-bold text-gray-900">
                Struggling to show proof of your growth at work?
              </h3>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              <span className="text-blue-600 font-semibold">🎯 Recap solves this</span> with a simple habit: track what you do daily, and let AI write the rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
