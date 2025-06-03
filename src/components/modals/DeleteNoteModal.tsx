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
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/stores/modal-store";
import { useNoteStore } from "@/stores/note-store";
import { useTaskStore } from "@/stores/task-store";

export function DeleteNoteModal() {
  const navigate = useNavigate();
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

    // Redirect to notes page
    navigate("/notes");
  };

  const getContentPreview = (content: unknown): string => {
    try {
      if (!content) return "No content";

      if (typeof content === "string") {
        return content.length > 100 ? content.slice(0, 100) + "..." : content;
      }

      // Handle Yoopta content object
      if (content && typeof content === "object") {
        let textContent = "";

        Object.values(content).forEach((block: unknown) => {
          if (block && typeof block === "object" && block !== null) {
            const blockObj = block as Record<string, unknown>;

            if (blockObj.value && Array.isArray(blockObj.value)) {
              blockObj.value.forEach((element: unknown) => {
                if (
                  element &&
                  typeof element === "object" &&
                  element !== null
                ) {
                  const elementObj = element as Record<string, unknown>;

                  if (
                    elementObj.children &&
                    Array.isArray(elementObj.children)
                  ) {
                    elementObj.children.forEach((child: unknown) => {
                      if (
                        child &&
                        typeof child === "object" &&
                        child !== null
                      ) {
                        const childObj = child as Record<string, unknown>;
                        if (typeof childObj.text === "string") {
                          textContent += childObj.text + " ";
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });

        const trimmed = textContent.trim();
        if (trimmed.length > 0) {
          return trimmed.length > 100 ? trimmed.slice(0, 100) + "..." : trimmed;
        }
      }

      return "Rich content note";
    } catch (error) {
      console.warn("Error parsing note content:", error);
      return "Unable to preview content";
    }
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
                {getContentPreview(selectedNote.content)}
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
