
import { Button } from "@/components/ui/button";

export const NavigationHeader = () => {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-gray-900">Recap</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              FAQ
            </a>
          </nav>

          {/* CTA Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
            Call To Action
          </Button>
        </div>
      </div>
    </header>
  );
};
