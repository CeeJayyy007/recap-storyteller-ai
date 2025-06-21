import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useDateStore } from "@/stores/date-store";
import { getTaskStatusForDate } from "@/types/task";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";

export function DateModal() {
  const { isDateModalOpen, selectedDate, closeDateModal, openAddTask } =
    useModalStore();
  const { tasks } = useTaskStore();
  const { getNotesForDate } = useNoteStore();
  const { setSelectedDate } = useDateStore();

  if (!selectedDate) return null;

  const date = new Date(selectedDate);

  // Get all tasks and filter them using getTaskStatusForDate to show carried-over tasks correctly
  const tasksForDate = tasks.filter((task) => {
    const status = getTaskStatusForDate(task, selectedDate);
    return status !== null; // Only show tasks that have a valid status for this date
  });

  const notes = getNotesForDate(selectedDate);

  const tasksByStatus = tasksForDate.reduce((acc, task) => {
    const status = getTaskStatusForDate(task, selectedDate);
    if (status) {
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  const handleQuickAddTask = () => {
    setSelectedDate(date);
    closeDateModal();
    openAddTask();
  };

  const handleQuickAddNote = () => {
    // TODO: Implement quick add note
    closeDateModal();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "pending":
        return (
          <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        );
      case "carried-over":
        return (
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        );
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed Tasks";
      case "pending":
        return "Pending Tasks";
      case "carried-over":
        return "Carried Over Tasks";
      default:
        return "Tasks";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 dark:text-green-300";
      case "pending":
        return "text-orange-700 dark:text-orange-300";
      case "carried-over":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  const getCardStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 hover:bg-green-100 hover:border-green-300 dark:hover:bg-green-900";
      case "carried-over":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 hover:bg-red-100 hover:border-red-300 dark:hover:bg-red-900";
      case "pending":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 hover:bg-orange-100 hover:border-orange-300 dark:hover:bg-orange-900";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800 hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-900";
    }
  };

  return (
    <Dialog open={isDateModalOpen} onOpenChange={closeDateModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-5 h-5" />
            {format(date, "EEEE, MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>Tasks and notes for this day</DialogDescription>
        </DialogHeader>

        {/* Quick Add Buttons */}
        <div className="flex gap-2 mb-4">
          <Button onClick={handleQuickAddTask} size="sm" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          {/* <Button
            onClick={handleQuickAddNote}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button> */}
        </div>

        {/* Content */}
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-6 pr-4">
            {/* Tasks by Status */}
            {(["completed", "pending", "carried-over"] as const).map(
              (status) => {
                const statusTasks = tasksByStatus[status] || [];
                if (statusTasks.length === 0) return null;

                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <h3
                        className={cn("font-semibold", getStatusColor(status))}
                      >
                        {getStatusLabel(status)}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {statusTasks.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {statusTasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "p-3 rounded-lg border bg-card transition-colors cursor-pointer",
                            getCardStyles(status)
                          )}
                        >
                          <h4 className="font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 justify-between">
                            {task.tags.length > 0 && (
                              <div className="flex gap-1">
                                {task.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{task.tags.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Created:{" "}
                              {format(new Date(task.createdAt), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}

            {/* Notes */}
            {notes.length > 0 && (
              <>
                {tasksForDate.length > 0 && <Separator />}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-purple-700 dark:text-purple-300">
                      Notes
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {notes.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <h4 className="font-medium">
                          {note.title || "Untitled Note"}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Created:{" "}
                            {format(new Date(note.createdAt), "h:mm a")}
                          </span>
                          {note.linkedTaskIds.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {note.linkedTaskIds.length} linked task
                              {note.linkedTaskIds.length > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {tasksForDate.length === 0 && notes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium mb-1">
                  No items for this day
                </p>
                <p className="text-sm">Start by adding a task or note above</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
