import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, getTaskStatusForDate } from "@/types/task";
import { mockTasks } from "@/data/mockTasks";
import { useActivityStore, createTaskActivity } from "@/stores/activity-store";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, completionDate?: string) => void;
  uncompleteTask: (id: string) => void;
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

        // Log activity
        const activityStore = useActivityStore.getState();
        activityStore.addActivity(
          createTaskActivity("task_created", newTask.title, newTask.id)
        );

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

      completeTask: (id, completionDate) => {
        const completedAt = completionDate
          ? new Date(completionDate).toISOString()
          : new Date().toISOString();

        // Get task details for logging
        const task = get().getTaskById(id);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completedAt, updatedAt: new Date().toISOString() }
              : task
          ),
        }));

        // Log activity
        if (task) {
          const activityStore = useActivityStore.getState();
          activityStore.addActivity(
            createTaskActivity("task_completed", task.title, task.id)
          );
        }
      },

      uncompleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completedAt: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      getTasksForDate: (date) => {
        const { tasks } = get();
        return tasks.filter((task) => {
          const status = getTaskStatusForDate(task, date);
          return status !== null;
        });
      },

      getTasksForDateRange: (startDate, endDate) => {
        const { tasks } = get();
        return tasks.filter((task) => {
          const createdDate = task.createdAt.split("T")[0];
          const completedDate = task.completedAt
            ? task.completedAt.split("T")[0]
            : null;

          // Task overlaps with date range if:
          // - Created before or during range AND
          // - Not completed OR completed during or after range start
          return (
            createdDate <= endDate &&
            (!completedDate || completedDate >= startDate)
          );
        });
      },

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      linkTaskToNote: (taskId, noteId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  linkedNoteId: noteId,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      unlinkTaskFromNote: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  linkedNoteId: null,
                  updatedAt: new Date().toISOString(),
                }
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
