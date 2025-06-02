import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNoteStore } from "@/stores/note-store";
import { useModalStore } from "@/stores/modal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, Edit3Icon } from "lucide-react";
import { NotesCard } from "@/components/notes/NotesCard";
import { Note } from "@/types/note";

const Notes = () => {
  const navigate = useNavigate();
  const { notes, addNote, deleteNote, searchNotesByTitle } = useNoteStore();
  const { openAddTaskToNote, openDeleteNote } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");

  const displayedNotes = searchQuery ? searchNotesByTitle(searchQuery) : notes;

  const handleCreateNote = () => {
    const newNote = addNote({
      user_id: "1", // Replace with actual user ID
      content: "",
      date: new Date().toISOString().split("T")[0],
      linkedTaskIds: [],
    });
    navigate(`/notes/${newNote.id}`);
  };

  const handleViewNote = (note: Note) => {
    navigate(`/notes/${note.id}`);
  };

  const handleEditNote = (note: Note) => {
    navigate(`/notes/${note.id}`);
  };

  const handleAddTask = (note: Note) => {
    // Open the AddTaskToNote modal with the selected note
    openAddTaskToNote(note);
  };

  const handleDeleteNote = (note: Note) => {
    openDeleteNote(note);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Container with max width */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground mt-1">
              Manage your notes and ideas
            </p>
          </div>
          <Button onClick={handleCreateNote} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {displayedNotes.length === 0 ? (
          <div className="text-center py-20">
            <Edit3Icon className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-3">No notes found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms to find what you're looking for"
                : "Create your first note to get started with organizing your ideas"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNote} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedNotes.map((note) => (
              <NotesCard
                key={note.id}
                note={note}
                onView={handleViewNote}
                onEdit={handleEditNote}
                onAddTask={handleAddTask}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
