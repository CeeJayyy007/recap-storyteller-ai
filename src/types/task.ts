export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "carried-over";
  tags: string[];
  date: string; // YYYY-MM-DD format
  linkedNoteId: string | null; // One task can only link to one note
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
} 