import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { SignupDialog } from "./SignupDialog";
import { Logo } from "@/components/common/Logo";
import { useNavigate } from "react-router-dom";

export const NavigationHeader = () => {
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const handleSignupClick = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a
                href="#home"
                className="flex items-center space-x-3 cursor-pointer"
              >
                <Logo />
                <span className="font-bold text-2xl text-gray-900 dark:text-white font-space">
                  Recap
                </span>
              </a>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <a
                  href="#features"
                  className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 group"
                >
                  <span className="relative z-10">Features</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#testimonials"
                  className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 group"
                >
                  <span className="relative z-10">Testimonials</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#pricing"
                  className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 group"
                >
                  <span className="relative z-10">Pricing</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                {/* <a
                  href="#faq"
                  className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium font-nunito transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 group"
                >
                  <span className="relative z-10">FAQ</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a> */}
              </nav>

              {/* CTA Buttons & Dark Mode Toggle */}
              <div className="flex items-center space-x-3">
                <DarkModeToggle />
                <Button
                  variant="ghost"
                  onClick={handleLoginClick}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-nunito hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignupClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 text-sm font-medium font-nunito shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add top padding to main content to account for floating header */}
      <div className="h-24"></div>

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSignupClick={handleSignupClick}
      />
      <SignupDialog
        open={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};
