import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  FileText,
  Target,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  Brain,
  Lightbulb,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  features: string[];
  tips: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Recap Storyteller",
    description: "Your personal productivity powerhouse",
    detailedDescription:
      "Transform the way you manage tasks, take notes, and organize your life with our intelligent productivity platform.",
    icon: Sparkles,
    gradient: "from-blue-500 to-purple-600",
    features: [
      "Smart task management",
      "Rich note-taking",
      "Calendar integration",
      "Analytics dashboard",
    ],
    tips: [
      "Start with creating your first task",
      "Explore the dashboard for insights",
    ],
  },
  {
    id: "tasks",
    title: "Master Your Tasks",
    description: "Intelligent task management that adapts to you",
    detailedDescription:
      "Create, organize, and track tasks with automatic carry-over logic, status-based organization, and seamless note integration.",
    icon: Target,
    gradient: "from-green-500 to-emerald-600",
    features: [
      "Auto carry-over for pending tasks",
      "Status-based color coding",
      "Task-note linking",
      "Date-based organization",
    ],
    tips: [
      "Use tags to categorize tasks",
      "Link notes to tasks for context",
      "Tasks automatically carry over if not completed",
    ],
  },
  {
    id: "notes",
    title: "Rich Note-Taking",
    description: "Capture thoughts with powerful rich text editing",
    detailedDescription:
      "Create beautiful, structured notes with our advanced editor supporting headings, lists, formatting, and multimedia content.",
    icon: FileText,
    gradient: "from-purple-500 to-pink-600",
    features: [
      "Rich text formatting",
      "Auto-save functionality",
      "Task linking",
      "Dynamic titles",
    ],
    tips: [
      "Notes auto-save as you type",
      "Link multiple tasks to one note",
      "Use headings for better organization",
    ],
  },
  {
    id: "calendar",
    title: "Time & Calendar",
    description: "Visualize your productivity journey",
    detailedDescription:
      "Navigate through time with our intuitive calendar system, track daily progress, and maintain context across dates.",
    icon: Calendar,
    gradient: "from-orange-500 to-red-600",
    features: [
      "Visual date navigation",
      "Task filtering by date",
      "Progress tracking",
      "Historical context",
    ],
    tips: [
      "Click any date to see tasks/notes",
      "Use 'Today' button for quick navigation",
      "Calendar shows task completion status",
    ],
  },
  {
    id: "analytics",
    title: "Insights & Analytics",
    description: "Understand your productivity patterns",
    detailedDescription:
      "Gain insights into your productivity with detailed analytics, completion rates, and progress tracking across time.",
    icon: BarChart3,
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "Weekly completion rates",
      "Task analytics",
      "Progress insights",
      "Productivity metrics",
    ],
    tips: [
      "Check weekly trends on dashboard",
      "Monitor completion rates",
      "Track carried-over tasks",
    ],
  },
  {
    id: "tips",
    title: "Pro Tips & Shortcuts",
    description: "Maximize your productivity potential",
    detailedDescription:
      "Learn advanced features and shortcuts to become a productivity master with Recap Storyteller.",
    icon: Lightbulb,
    gradient: "from-yellow-500 to-orange-600",
    features: [
      "Keyboard shortcuts",
      "Advanced workflows",
      "Integration tips",
      "Best practices",
    ],
    tips: [
      "Ctrl+B toggles taskbar",
      "Use search for quick navigation",
      "Customize your workspace",
    ],
  },
];

interface OnboardingFlowProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingFlow({
  isVisible,
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === "forward" ? -300 : 300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-4xl max-h-[95vh] overflow-hidden"
          >
            <Card className="border-none shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <CardContent className="p-0">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((currentStep + 1) / onboardingSteps.length) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`h-full bg-gradient-to-r ${step.gradient} rounded-r-full`}
                  />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1">
                      {currentStep + 1} of {onboardingSteps.length}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Getting Started
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skip Tour
                  </Button>
                </div>

                {/* Content */}
                <div className="relative overflow-hidden min-h-[550px]">
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      }}
                      className="absolute inset-0 flex flex-col lg:flex-row items-center gap-8 p-6 pt-8"
                    >
                      {/* Left Side - Icon and Visual */}
                      <div className="flex-1 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.2,
                            duration: 0.8,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="relative"
                        >
                          {/* Animated Background */}
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className={`absolute inset-0 w-40 h-40 bg-gradient-to-r ${step.gradient} rounded-full blur-3xl opacity-30`}
                          />

                          {/* Icon Container */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-32 h-32 flex items-center justify-center bg-gradient-to-r ${step.gradient} rounded-3xl shadow-2xl`}
                          >
                            <Icon className="w-16 h-16 text-white" />
                          </motion.div>

                          {/* Floating Elements */}
                          <motion.div
                            animate={{
                              y: [-10, 10, -10],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute -top-6 -right-6 w-6 h-6 bg-yellow-400 rounded-full"
                          />
                          <motion.div
                            animate={{
                              y: [10, -10, 10],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="absolute -bottom-4 -left-4 w-4 h-4 bg-blue-400 rounded-full"
                          />
                        </motion.div>
                      </div>

                      {/* Right Side - Content */}
                      <div className="flex-1 space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                            {step.title}
                          </h2>
                          <p className="text-xl text-muted-foreground mb-4">
                            {step.description}
                          </p>
                          <p className="text-base leading-relaxed">
                            {step.detailedDescription}
                          </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="space-y-3"
                        >
                          <h3 className="font-semibold text-lg">
                            Key Features:
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {step.features.map((feature, index) => (
                              <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.5 + index * 0.1,
                                  duration: 0.3,
                                }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Tips */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="space-y-2"
                        >
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Pro Tips:
                          </h3>
                          {step.tips.map((tip, index) => (
                            <motion.div
                              key={tip}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.7 + index * 0.1,
                                duration: 0.3,
                              }}
                              className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
                            >
                              <Zap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{tip}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex justify-between items-center p-6 pt-0"
                >
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {onboardingSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: index === currentStep ? 1.2 : 1,
                          opacity: index === currentStep ? 1 : 0.5,
                        }}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentStep
                            ? "bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    className={`flex items-center gap-2 bg-gradient-to-r ${step.gradient} hover:opacity-90 transition-opacity`}
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        Get Started
                        <Sparkles className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
