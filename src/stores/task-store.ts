import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // ISO date string
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
  getTasksForDateRange: (startDate: Date, endDate: Date) => Task[];
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
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      getTasksForDate: (date) => {
        const dateString = date.toISOString().split("T")[0];
        return get().tasks.filter((task) => task.date === dateString);
      },

      getTasksForDateRange: (startDate, endDate) => {
        const { tasks } = get();
        return tasks.filter((task) => {
          const taskDate = new Date(task.date);
          return taskDate >= startDate && taskDate <= endDate;
        });
      },
    }),
    {
      name: "task-storage",
    }
  )
);
