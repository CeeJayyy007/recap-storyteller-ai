
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";

export const NavigationHeader = () => {
  return (
    <header className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <span className="text-white font-bold text-lg font-space">R</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white font-space">Recap</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Button & Dark Mode Toggle */}
          <div className="flex items-center space-x-3">
            <DarkModeToggle />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 text-sm font-medium font-nunito shadow-lg">
              Start Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
