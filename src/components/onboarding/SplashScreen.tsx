import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/common/Logo";

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({
  isVisible,
  onComplete,
  duration = 50000,
}: SplashScreenProps) {
  const [showTagline, setShowTagline] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 800);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 5000);
    }, duration);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
    };
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-2xl animate-pulse delay-500" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: isExiting ? 1.2 : 1,
                rotate: 0,
                y: isExiting ? -20 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
              }}
              className="relative"
            >
              {/* Glow Effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 0 20px rgba(59, 130, 246, 0.1)",
                    "0 0 0 40px rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full"
              />

              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
                    <span className="text-white font-bold text-2xl md:text-3xl font-space">
                      R
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
              </div>
            </motion.div>

            {/* App Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Recap Storyteller
              </h1>
            </motion.div>

            {/* Tagline Animation */}
            <AnimatePresence>
              {showTagline && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center max-w-md mx-auto px-4"
                >
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium">
                    Transform your productivity with intelligent task management
                    and rich note-taking
                  </p>

                  {/* Feature Pills */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-2 mt-4"
                  >
                    {["Tasks", "Notes", "Calendar", "Analytics"].map(
                      (feature, index) => (
                        <motion.span
                          key={feature}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.3,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-3">
                Loading your workspace...
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
