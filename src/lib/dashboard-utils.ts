import { useActivityStore } from "@/stores/activity-store";
import { subDays, isSameDay, isToday } from "date-fns";

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getMotivationalText = () => {
  const texts = [
    "Every task completed is a step forward.",
    "Small progress is still progress.",
    "You're doing great! Keep going.",
    "Focus on progress, not perfection.",
    "One task at a time, you've got this!",
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};

export const getRecentActivity = () => {
  const { getRecentActivities } = useActivityStore.getState();
  return getRecentActivities(5);
};

export const calculateStreak = (activities: Array<{ timestamp: string }>) => {
  if (activities.length === 0) return 0;

  const today = new Date();
  const dates = activities.map((activity) => new Date(activity.timestamp));
  dates.sort((a, b) => b.getTime() - a.getTime()); // Sort in descending order

  let streak = 0;
  let currentDate = today;

  // Check if there's activity today
  const hasActivityToday = dates.some((date) => isToday(date));
  if (!hasActivityToday) {
    currentDate = subDays(currentDate, 1);
  }

  // Count consecutive days with activity
  while (true) {
    const hasActivityOnDate = dates.some((date) =>
      isSameDay(date, currentDate)
    );
    if (!hasActivityOnDate) break;

    streak++;
    currentDate = subDays(currentDate, 1);
  }

  return streak;
};
