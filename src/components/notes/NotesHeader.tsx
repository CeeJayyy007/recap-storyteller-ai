import { formatDate } from "@/lib/utils";
import { Trash2Icon, LinkIcon, InfoIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Note } from "@/types/note";
import { useModalStore } from "@/stores/modal-store";

interface NotesHeaderProps {
  note: Note;
  onDelete: () => void;
}

export const NotesHeader = ({ note, onDelete }: NotesHeaderProps) => {
  const { openAddTaskToNote, openNoteInfo } = useModalStore();

  const handleLinkTasks = () => {
    openAddTaskToNote(note);
  };

  const handleShowInfo = () => {
    openNoteInfo(note);
  };

  return (
    <div className="flex justify-between items-start border-b border-border pb-2 pt-4 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{note.title || "Untitled Note"}</h1>
        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold">User {note.user_id}</p>
          <p className="text-xs text-muted-foreground">
            Last updated {formatDate(note.updatedAt)}
          </p>
          {note.linkedTaskIds.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {note.linkedTaskIds.length} Linked Task{note.linkedTaskIds.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-1 h-8 w-8" onClick={handleLinkTasks}>
                <LinkIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Link Tasks</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-1 h-8 w-8" onClick={handleShowInfo}>
                <InfoIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Note Information</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-1 h-8 w-8" onClick={onDelete}>
                <Trash2Icon className="w-4 h-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Note</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NotesHeader;
