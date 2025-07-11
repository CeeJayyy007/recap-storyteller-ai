import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronsUpDown,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useTagStore } from "@/stores/tag-store";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  linkedNoteId: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditTaskModal() {
  const { isEditTaskOpen, selectedTask, closeEditTask } = useModalStore();
  const { updateTask } = useTaskStore();
  const { notes } = useNoteStore();
  const { tags, getOrCreateTag } = useTagStore();

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      linkedNoteId: "",
      createdAt: new Date(),
      completedAt: undefined,
    },
  });

  // Reset form when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      form.reset({
        title: selectedTask.title,
        description: selectedTask.description,
        linkedNoteId: selectedTask.linkedNoteId || "",
        createdAt: selectedTask.createdAt
          ? parseISO(selectedTask.createdAt)
          : new Date(),
        completedAt: selectedTask.completedAt
          ? parseISO(selectedTask.completedAt)
          : undefined,
      });
      setSelectedTags(selectedTask.tags);
    }
  }, [selectedTask, form]);

  const onSubmit = async (data: FormData) => {
    if (!selectedTask) return;

    updateTask(selectedTask.id, {
      title: data.title,
      description: data.description || "",
      tags: selectedTags,
      createdAt: data.createdAt.toISOString(),
      completedAt: data.completedAt?.toISOString(),
      linkedNoteId: data.linkedNoteId || null,
    });

    closeEditTask();
  };

  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
      const tag = getOrCreateTag(tagName.trim());
      setSelectedTags([...selectedTags, tag.name]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
  };

  const availableNotes = notes.filter((note) => note.title);

  if (!selectedTask) return null;

  return (
    <Dialog open={isEditTaskOpen} onOpenChange={closeEditTask}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Edit the details of your task.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Creation Date */}
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Creation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Completion Date */}
            <FormField
              control={form.control}
              name="completedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Completion Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Linked Note */}
            <FormField
              control={form.control}
              name="linkedNoteId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Link to Note (Optional)</FormLabel>
                  <Popover open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? availableNotes.find(
                                (note) => note.id === field.value
                              )?.title
                            : "Select a note"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search notes..." />
                        <CommandList>
                          <CommandEmpty>No notes found.</CommandEmpty>
                          <CommandGroup>
                            {availableNotes.map((note) => (
                              <CommandItem
                                key={note.id}
                                value={note.id}
                                onSelect={() => {
                                  field.onChange(note.id);
                                  setIsNoteOpen(false);
                                }}
                              >
                                {note.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>

              <Popover open={isTagOpen} onOpenChange={setIsTagOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add tags...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search or create tags..."
                      value={tagInput}
                      onValueChange={setTagInput}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {tagInput.trim() && (
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => handleAddTag(tagInput)}
                          >
                            Create "{tagInput}"
                          </Button>
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {(tags || [])
                          .filter(
                            (tag) =>
                              !selectedTags.includes(tag.name) &&
                              tag.name
                                .toLowerCase()
                                .includes(tagInput.toLowerCase())
                          )
                          .map((tag) => (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => handleAddTag(tag.name)}
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: tag.color }}
                              />
                              {tag.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeEditTask}>
                Cancel
              </Button>
              <Button type="submit">Update Task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
