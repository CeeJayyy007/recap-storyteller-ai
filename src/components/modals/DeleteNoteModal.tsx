import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/stores/modal-store";
import { useNoteStore } from "@/stores/note-store";
import { useTaskStore } from "@/stores/task-store";

export function DeleteNoteModal() {
  const { isDeleteNoteOpen, selectedNote, closeDeleteNote } = useModalStore();
  const { deleteNote } = useNoteStore();
  const { unlinkTaskFromNote } = useTaskStore();

  const handleDelete = () => {
    if (!selectedNote) return;

    // If the note has linked tasks, unlink them
    if (selectedNote.linkedTaskIds.length > 0) {
      selectedNote.linkedTaskIds.forEach((taskId) => {
        unlinkTaskFromNote(taskId);
      });
    }

    // Delete the note
    deleteNote(selectedNote.id);
    closeDeleteNote();
  };

  const getContentPreview = (content: string) => {
    if (!content) return "No content";
    return content.length > 100 ? content.slice(0, 100) + "..." : content;
  };

  return (
    <AlertDialog open={isDeleteNoteOpen} onOpenChange={closeDeleteNote}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {selectedNote && (
          <div className="my-4 p-3 bg-muted/60 rounded-lg">
            <p className="font-medium">
              {selectedNote.title || "Untitled Note"}
            </p>
            {selectedNote.content && (
              <p className="text-sm text-muted-foreground mt-1">
                {getContentPreview(selectedNote.content as string)}
              </p>
            )}
            {selectedNote.linkedTaskIds.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedNote.linkedTaskIds.length} linked task
                {selectedNote.linkedTaskIds.length > 1 ? "s" : ""} will be
                unlinked
              </p>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
