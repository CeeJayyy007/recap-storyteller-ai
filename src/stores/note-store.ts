import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note } from "@/types/note";
import { mockNotes } from "@/data/mockNotes";

interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesForDate: (date: string) => Note[];
  linkNoteToTask: (noteId: string, taskId: string) => void;
  unlinkNoteFromTask: (noteId: string, taskId: string) => void;
  searchNotesByTitle: (query: string) => Note[];
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: mockNotes,

      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
        return newNote;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id);
      },

      getNotesForDate: (date) => {
        return get().notes.filter((note) => note.date === date);
      },

      linkNoteToTask: (noteId, taskId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  linkedTaskIds: [...note.linkedTaskIds, taskId],
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      unlinkNoteFromTask: (noteId, taskId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  linkedTaskIds: note.linkedTaskIds.filter(
                    (id) => id !== taskId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      searchNotesByTitle: (query) => {
        const { notes } = get();
        if (!query.trim()) return notes;

        return notes.filter((note) =>
          note.title?.toLowerCase().includes(query.toLowerCase())
        );
      },
    }),
    {
      name: "note-storage",
    }
  )
);
