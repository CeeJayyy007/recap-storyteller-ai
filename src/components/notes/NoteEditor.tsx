import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";

// Plugins
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import Code from "@yoopta/code";
import Image from "@yoopta/image";
import Accordion from "@yoopta/accordion";
import Divider from "@yoopta/divider";
import Table from "@yoopta/table";
import Callout from "@yoopta/callout";

// Tools
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";

// Marks
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";

// Store and components
import { useNoteStore } from "@/stores/note-store";
import { NotesHeader } from "./NotesHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImageToLocal, validateImageFile } from "@/lib/image-upload";
import { toast } from "sonner";

const plugins = [
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Paragraph,
  Blockquote,
  BulletedList,
  NumberedList,
  TodoList,
  Code.extend({
    options: {
      languages: [
        "javascript",
        "typescript",
        "python",
        "java",
        "css",
        "html",
        "bash",
        "json",
      ],
      theme: "github-dark",
    },
  }),
  Image.extend({
    options: {
      async upload(file: File) {
        try {
          console.log("Starting image upload...", file.name);

          if (!validateImageFile(file)) {
            throw new Error("Invalid file type or size too large (max 5MB)");
          }

          const imageUrl = await uploadImageToLocal(file);
          console.log("Image upload successful");

          return {
            src: imageUrl,
            alt: file.name,
            sizes: {
              width: 500,
              height: "auto",
            },
          };
        } catch (error) {
          console.error("Image upload failed:", error);
          toast.error("Failed to upload image");
          throw error;
        }
      },
    },
  }),
  Accordion,
  Divider,
  Table,
  Callout,
];

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

// Default content structure with HeadingOne as first block
const createDefaultContent = (): YooptaContentValue => {
  const headingId = crypto.randomUUID();
  return {
    [headingId]: {
      id: headingId,
      type: "HeadingOne",
      value: [
        {
          id: crypto.randomUUID(),
          type: "heading-one",
          children: [{ text: "" }],
        },
      ],
      meta: { order: 0, depth: 0 },
    },
  };
};

export function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNoteById, updateNote, deleteNote } = useNoteStore();

  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();
  const [note, setNote] = useState(getNoteById(id!));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/notes");
      return;
    }

    const foundNote = getNoteById(id);
    if (!foundNote) {
      navigate("/notes");
      return;
    }

    setNote(foundNote);

    // Handle content parsing
    try {
      if (typeof foundNote.content === "string") {
        if (!foundNote.content.trim()) {
          // If content is empty, set default with HeadingOne
          setValue(createDefaultContent());
        } else {
          // If content is string, create paragraph structure
          const defaultContent: YooptaContentValue = {
            [crypto.randomUUID()]: {
              id: crypto.randomUUID(),
              type: "Paragraph",
              value: [
                {
                  id: crypto.randomUUID(),
                  type: "paragraph",
                  children: [{ text: foundNote.content }],
                },
              ],
              meta: { order: 0, depth: 0 },
            },
          };
          setValue(defaultContent);
        }
      } else if (
        foundNote.content &&
        Object.keys(foundNote.content).length > 0
      ) {
        setValue(foundNote.content);
      } else {
        // Empty content, use default with HeadingOne
        setValue(createDefaultContent());
      }
    } catch (error) {
      console.error("Error parsing note content:", error);
      setValue(createDefaultContent());
    }

    setIsLoading(false);
  }, [id, getNoteById, navigate]);

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);

    // Auto-save after 1 second of inactivity
    if (note) {
      const timeoutId = setTimeout(() => {
        updateNote(note.id, {
          content: newValue,
          // Extract title from first heading or paragraph if no title exists
          title: note.title || extractTitleFromContent(newValue),
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  const extractTitleFromContent = (content: YooptaContentValue): string => {
    // Try to find first heading
    const blocks = Object.values(content);
    const firstHeading = blocks.find(
      (block) =>
        block.type === "HeadingOne" ||
        block.type === "HeadingTwo" ||
        block.type === "HeadingThree"
    );

    if (firstHeading?.value?.[0]?.children?.[0]?.text) {
      return firstHeading.value[0].children[0].text.slice(0, 100);
    }

    // Fallback to first paragraph
    const firstBlock = blocks[0];
    if (firstBlock?.value?.[0]?.children?.[0]?.text) {
      return firstBlock.value[0].children[0].text.slice(0, 100);
    }

    return "Untitled Note";
  };

  const handleDelete = () => {
    if (note) {
      deleteNote(note.id);
      navigate("/notes");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        {/* Fixed header skeleton */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex justify-between items-start pb-2 px-4 pt-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 overflow-auto p-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <h2 className="text-xl font-semibold mb-2">Note not found</h2>
        <p className="text-muted-foreground mb-4">
          The note you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/notes")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background">
        <NotesHeader note={note} onDelete={handleDelete} />
      </div>

      {/* Scrollable Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-slate-800 min-h-full rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <YooptaEditor
                editor={editor}
                plugins={plugins}
                marks={MARKS}
                tools={TOOLS}
                value={value}
                onChange={onChange}
                placeholder="Start with a heading..."
                autoFocus
                style={{
                  width: "100%",
                  minHeight: "calc(100vh - 200px)",
                  paddingBottom: "100px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
