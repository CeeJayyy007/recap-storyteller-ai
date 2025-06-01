import { MoreVertical, Eye, Edit, FileText, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onNote: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onView,
  onEdit,
  onNote,
  onDelete,
}: TaskCardProps) {
  const getCardStyles = () => {
    switch (task.status) {
      case "completed":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
      case "carried-over":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const taskDate = new Date(dateString);
    const today = new Date();

    // Reset time to compare just dates
    const taskDateOnly = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffTime = todayOnly.getTime() - taskDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "today";
    } else if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays > 1) {
      return `${diffDays} days ago`;
    } else if (diffDays === -1) {
      return "tomorrow";
    } else {
      return `in ${Math.abs(diffDays)} days`;
    }
  };

  const getTagColor = (tag: string) => {
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

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-2 transition-colors",
        getCardStyles()
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-0.5 flex-shrink-0"
          />
          <h3
            className={cn(
              "font-medium text-sm leading-snug break-words line-clamp-1",
              task.status === "completed" &&
                "line-through text-muted-foreground"
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onView(task)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNote(task)}>
              <FileText className="mr-2 h-4 w-4" />
              Add Note
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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

        {/* Date */}
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
          {formatDate(task.date)}
        </span>
      </div>
    </div>
  );
}
