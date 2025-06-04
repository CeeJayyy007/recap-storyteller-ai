import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  FolderIcon,
  CheckIcon,
  FileTextIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  NotebookPenIcon,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import {
  getTimeBasedGreeting,
  getMotivationalText,
  getMockRecentActivity,
} from "@/lib/dashboard-utils";
import { getTaskStatusForDate } from "@/types/task";
import { formatDate } from "@/lib/utils";
import { NotesCard } from "@/components/notes/NotesCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();

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

  const recentActivity = getMockRecentActivity();

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
        <h1 className="text-3xl font-bold">{getTimeBasedGreeting()}, Jay!</h1>
        <p className="text-muted-foreground">{getMotivationalText()}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* My Projects - 2 columns */}
        <Card className="lg:col-span-3 border-none">
          <CardHeader className="flex flex-row items-center p-0 py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
              <FolderIcon className="h-5 w-5" />
              My projects
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
              <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No projects yet</p>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </div>
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
                onClick={() => navigate("/tasks")}
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
                  onClick={() => navigate("/tasks")}
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
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 border border-muted-foreground/25"
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
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {status === "carried-over" && (
                      <Badge variant="outline" className="text-xs">
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
          <CardContent className="space-y-3 px-0">
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
              noteStats.recent.map((note) => (
                <div className="flex w-80" key={note.id}>
                  <NotesCard
                    note={note}
                    onView={() => navigate(`/notes/${note.id}`)}
                    onEdit={() => navigate(`/notes/${note.id}/edit`)}
                    onAddTask={() =>
                      navigate(`/tasks/${note.linkedTaskIds[0]}`)
                    }
                  />
                </div>
              ))
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
          <CardContent className="space-y-3 border border-muted-foreground/25 rounded-lg p-6 ">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
