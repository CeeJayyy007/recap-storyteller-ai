import { useEffect } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Taskbar } from "@/components/tasks/Taskbar";
import { useTaskbarToggle } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTaskbarStore } from "@/stores/taskbar-store";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isVisible, toggleVisibility } = useTaskbarStore();

  const handleToggleTaskbar = () => {
    toggleVisibility();
    toast.info(isVisible ? "Taskbar hidden" : "Taskbar shown", {
      duration: 1500,
    });
  };

  // Add keyboard shortcut for taskbar toggle (Ctrl+B)
  useTaskbarToggle(handleToggleTaskbar);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        onTaskbarToggle={handleToggleTaskbar}
        isTaskbarVisible={isVisible}
      />
      <Taskbar isVisible={isVisible} />
      <main
        className={cn(
          "pb-20 md:pb-0 min-h-screen transition-all duration-200 flex-1",
          isVisible ? "md:ml-[340px]" : "md:ml-5"
        )}
      >
        {children}
      </main>
    </div>
  );
}
