import { create } from "zustand";
import { Task } from "@/types/task";

interface ModalState {
  isAddTaskOpen: boolean;
  isViewTaskOpen: boolean;
  isEditTaskOpen: boolean;
  isAddNoteOpen: boolean;
  isDeleteTaskOpen: boolean;
  selectedTask: Task | null;
  
  openAddTask: () => void;
  closeAddTask: () => void;
  openViewTask: (task: Task) => void;
  closeViewTask: () => void;
  openEditTask: (task: Task) => void;
  closeEditTask: () => void;
  openAddNote: (task: Task) => void;
  closeAddNote: () => void;
  openDeleteTask: (task: Task) => void;
  closeDeleteTask: () => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isAddTaskOpen: false,
  isViewTaskOpen: false,
  isEditTaskOpen: false,
  isAddNoteOpen: false,
  isDeleteTaskOpen: false,
  selectedTask: null,

  openAddTask: () => set({ isAddTaskOpen: true }),
  closeAddTask: () => set({ isAddTaskOpen: false }),
  
  openViewTask: (task) => set({ isViewTaskOpen: true, selectedTask: task }),
  closeViewTask: () => set({ isViewTaskOpen: false, selectedTask: null }),
  
  openEditTask: (task) => set({ isEditTaskOpen: true, selectedTask: task }),
  closeEditTask: () => set({ isEditTaskOpen: false, selectedTask: null }),
  
  openAddNote: (task) => set({ isAddNoteOpen: true, selectedTask: task }),
  closeAddNote: () => set({ isAddNoteOpen: false, selectedTask: null }),
  
  openDeleteTask: (task) => set({ isDeleteTaskOpen: true, selectedTask: task }),
  closeDeleteTask: () => set({ isDeleteTaskOpen: false, selectedTask: null }),
  
  closeAllModals: () => set({
    isAddTaskOpen: false,
    isViewTaskOpen: false,
    isEditTaskOpen: false,
    isAddNoteOpen: false,
    isDeleteTaskOpen: false,
    selectedTask: null,
  }),
})); 