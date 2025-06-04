import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecapTone =
  | "formal"
  | "friendly"
  | "resume-style"
  | "minimal"
  | "reflective";
export type RecapTarget =
  | "daily-standup"
  | "weekly-report"
  | "monthly-report"
  | "career-highlight"
  | "reflection";
export type RecapFormat = "markdown" | "plain-text" | "html";

export interface SavedRecap {
  id: string;
  title: string;
  content: string;
  dateRange: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  tone: RecapTone;
  format: RecapFormat;
  target: RecapTarget;
  includeNotes: boolean;
  taskStatusFilter: string[]; // ["completed", "pending", "carried-over", "all"]
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface RecapGenerationConfig {
  dateRange: {
    start: string;
    end: string;
  };
  tone: RecapTone;
  format: RecapFormat;
  target: RecapTarget;
  includeNotes: boolean;
  taskStatusFilter: string[];
}

interface RecapState {
  // Saved recaps
  savedRecaps: SavedRecap[];

  // Current generation config
  currentConfig: RecapGenerationConfig;

  // Generated content (before saving)
  generatedContent: string;
  isGenerating: boolean;

  // Library filters
  librarySearch: string;
  libraryFilters: {
    tags: string[];
    dateRange: { start: string; end: string } | null;
    tone: RecapTone | null;
    target: RecapTarget | null;
  };

  // Actions
  saveRecap: (
    recap: Omit<SavedRecap, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateRecap: (id: string, updates: Partial<SavedRecap>) => void;
  deleteRecap: (id: string) => void;
  getRecapById: (id: string) => SavedRecap | undefined;

  // Generation
  setGenerationConfig: (config: Partial<RecapGenerationConfig>) => void;
  setGeneratedContent: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  clearGeneratedContent: () => void;

  // Library management
  setLibrarySearch: (search: string) => void;
  setLibraryFilters: (filters: Partial<RecapState["libraryFilters"]>) => void;
  getFilteredRecaps: () => SavedRecap[];

  // Future cloud storage support
  syncToCloud?: () => Promise<void>;
  syncFromCloud?: () => Promise<void>;
}

const defaultConfig: RecapGenerationConfig = {
  dateRange: {
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  },
  tone: "friendly",
  format: "markdown",
  target: "daily-standup",
  includeNotes: true,
  taskStatusFilter: ["all"],
};

export const useRecapStore = create<RecapState>()(
  persist(
    (set, get) => ({
      // Initial state
      savedRecaps: [],
      currentConfig: defaultConfig,
      generatedContent: "",
      isGenerating: false,
      librarySearch: "",
      libraryFilters: {
        tags: [],
        dateRange: null,
        tone: null,
        target: null,
      },

      // Recap management
      saveRecap: (recap) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const savedRecap: SavedRecap = {
          ...recap,
          id,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          savedRecaps: [savedRecap, ...state.savedRecaps],
        }));

        return id;
      },

      updateRecap: (id, updates) => {
        set((state) => ({
          savedRecaps: state.savedRecaps.map((recap) =>
            recap.id === id
              ? { ...recap, ...updates, updatedAt: new Date().toISOString() }
              : recap
          ),
        }));
      },

      deleteRecap: (id) => {
        set((state) => ({
          savedRecaps: state.savedRecaps.filter((recap) => recap.id !== id),
        }));
      },

      getRecapById: (id) => {
        return get().savedRecaps.find((recap) => recap.id === id);
      },

      // Generation
      setGenerationConfig: (config) => {
        set((state) => ({
          currentConfig: { ...state.currentConfig, ...config },
        }));
      },

      setGeneratedContent: (content) => {
        set({ generatedContent: content });
      },

      setIsGenerating: (isGenerating) => {
        set({ isGenerating });
      },

      clearGeneratedContent: () => {
        set({ generatedContent: "" });
      },

      // Library management
      setLibrarySearch: (search) => {
        set({ librarySearch: search });
      },

      setLibraryFilters: (filters) => {
        set((state) => ({
          libraryFilters: { ...state.libraryFilters, ...filters },
        }));
      },

      getFilteredRecaps: () => {
        const { savedRecaps, librarySearch, libraryFilters } = get();

        return savedRecaps.filter((recap) => {
          // Search filter
          if (
            librarySearch &&
            !recap.title.toLowerCase().includes(librarySearch.toLowerCase()) &&
            !recap.content.toLowerCase().includes(librarySearch.toLowerCase())
          ) {
            return false;
          }

          // Tag filter
          if (
            libraryFilters.tags.length > 0 &&
            !libraryFilters.tags.some((tag) => recap.tags.includes(tag))
          ) {
            return false;
          }

          // Date range filter
          if (libraryFilters.dateRange) {
            if (
              recap.dateRange.end < libraryFilters.dateRange.start ||
              recap.dateRange.start > libraryFilters.dateRange.end
            ) {
              return false;
            }
          }

          // Tone filter
          if (libraryFilters.tone && recap.tone !== libraryFilters.tone) {
            return false;
          }

          // Target filter
          if (libraryFilters.target && recap.target !== libraryFilters.target) {
            return false;
          }

          return true;
        });
      },

      // Future cloud storage (placeholder)
      syncToCloud: async () => {
        // TODO: Implement when backend is ready
        console.log("Cloud sync not yet implemented");
      },

      syncFromCloud: async () => {
        // TODO: Implement when backend is ready
        console.log("Cloud sync not yet implemented");
      },
    }),
    {
      name: "recap-storage",
      partialize: (state) => ({
        savedRecaps: state.savedRecaps,
        currentConfig: state.currentConfig,
      }),
    }
  )
);
