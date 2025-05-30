
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-nunito">
            Transparent and flexible options tailored to suit your needs.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className="text-gray-600 dark:text-gray-300 font-nunito">Monthly</span>
            <div className="relative">
              <div className="w-12 h-6 bg-blue-600 rounded-full cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
              </div>
            </div>
            <span className="text-gray-900 dark:text-white font-medium font-nunito">Yearly</span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium font-nunito">SAVE 20%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 text-center transition-colors">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-poppins">Free</h3>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">$0</div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 font-nunito">Perfect for getting started with daily tracking.</p>
            
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-nunito">Unlimited tasks and notes</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-nunito">Daily AI-generated recaps</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-nunito">Basic standup summaries</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-nunito">7 day data retention</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full font-nunito border-2">
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold font-nunito flex items-center">
              <Star className="w-4 h-4 mr-1" />
              MOST POPULAR
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4 font-poppins">Pro</h3>
            <div className="text-5xl font-bold text-white mb-2 font-poppins">$7</div>
            <p className="text-blue-100 mb-8 font-nunito">For professionals who want the full experience.</p>
            
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100 font-nunito">Everything in Free, plus:</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100 font-nunito">Weekly and career recaps</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100 font-nunito">PDF, Markdown & resume exports</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100 font-nunito">Unlimited cloud sync & backup</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100 font-nunito">Priority support</span>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-nunito font-semibold">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
