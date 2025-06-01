import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tag } from "@/types/tag";
import { mockTags } from "@/data/mockTags";

interface TagState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id" | "createdAt" | "updatedAt">) => Tag;
  updateTag: (id: string, updates: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
  getTagByName: (name: string) => Tag | undefined;
  searchTags: (query: string) => Tag[];
  getOrCreateTag: (name: string, color?: string) => Tag;
}

const generateTagColor = (): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: mockTags,

      addTag: (tag) => {
        const newTag: Tag = {
          ...tag,
          id: crypto.randomUUID(),
          color: tag.color || generateTagColor(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return newTag;
      },

      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id
              ? { ...tag, ...updates, updatedAt: new Date().toISOString() }
              : tag
          ),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },

      getTagById: (id) => {
        return get().tags.find((tag) => tag.id === id);
      },

      getTagByName: (name) => {
        return get().tags.find(
          (tag) => tag.name.toLowerCase() === name.toLowerCase()
        );
      },

      searchTags: (query) => {
        const { tags } = get();
        if (!query.trim()) return tags;

        return tags.filter((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        );
      },

      getOrCreateTag: (name, color) => {
        const { getTagByName, addTag } = get();
        const existingTag = getTagByName(name);

        if (existingTag) {
          return existingTag;
        }

        return addTag({
          user_id: "user-1", // TODO: Get from auth context
          name: name.trim(),
          color,
        });
      },
    }),
    {
      name: "tag-storage",
    }
  )
);
