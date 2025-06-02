import { create } from "zustand";
import { Task } from "@/types/task";
import { Note } from "@/types/note";

interface ModalState {
  isAddTaskOpen: boolean;
  isViewTaskOpen: boolean;
  isEditTaskOpen: boolean;
  isAddNoteOpen: boolean;
  isDeleteTaskOpen: boolean;
  isDeleteNoteOpen: boolean;
  isAddTaskToNoteOpen: boolean;
  isNoteInfoOpen: boolean;
  selectedTask: Task | null;
  selectedNote: Note | null;
  isSearchOpen: boolean;
  searchQuery: string;
  searchResults: Task[];

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
  openDeleteNote: (note: Note) => void;
  closeDeleteNote: () => void;
  openAddTaskToNote: (note: Note) => void;
  closeAddTaskToNote: () => void;
  closeAllModals: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Task[]) => void;
  openNoteInfo: (note: Note) => void;
  closeNoteInfo: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isAddTaskOpen: false,
  isViewTaskOpen: false,
  isEditTaskOpen: false,
  isAddNoteOpen: false,
  isDeleteTaskOpen: false,
  isDeleteNoteOpen: false,
  isAddTaskToNoteOpen: false,
  isNoteInfoOpen: false,
  selectedTask: null,
  selectedNote: null,
  isSearchOpen: false,
  searchQuery: "",
  searchResults: [],

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

  openDeleteNote: (note) => set({ isDeleteNoteOpen: true, selectedNote: note }),
  closeDeleteNote: () => set({ isDeleteNoteOpen: false, selectedNote: null }),

  openAddTaskToNote: (note) =>
    set({ isAddTaskToNoteOpen: true, selectedNote: note }),
  closeAddTaskToNote: () =>
    set({ isAddTaskToNoteOpen: false, selectedNote: null }),

  openNoteInfo: (note) => set({ isNoteInfoOpen: true, selectedNote: note }),
  closeNoteInfo: () => set({ isNoteInfoOpen: false, selectedNote: null }),

  closeAllModals: () =>
    set({
      isAddTaskOpen: false,
      isViewTaskOpen: false,
      isEditTaskOpen: false,
      isAddNoteOpen: false,
      isDeleteTaskOpen: false,
      isDeleteNoteOpen: false,
      isAddTaskToNoteOpen: false,
      isNoteInfoOpen: false,
      selectedTask: null,
      selectedNote: null,
    }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () =>
    set({ isSearchOpen: false, searchQuery: "", searchResults: [] }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
}));
