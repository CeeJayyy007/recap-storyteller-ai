import { Note } from "@/types/note";

export const mockNotes: Note[] = [
  {
    id: "note-1",
    user_id: "user-1",
    title: "Marketing Strategy Research",
    content: {
      blocks: [
        {
          type: "paragraph",
          data: { text: "Researching new marketing strategies for Q1 2025..." }
        }
      ]
    },
    date: "2024-12-24",
    linkedTaskIds: ["2", "8"],
    createdAt: "2024-12-24T14:00:00.000Z",
    updatedAt: "2024-12-24T15:30:00.000Z",
  },
  {
    id: "note-2",
    user_id: "user-1",
    title: "Authentication Implementation Notes",
    content: {
      blocks: [
        {
          type: "paragraph",
          data: { text: "Detailed notes on implementing JWT authentication..." }
        }
      ]
    },
    date: "2024-12-23",
    linkedTaskIds: ["4"],
    createdAt: "2024-12-23T09:00:00.000Z",
    updatedAt: "2024-12-23T18:45:00.000Z",
  }
]; 