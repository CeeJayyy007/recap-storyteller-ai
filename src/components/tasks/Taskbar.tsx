import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Calendar } from "./Calendar";
import { SearchInput } from "../common/SearchInput";
import { useDateStore } from "@/stores/date-store";

interface TaskbarProps {
  isVisible: boolean;
}

export function Taskbar({ isVisible }: TaskbarProps) {
  const { goToToday } = useDateStore();

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  if (!isVisible) return null;

  return (
    <aside className="hidden md:flex fixed left-20 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-border flex-col z-40">
      <div className="flex-1 p-4">
        {/* Calendar date picker */}
        <Calendar />

        {/* Search input */}
        <SearchInput onSearch={handleSearch} />

        {/* Tasks section */}
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-muted-foreground">Tasks</h3>
          <PlusIcon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
