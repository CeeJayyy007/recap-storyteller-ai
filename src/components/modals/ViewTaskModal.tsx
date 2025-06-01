import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Tag } from "lucide-react";
import { useModalStore } from "@/stores/modal-store";
import { useNoteStore } from "@/stores/note-store";
import { useTagStore } from "@/stores/tag-store";

export function ViewTaskModal() {
  const { isViewTaskOpen, selectedTask, closeViewTask } = useModalStore();
  const { getNoteById } = useNoteStore();
  const { tags } = useTagStore();

  if (!selectedTask) return null;

  const linkedNote = selectedTask.linkedNoteId
    ? getNoteById(selectedTask.linkedNoteId)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "carried-over":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find((t) => t.name === tagName);
    return tag?.color || "#6b7280";
  };

  return (
    <Dialog open={isViewTaskOpen} onOpenChange={closeViewTask}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            View the details of your task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(selectedTask.status)}>
                {selectedTask.status.charAt(0).toUpperCase() +
                  selectedTask.status.slice(1)}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
          </div>

          {/* Description */}
          {selectedTask.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Description
              </h4>
              <p className="text-sm leading-relaxed">
                {selectedTask.description}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span>{format(new Date(selectedTask.date), "PPP")}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(selectedTask.createdAt), "PPp")}</span>
            </div>

            {selectedTask.updatedAt !== selectedTask.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{format(new Date(selectedTask.updatedAt), "PPp")}</span>
              </div>
            )}
          </div>

          {/* Linked Note */}
          {linkedNote && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Linked Note
              </h4>
              <div className="p-3 border rounded-lg">
                <p className="font-medium">{linkedNote.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(linkedNote.date), "PPP")}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {selectedTask.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTask.tags.map((tagName) => (
                  <Badge
                    key={tagName}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTagColor(tagName) }}
                    />
                    {tagName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={closeViewTask}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
