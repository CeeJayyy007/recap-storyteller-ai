

export interface Note {
  id: string;
  user_id: string;
  title?: string; // optional, inferred if missing
  content: string; // JSON blocks from Yoopta - YooptaContent type
  date: string; // YYYY-MM-DD format
  linkedTaskIds: string[]; // One note can have multiple tasks
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
} 