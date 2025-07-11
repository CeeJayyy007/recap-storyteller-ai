import {
  MoreVertical,
  Eye,
  Edit,
  FileText,
  Trash2,
  NotebookPen,
  LucideView,
} from "lucide-react";
import { Task } from "@/types/task";
import { cn, formatDate, getTagColor } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getTaskStatusForDate } from "@/types/task";
import { useEffect, useState } from "react";
import { useNoteStore } from "@/stores/note-store";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onNote: (task: Task) => void;
  onDelete: (task: Task) => void;
  selectedDate: string;
}

export function TaskCard({
  task,
  onToggleComplete,
  onView,
  onEdit,
  onNote,
  onDelete,
  selectedDate,
}: TaskCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const selectedDateStr = selectedDate.split("T")[0]; // YYYY-MM-DD
  const { getNoteById } = useNoteStore();
  const linkedNote = task.linkedNoteId ? getNoteById(task.linkedNoteId) : null;
  const navigate = useNavigate();

  // Calculate dynamic status for the selected date
  const taskStatus = getTaskStatusForDate(task, selectedDateStr);
  const isCompleted = taskStatus === "completed";

  // Debug logging to verify the fix
  console.log("TaskCard Debug:", {
    taskId: task.id,
    taskTitle: task.title,
    selectedDateStr,
    taskStatus,
    taskCreatedAt: task.createdAt.split("T")[0],
  });

  const getCardStyles = () => {
    const baseStyles = {
      completed:
        "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
      "carried-over":
        "bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800",
      pending:
        "bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800",
      default:
        "bg-gray-50 border-gray-200 dark:bg-gray-950/50 dark:border-gray-800",
    };

    const statusStyle = taskStatus
      ? baseStyles[taskStatus]
      : baseStyles.default;
    const linkedNoteStyle = linkedNote
      ? "border-l-4 border-l-purple-500 dark:border-l-purple-400"
      : "";

    return cn(statusStyle, linkedNoteStyle);
  };

  const getCardFocusStyles = (status: string) => {
    return status === "completed"
      ? "ring-2 ring-green-500 ring-offset-1 scale-101"
      : status === "carried-over"
      ? "ring-2 ring-red-500 ring-offset-1 scale-101"
      : status === "pending"
      ? "ring-2 ring-orange-500 ring-offset-1 scale-101"
      : "";
  };

  // Check for highlighting on mount
  useEffect(() => {
    const highlightTaskId = localStorage.getItem("highlightTaskId");
    if (highlightTaskId === task.id) {
      setIsHighlighted(true);
      localStorage.removeItem("highlightTaskId");

      // Scroll to this task
      setTimeout(() => {
        const element = document.getElementById(`task-${task.id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      // Remove highlight after animation
      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    }
  }, [task.id]);

  const handleViewLinkedNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkedNote) {
      navigate(`/notes/${linkedNote.id}`);
    }
  };

  return (
    <div
      id={`task-${task.id}`}
      className={cn(
        "p-3 rounded-lg border-2 transition-all duration-300 relative group",
        getCardStyles(),
        isHighlighted && getCardFocusStyles(taskStatus)
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={(checked) => {
              console.log("Checkbox clicked:", {
                taskId: task.id,
                checked,
                taskStatus,
              });
              onToggleComplete(task.id);
            }}
            className="mt-0.5 flex-shrink-0"
            disabled={false}
          />
          <h3
            className={cn(
              "font-medium text-sm leading-snug break-words line-clamp-1",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => onView(task)}>
              <Eye className="mr-2 h-4 w-4" />
              View Task
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNote(task)}>
              <FileText className="mr-2 h-4 w-4" />
              Add Note
            </DropdownMenuItem>
            {linkedNote && (
              <DropdownMenuItem onClick={handleViewLinkedNote}>
                <LucideView className="mr-2 h-4 w-4" />
                View Note
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {/* Separator */}
        <div className="h-px bg-gray-300 dark:bg-gray-600 mb-2" />

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2">
        {/* Tags */}
        <div className="flex gap-1 overflow-hidden min-w-0 flex-shrink">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn("text-xs border flex-shrink-0", getTagColor(tag))}
            >
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge
              variant="outline"
              className="text-xs bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 flex-shrink-0"
            >
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Date - show creation date */}
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
          {formatDate(task.createdAt.split("T")[0])}
        </span>
      </div>
    </div>
  );
}
