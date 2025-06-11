import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { Task } from "@/types/task";

export function AddTaskToNoteModal() {
  const { isAddTaskToNoteOpen, selectedNote, closeAddTaskToNote } =
    useModalStore();
  const { tasks } = useTaskStore();
  const { updateNote } = useNoteStore();
  const { linkTaskToNote } = useTaskStore();

  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  // Load already linked tasks when modal opens
  useEffect(() => {
    if (isAddTaskToNoteOpen && selectedNote) {
      const linkedTasks = tasks.filter((task) =>
        selectedNote.linkedTaskIds.includes(task.id)
      );
      setSelectedTasks(linkedTasks);
    }
  }, [isAddTaskToNoteOpen, selectedNote, tasks]);

  if (!selectedNote) return null;

  // Get available tasks (exclude already linked tasks)
  const availableTasks = tasks.filter(
    (task) => !selectedNote.linkedTaskIds.includes(task.id)
  );

  const handleAddTask = (task: Task) => {
    if (!selectedTasks.find((t) => t.id === task.id)) {
      setSelectedTasks([...selectedTasks, task]);
    }
    setIsTaskOpen(false);
  };

  const handleRemoveTask = (taskId: string) => {
    setSelectedTasks(selectedTasks.filter((task) => task.id !== taskId));
  };

  const handleSubmit = () => {
    // Get the new tasks to link (exclude already linked ones)
    const newTasksToLink = selectedTasks.filter(
      (task) => !selectedNote.linkedTaskIds.includes(task.id)
    );

    // Get the tasks to unlink (previously linked but now removed)
    const tasksToUnlink = selectedNote.linkedTaskIds.filter(
      (taskId) => !selectedTasks.find((task) => task.id === taskId)
    );

    // Update note with new linked task IDs
    const newLinkedTaskIds = selectedTasks.map((task) => task.id);

    updateNote(selectedNote.id, {
      linkedTaskIds: newLinkedTaskIds,
    });

    // Link new tasks to this note
    newTasksToLink.forEach((task) => {
      linkTaskToNote(task.id, selectedNote.id);
    });

    // Unlink removed tasks from this note
    tasksToUnlink.forEach((taskId) => {
      const { unlinkTaskFromNote } = useTaskStore.getState();
      unlinkTaskFromNote(taskId);
    });

    // Close modal (selectedTasks will be reset by useEffect when modal reopens)
    closeAddTaskToNote();
  };

  const handleCancel = () => {
    // Reset to original linked tasks
    const linkedTasks = tasks.filter((task) =>
      selectedNote.linkedTaskIds.includes(task.id)
    );
    setSelectedTasks(linkedTasks);
    closeAddTaskToNote();
  };

  // Check if there are any changes from the original state
  const originalLinkedTaskIds = selectedNote.linkedTaskIds.sort();
  const currentSelectedTaskIds = selectedTasks.map((task) => task.id).sort();
  const hasChanges =
    JSON.stringify(originalLinkedTaskIds) !==
    JSON.stringify(currentSelectedTaskIds);

  return (
    <Dialog open={isAddTaskToNoteOpen} onOpenChange={closeAddTaskToNote}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link Tasks to Note</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Manage tasks linked to this note. You can add new tasks or remove
            existing ones.
          </DialogDescription>
        </DialogHeader>

        {/* Note Info */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Managing tasks for:</p>
          <p className="font-medium">{selectedNote.title || "Untitled Note"}</p>
        </div>

        {/* Selected Tasks */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Linked Tasks{" "}
              {selectedTasks.length > 0 && `(${selectedTasks.length})`}
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded-md">
              {selectedTasks.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No tasks linked
                </span>
              ) : (
                selectedTasks.map((task) => (
                  <Badge
                    key={task.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {task.title}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTask(task.id)}
                    />
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Task Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Add More Tasks
            </label>
            <Popover open={isTaskOpen} onOpenChange={setIsTaskOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={availableTasks.length === 0}
                >
                  {availableTasks.length === 0
                    ? "No more tasks available"
                    : "Select additional tasks..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0">
                <Command>
                  <CommandInput placeholder="Search tasks..." />
                  <CommandList>
                    <CommandEmpty>No tasks found.</CommandEmpty>
                    <CommandGroup>
                      {availableTasks.map((task) => (
                        <CommandItem
                          key={task.id}
                          value={task.title}
                          onSelect={() => handleAddTask(task)}
                          className="flex items-start gap-2 p-3"
                        >
                          <Check
                            className={cn(
                              "h-4 w-4 mt-0.5",
                              selectedTasks.find((t) => t.id === task.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {task.description.slice(0, 60)}
                                {task.description.length > 60 ? "..." : ""}
                              </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {task.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasChanges}>
            {hasChanges ? "Save Changes" : "No Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
