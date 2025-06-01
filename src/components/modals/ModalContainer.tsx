import { AddTaskModal } from "./AddTaskModal";
import { ViewTaskModal } from "./ViewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { AddNoteModal } from "./AddNoteModal";
import { DeleteTaskModal } from "./DeleteTaskModal";

export function ModalContainer() {
  return (
    <>
      <AddTaskModal />
      <ViewTaskModal />
      <EditTaskModal />
      <AddNoteModal />
      <DeleteTaskModal />
    </>
  );
} 