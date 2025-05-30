
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Transparent and flexible options tailored to suit your needs.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className="text-gray-600">Monthly</span>
            <div className="relative">
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
            </div>
            <span className="text-gray-900 font-medium">Yearly</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">SAVE 20%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Personal Plan */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">$19</div>
            <p className="text-gray-600 mb-8">Ideal for individual users and small teams.</p>
            
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Task Management</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Real-time Collaboration</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Basic Analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Mobile App Access</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full">
              Call To Action
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              MOST POPULAR
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-4">Pro</h3>
            <div className="text-4xl font-bold text-white mb-2">$39</div>
            <p className="text-gray-300 mb-8">For growing businesses and medium-sized teams.</p>
            
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Advanced Reporting</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Customizable Branding</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Enhanced Security</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Workflow Automation</span>
              </li>
            </ul>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Call To Action
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">$79</div>
            <p className="text-gray-600 mb-8">Tailored for large companies and enterprises.</p>
            
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Dedicated Account Manager</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Advanced Integrations</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Custom Solutions</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">24/7 Priority Support</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full">
              Call To Action
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
