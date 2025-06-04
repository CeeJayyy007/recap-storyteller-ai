import { AddTaskModal } from "./AddTaskModal";
import { ViewTaskModal } from "./ViewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { AddNoteModal } from "./AddNoteModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { SearchModal } from "./SearchModal";
import { AddTaskToNoteModal } from "./AddTaskToNoteModal";
import { DeleteNoteModal } from "./DeleteNoteModal";
import { NoteInfoModal } from "./NoteInfoModal";
import { DateModal } from "../calendar/DateModal";

export function ModalContainer() {
  return (
    <>
      <AddTaskModal />
      <ViewTaskModal />
      <EditTaskModal />
      <AddNoteModal />
      <DeleteTaskModal />
      <SearchModal />
      <AddTaskToNoteModal />
      <DeleteNoteModal />
      <NoteInfoModal />
      <DateModal />
    </>
  );
}
