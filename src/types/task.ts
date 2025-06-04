export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string; // ISO Date - when task was created
  completedAt?: string; // ISO Date - when task was completed (null if not completed)
  linkedNoteId: string | null; // One task can only link to one note
  updatedAt: string; // ISO string
}

// Helper type for dynamic status calculation
export type TaskStatus = "pending" | "carried-over" | "completed";

// Helper function to calculate task status for a specific date
export const getTaskStatusForDate = (
  task: Task,
  viewingDate: string
): TaskStatus | null => {
  const createdDate = task.createdAt.split("T")[0]; // YYYY-MM-DD
  const completedDate = task.completedAt
    ? task.completedAt.split("T")[0]
    : null;

  // Get today's date in YYYY-MM-DD format, ensuring consistent timezone handling
  const today = new Date();
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Don't show task before its creation date
  if (viewingDate < createdDate) return null;

  // If task is completed and we're viewing after completion, don't show
  if (completedDate && viewingDate > completedDate) return null;

  // If task is completed and we're viewing the completion date, show as completed
  if (completedDate && viewingDate === completedDate) return "completed";

  // On creation date (and not completed), show as pending
  if (viewingDate === createdDate && !completedDate) return "pending";

  // After creation date but not beyond today (and not completed), show as carried-over
  // This ensures carried-over tasks don't show in future dates
  if (
    viewingDate > createdDate &&
    viewingDate <= currentDate &&
    (!completedDate || viewingDate < completedDate)
  )
    return "carried-over";

  return null;
};
