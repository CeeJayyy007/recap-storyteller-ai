import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useModalStore } from "@/stores/modal-store";
import { useNoteStore } from "@/stores/note-store";
import { useTaskStore } from "@/stores/task-store";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AddNoteModal() {
  const { isAddNoteOpen, selectedTask, closeAddNote } = useModalStore();
  const { addNote, linkNoteToTask } = useNoteStore();
  const { linkTaskToNote } = useTaskStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedTask) return;

    // Create the note with basic content structure
    // const noteContent = {
    //   blocks: [
    //     {
    //       id: crypto.randomUUID(),
    //       type: "paragraph",
    //       data: {
    //         text: data.content || ""
    //       }
    //     }
    //   ]
    // };

    const newNote = addNote({
      user_id: "user-1", // TODO: Get from auth context
      title: data.title,
      content: data.content,
      date: selectedTask.date,
      linkedTaskIds: [selectedTask.id],
    });

    // Link the task to this note
    linkTaskToNote(selectedTask.id, newNote.id);

    // TODO: Open the note editor with the new note
    console.log("Note created and linked to task:", newNote.id);

    form.reset();
    closeAddNote();
  };

  return (
    <Dialog open={isAddNoteOpen} onOpenChange={closeAddNote}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note for Task</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Create a new note to help you stay on top of your goals.
          </DialogDescription>
        </DialogHeader>

        {selectedTask && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Creating note for:</p>
            <p className="font-medium">{selectedTask.title}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter initial note content..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeAddNote}>
                Cancel
              </Button>
              <Button type="submit">Create Note</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
