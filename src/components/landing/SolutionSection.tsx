
export const SolutionSection = () => {
  const features = [
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Get instant insights into your daily productivity and track progress with actionable data-driven decisions."
    },
    {
      icon: "⚙️",
      title: "Scalable Infrastructure", 
      description: "Scale effortlessly to meet growing demands with our flexible and robust infrastructure that adapts to your needs."
    },
    {
      icon: "🔒",
      title: "Advanced Security",
      description: "Rest easy knowing your data is protected with top-tier security measures and compliance standards."
    },
    {
      icon: "🎨",
      title: "Intuitive Interface",
      description: "Enjoy a user-friendly and intuitive interface for seamless navigation and boost productivity."
    },
    {
      icon: "🤖",
      title: "Automated Workflows",
      description: "Optimize your processes with intelligent workflows, saving time and reducing manual effort."
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Get round-the-clock support from our dedicated team to ensure a smooth experience."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering your business with cutting-edge tools and functionalities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
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
