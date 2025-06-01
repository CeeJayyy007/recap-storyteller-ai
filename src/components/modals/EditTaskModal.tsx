import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useTagStore } from "@/stores/tag-store";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "completed", "carried-over"]),
  linkedNoteId: z.string().optional(),
  tags: z.array(z.string()).default([]),
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
      status: "pending",
      linkedNoteId: "",
      tags: [],
    },
  });

  // Reset form when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      form.reset({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        linkedNoteId: selectedTask.linkedNoteId || "",
      });
      setSelectedTags(selectedTask.tags);
    }
  }, [selectedTask, form]);

  const onSubmit = async (data: FormData) => {
    if (!selectedTask) return;

    updateTask(selectedTask.id, {
      title: data.title,
      description: data.description || "",
      status: data.status,
      tags: selectedTags,
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="carried-over">Carried Over</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search notes..." />
                        <CommandEmpty>No notes found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              form.setValue("linkedNoteId", "");
                              setIsNoteOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            No note
                          </CommandItem>
                          {availableNotes.map((note) => (
                            <CommandItem
                              key={note.id}
                              value={note.id}
                              onSelect={(currentValue) => {
                                form.setValue(
                                  "linkedNoteId",
                                  currentValue === field.value
                                    ? ""
                                    : currentValue
                                );
                                setIsNoteOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === note.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {note.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search or create tags..."
                      value={tagInput}
                      onValueChange={setTagInput}
                    />
                    <CommandEmpty>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          if (tagInput.trim()) {
                            handleAddTag(tagInput);
                            setIsTagOpen(false);
                          }
                        }}
                      >
                        Create "{tagInput}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {tags
                        .filter((tag) => !selectedTags.includes(tag.name))
                        .map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={(currentValue) => {
                              handleAddTag(currentValue);
                              setIsTagOpen(false);
                            }}
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
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
