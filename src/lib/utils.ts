import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create date-only versions for comparison
export const getDateOnly = (dateString: string) => {
  // Handle both ISO timestamps and date-only strings
  let date;
  if (dateString.includes("T")) {
    // ISO timestamp - parse as is
    date = new Date(dateString);
  } else {
    // Date-only string - explicitly parse as UTC to avoid timezone issues
    date = new Date(dateString + "T00:00:00.000Z");
  }

  // Extract just year, month, day and create new date at midnight UTC
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

// Format date to relative date
export const formatDate = (dateString: string) => {
  const taskDate = new Date(dateString);
  const today = new Date();

  // Reset time to compare just dates
  const taskDateOnly = getDateOnly(taskDate.toISOString());
  const todayOnly = getDateOnly(today.toISOString());

  const diffTime = todayOnly.getTime() - taskDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffDays === -1) {
    return "in 1 day";
  } else {
    return `in ${Math.abs(diffDays)} days`;
  }
};

export const getTagColor = (tag: string) => {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-300",
    "bg-green-100 text-green-800 border-green-300",
    "bg-yellow-100 text-yellow-800 border-yellow-300",
    "bg-purple-100 text-purple-800 border-purple-300",
    "bg-pink-100 text-pink-800 border-pink-300",
    "bg-indigo-100 text-indigo-800 border-indigo-300",
  ];
  return colors[Math.abs(hash) % colors.length];
};
