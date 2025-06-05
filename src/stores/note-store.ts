import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note } from "@/types/note";
import { mockNotes } from "@/data/mockNotes";
import { useActivityStore, createNoteActivity } from "@/stores/activity-store";

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

        // Log activity
        const activityStore = useActivityStore.getState();
        activityStore.addActivity(
          createNoteActivity("note_created", newNote.title, newNote.id)
        );

        return newNote;
      },

      updateNote: (id, updates) => {
        // Get note details for logging
        const note = get().getNoteById(id);

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));

        // Log activity only for significant updates (not every character change)
        if (note && updates.title && updates.title !== note.title) {
          // Only log if the title change is substantial (more than 3 characters difference or final title is meaningful)
          const titleLength = updates.title.trim().length;
          const previousLength = note.title?.trim().length || 0;
          const lengthDifference = Math.abs(titleLength - previousLength);

          // Log if it's a substantial change (new title is meaningful) or major length change
          if (titleLength >= 3 && (lengthDifference >= 3 || titleLength >= 5)) {
            const activityStore = useActivityStore.getState();
            const actionType = note.title ? "note_updated" : "note_created";
            const description = note.title
              ? `Renamed note to "${updates.title}"`
              : `Created note "${updates.title}"`;

            activityStore.addActivity({
              type: actionType,
              description,
              icon: note.title ? "✏️" : "📝",
              metadata: { noteId: note.id, noteTitle: updates.title },
            });
          }
        }

        // Log content updates (when content is significantly changed)
        if (note && updates.content && updates.content !== note.content) {
          // Only log major content changes to avoid spam
          const contentString =
            typeof updates.content === "string"
              ? updates.content
              : JSON.stringify(updates.content);
          if (contentString.length >= 10) {
            // Only log if content has substance
            const activityStore = useActivityStore.getState();
            activityStore.addActivity({
              type: "note_updated",
              description: `Updated content in "${
                note.title || "Untitled Note"
              }"`,
              icon: "📝",
              metadata: { noteId: note.id, noteTitle: note.title },
            });
          }
        }
      },

      deleteNote: (id) => {
        // Get note details before deletion for logging
        const note = get().getNoteById(id);

        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));

        // Log activity
        if (note) {
          const activityStore = useActivityStore.getState();
          activityStore.addActivity(
            createNoteActivity("note_deleted", note.title, note.id)
          );
        }
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
