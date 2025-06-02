import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskbarState {
  sectionCollapsed: {
    carriedOver: boolean;
    pending: boolean;
    completed: boolean;
  };
  toggleSection: (section: 'carriedOver' | 'pending' | 'completed') => void;
}

export const useTaskbarStore = create<TaskbarState>()(
  persist(
    (set) => ({
      sectionCollapsed: {
        carriedOver: false, // Start expanded
        pending: false,     // Start expanded  
        completed: false,   // Start expanded
      },

      toggleSection: (section) => {
        set((state) => ({
          sectionCollapsed: {
            ...state.sectionCollapsed,
            [section]: !state.sectionCollapsed[section],
          },
        }));
      },
    }),
    {
      name: "taskbar-storage",
    }
  )
); 