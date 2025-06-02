import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X, Plus, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useTagStore } from "@/stores/tag-store";
import { useDateStore } from "@/stores/date-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  linkedNoteId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.date({
    required_error: "Please select a creation date for the task",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function AddTaskModal() {
  const { isAddTaskOpen, closeAddTask } = useModalStore();
  const { addTask } = useTaskStore();
  const { notes, getNoteById } = useNoteStore();
  const { tags, getOrCreateTag } = useTagStore();
  const { selectedDate } = useDateStore();

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      linkedNoteId: "",
      tags: [],
      createdAt: selectedDate,
    },
  });

  useEffect(() => {
    form.setValue("createdAt", selectedDate);
  }, [selectedDate, form]);

  const onSubmit = async (data: FormData) => {

    // If a note is linked, we could open it here
    if (data.linkedNoteId) {
      console.log("Task created and linked to note:", data.linkedNoteId);
      // TODO: Open note editor
    }

    form.reset();
    setSelectedTags([]);
    closeAddTask();
  };

  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
      const tag = getOrCreateTag(tagName.trim());
      setSelectedTags([...selectedTags, tag.name]);
    }
    setTagInput("");
    setIsTagOpen(false);
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
  };

  const availableNotes = notes.filter((note) => note.title);

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={closeAddTask}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Create a new task to help you stay on top of your goals.
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
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Creation Date *</FormLabel>
                  <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsDateOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                        <CommandList>
                          <CommandEmpty>No notes found.</CommandEmpty>
                          <CommandGroup>
                            {availableNotes.map((note) => (
                              <CommandItem
                                key={note.id}
                                value={note.title}
                                onSelect={() => {
                                  form.setValue(
                                    "linkedNoteId",
                                    field.value === note.id ? "" : note.id
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
                        </CommandList>
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
              <Button type="button" variant="outline" onClick={closeAddTask}>
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
