import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/types/task";
import { mockTasks } from "@/data/mockTasks";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: string) => Task[];
  getTasksForDateRange: (startDate: string, endDate: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
  linkTaskToNote: (taskId: string, noteId: string) => void;
  unlinkTaskFromNote: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      getTasksForDate: (date) => {
        return get().tasks.filter((task) => task.date === date);
      },

      getTasksForDateRange: (startDate, endDate) => {
        const { tasks } = get();
        return tasks.filter((task) => {
          return task.date >= startDate && task.date <= endDate;
        });
      },

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      linkTaskToNote: (taskId, noteId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, linkedNoteId: noteId, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      unlinkTaskFromNote: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, linkedNoteId: null, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },
    }),
    {
      name: "task-storage",
    }
  )
);
