
export const SocialProofSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Wall of Love
          </h2>
          <p className="text-lg text-gray-600">
            Discover what our happy users have to say
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JD</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Jane Doe</div>
                <div className="text-sm text-gray-600">Lead Executive</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "I'm implementing the SaaS platform, our productivity has increased. It's like having a whole team of superheroes on my business."
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">MC</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Michael Chan</div>
                <div className="text-sm text-gray-600">E-commerce Executive</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "This SaaS platform transformed my ecom smooth running operation. Now I focus on new business opportunities!"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
