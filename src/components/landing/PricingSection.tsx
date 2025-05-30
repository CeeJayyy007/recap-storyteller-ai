
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple pricing for everyone
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you're ready for more features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🆓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Unlimited tasks and notes</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Daily recaps</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>AI-generated standup summaries</span>
              </li>
            </ul>
            
            <Button className="w-full" variant="outline">
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-600 rounded-xl p-8 shadow-xl border-2 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">💼</div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold text-white mb-4">
                $7<span className="text-lg">/mo</span>
              </div>
              <p className="text-blue-100">For serious professionals</p>
            </div>
            
            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Weekly and career recaps</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>PDF, Markdown, and resume exports</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Cloud sync + backup</span>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
