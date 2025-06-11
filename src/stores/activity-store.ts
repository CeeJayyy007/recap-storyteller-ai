import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityLog {
  id: string;
  type:
    | "task_created"
    | "task_updated"
    | "task_completed"
    | "task_deleted"
    | "note_created"
    | "note_updated"
    | "note_deleted";
  description: string;
  icon: string;
  timestamp: string;
  metadata?: {
    taskId?: string;
    noteId?: string;
    taskTitle?: string;
    noteTitle?: string;
  };
}

interface ActivityState {
  activities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  getRecentActivities: (limit?: number) => ActivityLog[];
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activity) => {
        const newActivity: ActivityLog = {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 100), // Keep last 100 activities
        }));
      },

      getRecentActivities: (limit = 10) => {
        return get().activities.slice(0, limit);
      },

      clearActivities: () => {
        set({ activities: [] });
      },
    }),
    {
      name: "activity-storage",
    }
  )
);

// Helper functions to create specific activity types
export const createTaskActivity = (
  type: "task_created" | "task_updated" | "task_completed" | "task_deleted",
  taskTitle: string,
  taskId: string
) => {
  const icons = {
    task_created: "➕",
    task_updated: "✏️",
    task_completed: "✅",
    task_deleted: "🗑️",
  };

  const descriptions = {
    task_created: `Added new task: "${taskTitle}"`,
    task_updated: `Updated task: "${taskTitle}"`,
    task_completed: `Completed task: "${taskTitle}"`,
    task_deleted: `Removed task: "${taskTitle}"`,
  };

  return {
    type,
    description: descriptions[type],
    icon: icons[type],
    metadata: { taskId, taskTitle },
  };
};

export const createNoteActivity = (
  type: "note_created" | "note_updated" | "note_deleted",
  noteTitle: string,
  noteId: string
) => {
  const icons = {
    note_created: "📝",
    note_updated: "✏️",
    note_deleted: "🗑️",
  };

  const descriptions = {
    note_created: `Created new note: "${noteTitle}"`,
    note_updated: `Updated note: "${noteTitle}"`,
    note_deleted: `Deleted note: "${noteTitle}"`,
  };

  return {
    type,
    description: descriptions[type],
    icon: icons[type],
    metadata: { noteId, noteTitle },
  };
};
