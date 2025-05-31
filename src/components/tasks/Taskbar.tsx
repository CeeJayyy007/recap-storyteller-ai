import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TaskbarProps {
  isVisible: boolean;
}

export function Taskbar({ isVisible }: TaskbarProps) {
  if (!isVisible) return null;

  return (
    <aside className="hidden md:flex fixed left-20 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-border flex-col z-40">
      <div className="flex-1 p-4">
        {/* Taskbar content will go here */}
        <div className="text-sm text-muted-foreground">
          Taskbar content coming soon...
        </div>
      </div>
    </aside>
  );
}
