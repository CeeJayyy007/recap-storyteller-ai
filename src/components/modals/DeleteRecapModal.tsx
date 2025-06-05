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
import { useRecapStore } from "@/stores/recap-store";
import { format } from "date-fns";
import { toast } from "sonner";

export function DeleteRecapModal() {
  const {
    isDeleteRecapModalOpen,
    selectedRecapForDeletion,
    closeDeleteRecapModal,
    deleteRecap,
  } = useRecapStore();

  const handleDelete = () => {
    if (!selectedRecapForDeletion) return;

    deleteRecap(selectedRecapForDeletion.id);
    closeDeleteRecapModal();
    toast.success("Recap deleted successfully");
  };

  const formatDateRange = (dateRange: { start: string; end: string }) => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    if (dateRange.start === dateRange.end) {
      return format(start, "MMM d, yyyy");
    }

    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const getContentPreview = (content: string) => {
    return content.length > 100 ? content.slice(0, 100) + "..." : content;
  };

  return (
    <AlertDialog
      open={isDeleteRecapModalOpen}
      onOpenChange={closeDeleteRecapModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Recap</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this recap? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {selectedRecapForDeletion && (
          <div className="my-4 p-3 bg-muted/60 rounded-lg">
            <p className="font-medium">{selectedRecapForDeletion.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDateRange(selectedRecapForDeletion.dateRange)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {getContentPreview(selectedRecapForDeletion.content)}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Recap
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
