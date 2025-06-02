import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Taskbar } from "@/components/tasks/Taskbar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isTaskbarVisible, setIsTaskbarVisible] = useState(() => {
    const saved = localStorage.getItem("taskbar-visible");
    return saved ? JSON.parse(saved) : false;
  });

  const handleTaskbarToggle = (isVisible: boolean) => {
    setIsTaskbarVisible(isVisible);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        userAvatar="/placeholder-avatar.jpg"
        userName="John Doe"
        onTaskbarToggle={handleTaskbarToggle}
      />
      <Taskbar isVisible={isTaskbarVisible} />
      <main
        className={cn(
          "pb-20 md:pb-0 min-h-screen transition-all duration-200 flex-1",
          isTaskbarVisible ? "md:ml-[340px]" : "md:ml-5"
        )}
      >
        {children}
      </main>
    </div>
  );
}
