import { useState, useRef, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import {
  Trash2Icon,
  LinkIcon,
  InfoIcon,
  MoreVertical,
  ArrowLeftIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Note } from "@/types/note";
import { useModalStore } from "@/stores/modal-store";
import { useNoteStore } from "@/stores/note-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface NotesHeaderProps {
  note: Note;
}

export const NotesHeader = ({ note: initialNote }: NotesHeaderProps) => {
  const { openAddTaskToNote, openNoteInfo, openDeleteNote } = useModalStore();
  const { updateNote, getNoteById } = useNoteStore();
  const navigate = useNavigate();

  // Get fresh note data from store for real-time updates
  const note = getNoteById(initialNote.id) || initialNote;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Update editTitle when note changes
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(note.title || "");
    }
  }, [note.title, isEditing]);

  const handleLinkTasks = () => {
    openAddTaskToNote(note);
  };

  const handleShowInfo = () => {
    openNoteInfo(note);
  };

  const handleDelete = () => {
    openDeleteNote(note);
  };

  const handleTitleClick = () => {
    setIsEditing(true);
    setEditTitle(note.title || "Untitled Note");
  };

  const handleSaveTitle = () => {
    const newTitle = editTitle.trim();
    if (newTitle && newTitle !== note.title) {
      updateNote(note.id, { title: newTitle });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="flex justify-between items-start border-b border-border pb-2 pt-4 px-4">
      <div className="flex flex-col gap-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter note title..."
          />
        ) : (
          <h1
            className="text-xl font-bold cursor-pointer hover:text-muted-foreground transition-colors rounded px-0 py-0.5 hover:bg-muted/50"
            onClick={handleTitleClick}
            title="Click to edit title"
          >
            {note.title || "Untitled Note"}
          </h1>
        )}
        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold">User {note.user_id}</p>
          <p className="text-xs text-muted-foreground">
            Last updated {formatDate(note.updatedAt)}
          </p>
          {note.linkedTaskIds.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {note.linkedTaskIds.length} Linked Task
              {note.linkedTaskIds.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLinkTasks}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Link Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShowInfo}>
              <InfoIcon className="w-4 h-4 mr-2" />
              Note Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2Icon className="w-4 h-4 mr-2" />
              Delete Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NotesHeader;
