import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  FileTextIcon,
  StarIcon,
  CheckCircleIcon,
  File,
  TrendingUp,
  Target,
  Calendar,
  Plus,
  Eye,
  Edit,
  Zap,
  BarChart3,
  RotateCw,
  ClockIcon,
  Ghost,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useActivityStore } from "@/stores/activity-store";
import { useProfileStore } from "@/stores/profile-store";
import { useTaskbarStore } from "@/stores/taskbar-store";
import {
  getTimeBasedGreeting,
  getMotivationalText,
  getRecentActivity,
  calculateStreak,
} from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import { Task, getTaskStatusForDate } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotesCard } from "@/components/notes/NotesCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModalStore } from "@/stores/modal-store";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { getRecentActivities } = useActivityStore();
  const { profile } = useProfileStore();
  const { toggleVisibility } = useTaskbarStore();
  const { openAddTask } = useModalStore();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const taskStats = useMemo(() => {
    const todayTasks = tasks.filter((task) => {
      const status = getTaskStatusForDate(task, today);
      return status !== null;
    });

    const carriedOver = tasks.filter((task) => {
      const status = getTaskStatusForDate(task, today);
      return status === "carried-over";
    }).length;

    const pending = tasks.filter((task) => {
      const status = getTaskStatusForDate(task, today);
      return status === "pending";
    }).length;

    const completed = tasks.filter((task) => {
      const status = getTaskStatusForDate(task, today);
      return status === "completed";
    }).length;

    return { carriedOver, pending, completed, total: todayTasks.length };
  }, [tasks, today]);

  // Enhanced productivity metrics
  const productivityMetrics = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const weeklyData = last7Days.map((date) => {
      const dayTasks = tasks.filter((task) => {
        const taskDate = task.createdAt.split("T")[0];
        return taskDate === date;
      });
      const completed = dayTasks.filter((task) => task.completedAt).length;
      return { date, total: dayTasks.length, completed };
    });

    const totalWeekTasks = weeklyData.reduce((sum, day) => sum + day.total, 0);
    const totalWeekCompleted = weeklyData.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const completionRate =
      totalWeekTasks > 0 ? (totalWeekCompleted / totalWeekTasks) * 100 : 0;

    // Calculate streak from activities
    const activities = getRecentActivities();
    const streakDays = calculateStreak(activities);

    return {
      weeklyData,
      completionRate,
      totalTasks: tasks.length,
      totalNotes: notes.length,
      streakDays,
    };
  }, [tasks, notes, getRecentActivities]);

  const noteStats = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayNotes = notes.filter(
      (note) => new Date(note.createdAt) >= startOfDay
    );

    return {
      total: notes.length,
      created: todayNotes.length,
      recent: notes.slice(0, 3),
    };
  }, [notes]);

  const recentTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const status = getTaskStatusForDate(task, today);
        return status !== null;
      })
      .slice(0, 5);
  }, [tasks, today]);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get real recent activities instead of mock data
  const recentActivity = useMemo(() => {
    const activities = getRecentActivities(10);

    // If no real activities, fallback to mock data
    if (activities.length === 0) {
      return getRecentActivity();
    }

    // Format real activities for display
    return activities.map((activity) => ({
      id: activity.id,
      icon: activity.icon,
      description: activity.description,
      time: formatTimeAgo(activity.timestamp),
    }));
  }, [getRecentActivities]);

  // Function to get card styles based on task status (similar to TaskCard)
  const getTaskCardStyles = (task: Task) => {
    const status = getTaskStatusForDate(task, today);

    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/50 hover:bg-green-200/40 hover:border-green-300 dark:hover:bg-green-900/30 dark:hover:border-green-600";
      case "carried-over":
        return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50 hover:bg-red-200/40 hover:border-red-300 dark:hover:bg-red-900/30 dark:hover:border-red-600";
      case "pending":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/50 hover:bg-orange-200/40 hover:border-orange-300 dark:hover:bg-orange-900/30 dark:hover:border-orange-600";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800/50 hover:bg-gray-200/40 hover:border-gray-300 dark:hover:bg-gray-900/30 dark:hover:border-gray-600";
    }
  };

  // Function to get colors for tags and status badges
  const getStatusColor = (value: string) => {
    // Handle specific status values
    if (value === "carried-over") {
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600";
    }
    if (value === "completed") {
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600";
    }
    if (value === "pending") {
      return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600";
    }

    // For tags, use hash-based colors (from TaskCard)
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600",
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600",
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600",
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600",
      "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-600",
      "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-600",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatsText = () => {
    const parts = [];

    if (taskStats.carriedOver > 0) {
      parts.push(
        `${taskStats.carriedOver} task${
          taskStats.carriedOver > 1 ? "s" : ""
        } carried over from yesterday`
      );
    }

    if (taskStats.pending > 0) {
      parts.push(
        `${taskStats.pending} pending task${
          taskStats.pending > 1 ? "s" : ""
        } today`
      );
    }

    if (taskStats.completed > 0) {
      parts.push(
        `${taskStats.completed} completed task${
          taskStats.completed > 1 ? "s" : ""
        }`
      );
    }

    if (noteStats.created > 0) {
      parts.push(
        `${noteStats.created} note${noteStats.created > 1 ? "s" : ""} created`
      );
    }

    if (parts.length === 0) {
      return "You're all caught up! Time to create some new tasks or notes.";
    }

    const lastPart = parts.pop();
    if (parts.length === 0) return `You have ${lastPart}.`;

    return `You have ${parts.join(", ")} and ${lastPart}.`;
  };

  return (
    <div className="px-6 py-8 space-y-6 container">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {getTimeBasedGreeting()}
          {profile.firstName || profile.lastName
            ? `, ${profile.firstName} ${profile.lastName}`
            : ""}
          !
        </h1>
        <p className="text-muted-foreground">{getMotivationalText()}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* User Insights Dashboard - 3 columns */}
        <Card className="lg:col-span-3 border-none">
          <CardHeader className="flex flex-row items-center p-0 py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-5 w-5" />
              Insights Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-6 w-6 text-blue-600" />
                      <span className="text-base font-medium">Total Tasks</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {productivityMetrics.totalTasks}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      <span className="text-base font-medium">Completed</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {taskStats.completed}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <RotateCw className="h-6 w-6 text-red-600" />
                      <span className="text-base font-medium">
                        Carried Over
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {taskStats.carriedOver}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileTextIcon className="h-6 w-6 text-purple-600" />
                      <span className="text-base font-medium">Notes</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {productivityMetrics.totalNotes}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Weekly Completion Rate
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {productivityMetrics.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={productivityMetrics.completionRate}
                    className="h-2"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4 text-red-500" />
                      <span className="text-sm">
                        Carried Over: {taskStats.carriedOver}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Streak: {productivityMetrics.streakDays} days
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">
                              Your streak is calculated based on consecutive
                              days of creating or completing tasks and notes.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5" />
                    <h3 className="font-medium">7-Day Task Management</h3>
                  </div>

                  <div className="grid gap-2">
                    {productivityMetrics.weeklyData.map((day, index) => (
                      <div
                        key={day.date}
                        className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                      >
                        <div className="w-10 text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>
                              {day.completed}/{day.total} completed
                            </span>
                            <span className="text-muted-foreground">
                              {day.total > 0
                                ? Math.round((day.completed / day.total) * 100)
                                : 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              day.total > 0
                                ? (day.completed / day.total) * 100
                                : 0
                            }
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Quick Actions Tab */}
              <TabsContent value="actions" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5" />
                    <h3 className="font-medium">Quick Actions</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => navigate("/tasks")}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">Add Task</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => navigate("/notes")}
                    >
                      <Edit className="h-5 w-5" />
                      <span className="text-sm">Create Note</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => navigate("/calendar")}
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm">View Calendar</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => navigate("/profile")}
                    >
                      <Eye className="h-5 w-5" />
                      <span className="text-sm">View Profile</span>
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Today's Focus
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {taskStats.pending > 0
                        ? `Complete ${taskStats.pending} pending task${
                            taskStats.pending > 1 ? "s" : ""
                          } to stay on track`
                        : taskStats.carriedOver > 0
                        ? `Focus on ${taskStats.carriedOver} carried over task${
                            taskStats.carriedOver > 1 ? "s" : ""
                          }`
                        : "Great job! All caught up for today 🎉"}
                    </p>
                    {(taskStats.pending > 0 || taskStats.carriedOver > 0) && (
                      <Button size="sm" onClick={() => navigate("/tasks")}>
                        View Tasks
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* My Tasks - 3 columns */}
        <Card className="lg:col-span-2 border-none">
          <CardHeader className="flex flex-col p-0 py-4 text-muted-foreground">
            <div className="flex justify-between items-center p-0">
              <CardTitle className="text-lg flex items-center gap-2 p-0">
                <CheckCircleIcon className="h-5 w-5" />
                My tasks
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={toggleVisibility}
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 border border-muted-foreground/25 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">{getStatsText()}</p>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks for today</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={openAddTask}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            ) : (
              recentTasks.map((task) => {
                const status = getTaskStatusForDate(task, today);
                const isCompleted = status === "completed";

                return (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 border border-muted-foreground/25 ${getTaskCardStyles(
                      task
                    )}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm line-clamp-1 ${
                          isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {task.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={cn("text-xs", getStatusColor(tag))}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {status === "carried-over" && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(status))}
                      >
                        Carried over
                      </Badge>
                    )}
                    {task.tags.includes("urgent") && (
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* My Notes - 2 columns */}
        <Card className="lg:col-span-3 border-none">
          <CardHeader className="flex flex-row items-center justify-between p-0 py-3 text-muted-foreground">
            <CardTitle className="text-lg flex items-center gap-2">
              <File className="h-5 w-5" />
              My notes
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => navigate("/notes")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            {noteStats.recent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground/15">
                <p>No notes yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate("/notes")}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {noteStats.recent.map((note) => (
                  <div key={note.id} className="h-80">
                    <NotesCard
                      note={note}
                      onView={() => navigate(`/notes/${note.id}`)}
                      onEdit={() => navigate(`/notes/${note.id}/edit`)}
                      onAddTask={() =>
                        navigate(`/tasks/${note.linkedTaskIds[0]}`)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - 3 columns */}
        <Card className="lg:col-span-2 border-none">
          <CardHeader className="p-0 py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
              <ClockIcon className="h-5 w-5" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 border border-muted-foreground/25 rounded-lg p-6">
            <ScrollArea className="max-h-80">
              <div className="space-y-4 max-h-80 pr-2">
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground opacity-70">
                    <Ghost className="w-10 h-10 mb-2" />
                    <p className="text-sm">
                      No recent activity yet.
                      <br />
                      Your actions will show up here!
                    </p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 border-b border-muted-foreground/10 pb-4 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
