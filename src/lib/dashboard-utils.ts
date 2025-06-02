export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const getMotivationalText = (): string => {
  const messages = [
    "Ready to conquer the day? Your tasks are waiting for their superhero! 🦸‍♂️",
    "Time to turn those coffee vibes into productivity magic! ☕✨",
    "Today's forecast: 100% chance of getting things done! 🌟",
    "Your future self is cheering you on - let's make them proud! 🎉",
    "Remember: you're not just checking off tasks, you're building dreams! 💭",
    "Pro tip: Every completed task is a small victory dance waiting to happen! 💃",
    "Today's goal: Be the person your procrastinating self needs! 🎯",
    "Your productivity cape is looking fresh today - go save the day! 🦸‍♀️"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getMockRecentActivity = () => [
  {
    id: "1",
    type: "task_completed",
    description: "Completed task 'Review quarterly report'",
    time: "2 hours ago",
    icon: "✅"
  },
  {
    id: "2", 
    type: "note_created",
    description: "Created note 'Meeting agenda'",
    time: "4 hours ago",
    icon: "📝"
  },
  {
    id: "3",
    type: "task_created", 
    description: "Added new task 'Update website copy'",
    time: "Yesterday",
    icon: "➕"
  },
  {
    id: "4",
    type: "note_updated",
    description: "Updated note 'Project roadmap'", 
    time: "Yesterday",
    icon: "✏️"
  },
  {
    id: "5",
    type: "task_completed",
    description: "Completed task 'Client call follow-up'",
    time: "2 days ago", 
    icon: "✅"
  }
]; 