import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Calendar,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/types/note";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";

interface NotesCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onAddTask: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export function NotesCard({
  note,
  onView,
  onEdit,
  onAddTask,
  onDelete,
}: NotesCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openAddTaskToNote } = useModalStore();

  // Extract text content from Yoopta or string content
  const getContentPreview = (content: any): string => {
    if (typeof content === "string") {
      return content.slice(0, 150) + (content.length > 150 ? "..." : "");
    }

    // Handle Yoopta content
    if (content && typeof content === "object") {
      let textContent = "";
      Object.values(content).forEach((block: any) => {
        if (block.value) {
          block.value.forEach((element: any) => {
            if (element.children) {
              element.children.forEach((child: any) => {
                if (child.text) {
                  textContent += child.text + " ";
                }
              });
            }
          });
        }
      });
      return (
        textContent.trim().slice(0, 150) +
        (textContent.length > 150 ? "..." : "")
      );
    }

    return "Rich content note...";
  };

  // Extract tags from content or use a default set
  const getTags = (): string[] => {
    // For now, return some example tags based on content
    // In a real app, you might extract these from the content or have a separate tags field
    const content = getContentPreview(note.content).toLowerCase();
    const possibleTags = [];

    if (content.includes("design")) possibleTags.push("Design");
    if (content.includes("workshop")) possibleTags.push("Workshop");
    if (content.includes("progress")) possibleTags.push("In Progress");
    if (content.includes("meeting")) possibleTags.push("Meeting");
    if (content.includes("idea")) possibleTags.push("Ideas");

    return possibleTags.slice(0, 3); // Limit to 3 tags
  };

  const handleCardClick = () => {
    if (!isDropdownOpen) {
      onView(note);
    }
  };

  const handleLinkTasks = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddTaskToNote(note);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="group relative bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Header with date and menu */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {format(new Date(note.date), "MMM dd, yyyy")}
        </span>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView(note);
                setIsDropdownOpen(false);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Note
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
                setIsDropdownOpen(false);
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLinkTasks}>
              <Link className="h-4 w-4 mr-2" />
              Link Task(s)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note);
                setIsDropdownOpen(false);
              }}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title - Fixed height */}
      <h3 className="font-semibold text-base mb-3 line-clamp-1 flex-shrink-0">
        {note.title || "Untitled Note"}
      </h3>

      {/* Content Preview - Fixed height */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-shrink-0 h-[60px]">
        {getContentPreview(note.content)}
      </p>

      {/* Spacer to push badges and footer to bottom */}
      <div className="flex-1"></div>

      {/* Tags - Fixed position above footer */}
      <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
        {getTags().map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
          >
            {tag}
          </Badge>
        ))}
        {note.linkedTaskIds.length > 0 && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            {note.linkedTaskIds.length} linked task
            {note.linkedTaskIds.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="pt-3 border-t border-border/50 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          Updated {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );
}
