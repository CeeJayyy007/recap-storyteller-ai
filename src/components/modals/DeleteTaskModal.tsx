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
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";

export function DeleteTaskModal() {
  const { isDeleteTaskOpen, selectedTask, closeDeleteTask } = useModalStore();
  const { deleteTask } = useTaskStore();
  const { unlinkNoteFromTask } = useNoteStore();

  const handleDelete = () => {
    if (!selectedTask) return;

    // If the task is linked to a note, unlink it
    if (selectedTask.linkedNoteId) {
      unlinkNoteFromTask(selectedTask.linkedNoteId, selectedTask.id);
    }

    // Delete the task
    deleteTask(selectedTask.id);
    closeDeleteTask();
  };

  return (
    <AlertDialog open={isDeleteTaskOpen} onOpenChange={closeDeleteTask}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {selectedTask && (
          <div className="my-4 p-3 bg-muted/60 rounded-lg">
            <p className="font-medium">{selectedTask.title}</p>
            {selectedTask.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTask.description}
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
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
