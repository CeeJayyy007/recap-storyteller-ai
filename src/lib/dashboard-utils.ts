import { useActivityStore } from "@/stores/activity-store";

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getMotivationalText = () => {
  const quotes = [
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getRecentActivity = () => {
  const { getRecentActivities } = useActivityStore.getState();
  return getRecentActivities(5);
};
