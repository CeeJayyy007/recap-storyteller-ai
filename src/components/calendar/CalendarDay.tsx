import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useModalStore } from "@/stores/modal-store";
import { getTaskStatusForDate } from "@/types/task";
import { format } from "date-fns";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
}: CalendarDayProps) {
  const { getTasksForDate } = useTaskStore();
  const { getNotesForDate } = useNoteStore();
  const { openDateModal } = useModalStore();

  const dateString = format(date, "yyyy-MM-dd");
  const dayNumber = format(date, "d");

  const tasks = getTasksForDate(dateString);
  const notes = getNotesForDate(dateString);

  // Calculate task status counts
  const taskCounts = tasks.reduce((acc, task) => {
    const status = getTaskStatusForDate(task, dateString);
    if (status) {
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleDayClick = () => {
    openDateModal(dateString);
  };

  // Get first few items to show as preview
  const previewItems = [
    ...tasks
      .slice(0, 2)
      .map((task) => ({
        id: task.id,
        title: task.title,
        type: "task" as const,
        status: getTaskStatusForDate(task, dateString),
        time: format(new Date(task.createdAt), "h:mm a"),
      }))
      .filter((item) => item.status !== null), // Only show tasks with valid status
    ...notes.slice(0, 1).map((note) => ({
      id: note.id,
      title: note.title || "Untitled Note",
      type: "note" as const,
      time: format(new Date(note.createdAt), "h:mm a"),
    })),
  ].slice(0, 3);

  // Calculate actual valid tasks count for hasMoreItems
  const validTasksCount = tasks.filter(
    (task) => getTaskStatusForDate(task, dateString) !== null
  ).length;
  const hasMoreItems = validTasksCount + notes.length > previewItems.length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/20 text-black dark:text-green-100";
      case "pending":
        return "bg-orange-100 dark:bg-orange-900/20 text-black dark:text-orange-100";
      case "carried-over":
        return "bg-red-100 dark:bg-red-900/20 text-black dark:text-red-100";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-black dark:text-gray-100";
    }
  };

  const getNoteBadgeClass = () =>
    "bg-purple-100 dark:bg-purple-900/20 text-black dark:text-purple-100";

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-orange-500";
      case "carried-over":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      onClick={handleDayClick}
      className={cn(
        "min-h-[140px] p-3 border-r border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
        !isCurrentMonth && "text-muted-foreground bg-muted/20",
        isToday &&
          "bg-purple-50 rounded-sm dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
        isSelected && "ring-2 ring-purple-500 dark:ring-purple-400"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={cn(
            "text-xl font-semibold",
            isToday &&
              "bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg dark:bg-purple-500"
          )}
        >
          {dayNumber}
        </span>

        {/* Status indicators */}
        <div className="flex gap-1">
          {taskCounts.completed && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                getStatusIndicatorColor("completed")
              )}
              title={`${taskCounts.completed} completed`}
            />
          )}
          {taskCounts.pending && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                getStatusIndicatorColor("pending")
              )}
              title={`${taskCounts.pending} pending`}
            />
          )}
          {taskCounts["carried-over"] && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                getStatusIndicatorColor("carried-over")
              )}
              title={`${taskCounts["carried-over"]} carried over`}
            />
          )}
          {notes.length > 0 && (
            <div
              className="w-2 h-2 rounded-full bg-purple-500"
              title={`${notes.length} notes`}
            />
          )}
        </div>
      </div>

      {/* Preview items */}
      <div className="space-y-1">
        {previewItems.map((item) => (
          <div key={`${item.type}-${item.id}`} className="text-xs">
            <div
              className={cn(
                "truncate font-medium px-2 py-1 rounded text-xs",
                item.type === "task"
                  ? getStatusBadgeClass(item.status || "")
                  : getNoteBadgeClass()
              )}
            >
              {item.title}
            </div>
            <div className="text-muted-foreground text-[10px] px-1 mt-1">
              {item.time}
            </div>
          </div>
        ))}

        {hasMoreItems && (
          <div className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded mt-1">
            +{validTasksCount + notes.length - previewItems.length} more
          </div>
        )}
      </div>
    </div>
  );
}
