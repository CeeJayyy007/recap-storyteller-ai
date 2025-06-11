import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/types/task";
import { useActivityStore, createTaskActivity } from "@/stores/activity-store";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksForDate: (date: string) => Task[];
  getTasksForDateRange: (startDate: string, endDate: string) => Task[];
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  searchTasksByTitle: (query: string) => Task[];
  unlinkTaskFromNote: (taskId: string) => void;
  linkTaskToNote: (taskId: string, noteId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // Log activity
        const activityStore = useActivityStore.getState();
        activityStore.addActivity(
          createTaskActivity("task_created", newTask.title, newTask.id)
        );

        return newTask;
      },

      updateTask: (id, updates) => {
        // Get task details for logging
        const task = get().getTaskById(id);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));

        // Log activity if title or description changed
        if (task && (updates.title || updates.description)) {
          const activityStore = useActivityStore.getState();
          activityStore.addActivity(
            createTaskActivity("task_updated", task.title, task.id)
          );
        }
      },

      deleteTask: (id) => {
        // Get task details before deletion for logging
        const task = get().getTaskById(id);

        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        // Log activity
        if (task) {
          const activityStore = useActivityStore.getState();
          activityStore.addActivity(
            createTaskActivity("task_deleted", task.title, task.id)
          );
        }
      },

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      getTasksForDate: (date) => {
        return get().tasks.filter((task) => {
          const taskDate = task.createdAt.split("T")[0];
          return taskDate === date;
        });
      },

      getTasksForDateRange: (startDate: string, endDate: string) => {
        return get().tasks.filter((task) => {
          const taskDate = task.createdAt.split("T")[0];
          return taskDate >= startDate && taskDate <= endDate;
        });
      },

      completeTask: (id) => {
        const task = get().getTaskById(id);
        if (!task) return;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));

        // Log activity
        const activityStore = useActivityStore.getState();
        activityStore.addActivity(
          createTaskActivity("task_completed", task.title, task.id)
        );
      },

      uncompleteTask: (id) => {
        const task = get().getTaskById(id);
        if (!task) return;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completedAt: null,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      searchTasksByTitle: (query) => {
        const { tasks } = get();
        if (!query.trim()) return tasks;

        return tasks.filter((task) =>
          task.title.toLowerCase().includes(query.toLowerCase())
        );
      },

      unlinkTaskFromNote: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, linkedNoteId: null } : task
          ),
        }));
      },

      linkTaskToNote: (taskId: string, noteId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, linkedNoteId: noteId } : task
          ),
        }));
      },
    }),
    {
      name: "task-storage",
    }
  )
);
