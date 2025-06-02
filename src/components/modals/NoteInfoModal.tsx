import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  UserIcon,
  EditIcon,
  FileTextIcon,
  LinkIcon,
} from "lucide-react";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";

export function NoteInfoModal() {
  const { isNoteInfoOpen, selectedNote, closeNoteInfo } = useModalStore();
  const { getTaskById } = useTaskStore();

  if (!selectedNote) return null;

  const linkedTasks = selectedNote.linkedTaskIds
    .map((taskId) => getTaskById(taskId))
    .filter(Boolean);

  const getContentStats = () => {
    if (typeof selectedNote.content === "string") {
      const wordCount = selectedNote.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      return { wordCount, blockCount: 1 };
    }

    if (selectedNote.content && typeof selectedNote.content === "object") {
      const blocks = Object.values(selectedNote.content);
      const blockCount = blocks.length;

      let totalText = "";
      blocks.forEach((block) => {
        if (block.value) {
          block.value.forEach((item) => {
            if (item.children) {
              item.children.forEach((child) => {
                if (child.text) totalText += child.text + " ";
              });
            }
          });
        }
      });

      const wordCount = totalText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      return { wordCount, blockCount };
    }

    return { wordCount: 0, blockCount: 0 };
  };

  const { wordCount, blockCount } = getContentStats();

  return (
    <Dialog open={isNoteInfoOpen} onOpenChange={closeNoteInfo}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Note Information
          </DialogTitle>
          <DialogDescription>
            Details and metadata for "{selectedNote.title || "Untitled Note"}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-4">
                <p className="text-sm font-medium">Creator:</p>
                <p className="text-sm text-muted-foreground">
                  User {selectedNote.user_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-4">
                <p className="text-sm font-medium">Date Created:</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedNote.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <EditIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-4">
                <p className="text-sm font-medium">Last Edited:</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedNote.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Content Statistics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Content Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/60 rounded-lg">
                <p className="text-lg font-semibold">{wordCount}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="text-center p-3 bg-muted/60 rounded-lg">
                <p className="text-lg font-semibold">{blockCount}</p>
                <p className="text-xs text-muted-foreground">Blocks</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Linked Tasks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">
                Linked Tasks ({linkedTasks.length})
              </h4>
            </div>

            {linkedTasks.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {linkedTasks.map((task) => (
                  <Badge key={task!.id} variant="outline" className="text-xs">
                    {task!.title}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No tasks linked to this note
              </p>
            )}
          </div>

          {/* Note Date */}
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Note Date</h4>
            <Badge variant="secondary" className="text-xs">
              {format(new Date(selectedNote.date), "MMM dd, yyyy")}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
