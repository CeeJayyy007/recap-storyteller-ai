import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-purple-100 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 py-16 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <a href="#home" className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                  <span className="text-white font-bold text-lg font-space">
                    R
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </a>
              <span className="font-bold text-xl text-gray-900 dark:text-white font-space">
                Recap
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-nunito">
              Turn your daily work into career wins with AI-powered progress
              tracking.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">
              Product
            </h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="#features"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">
              Company
            </h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="/help"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors font-nunito"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-nunito">
              Get the latest updates and tips for better progress tracking.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 font-nunito"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-nunito">
            © 2025 Recap, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
