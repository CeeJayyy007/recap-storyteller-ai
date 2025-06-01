import {
  PlusIcon,
  Clock,
  CheckCircle,
  CalendarIcon,
  RotateCw,
} from "lucide-react";
import { Calendar } from "./Calendar";
import { SearchInput } from "../common/SearchInput";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ModalContainer } from "../modals/ModalContainer";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useDateStore } from "@/stores/date-store";

interface TaskbarProps {
  isVisible: boolean;
}

export function Taskbar({ isVisible }: TaskbarProps) {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { selectedDate } = useDateStore();
  const {
    openAddTask,
    openViewTask,
    openEditTask,
    openAddNote,
    openDeleteTask,
  } = useModalStore();

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        status: task.status === "completed" ? "pending" : "completed",
      });
    }
  };

  const handleView = (task: Task) => {
    openViewTask(task);
  };

  const handleEdit = (task: Task) => {
    openEditTask(task);
  };

  const handleNote = (task: Task) => {
    openAddNote(task);
  };

  const handleDelete = (task: Task) => {
    openDeleteTask(task);
  };

  const getFilteredAndGroupedTasks = () => {
    const selectedDateStr = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const isToday = selectedDateStr === todayStr;

    let filteredTasks: Task[];

    if (isToday) {
      // For today: show all pending tasks + completed tasks from today
      filteredTasks = tasks.filter((task) => {
        return (
          task.status === "pending" ||
          (task.status === "completed" && task.date === selectedDateStr)
        );
      });
    } else {
      // For other dates: show only tasks from that specific date
      filteredTasks = tasks.filter((task) => task.date === selectedDateStr);
    }

    // Group tasks by status
    const carriedOverTasks = filteredTasks.filter(
      (task) => task.status === "pending" && task.date < selectedDateStr
    );

    const pendingTasks = filteredTasks.filter(
      (task) => task.status === "pending" && task.date === selectedDateStr
    );

    const completedTasks = filteredTasks.filter(
      (task) => task.status === "completed" && task.date === selectedDateStr
    );

    return {
      carriedOver: carriedOverTasks,
      pending: pendingTasks,
      completed: completedTasks,
    };
  };

  const renderTaskSection = (
    title: string,
    tasks: Task[],
    icon: React.ReactNode,
    colorClass: string
  ) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-6">
        <div
          className={`flex items-center gap-2 mb-3 pb-2 border-b ${colorClass}`}
        >
          {icon}
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground">
            ({tasks.length})
          </span>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onView={handleView}
              onEdit={handleEdit}
              onNote={handleNote}
              onDelete={handleDelete}
              selectedDate={selectedDate.toISOString()}
            />
          ))}
        </div>
      </div>
    );
  };

  const groupedTasks = getFilteredAndGroupedTasks();

  return (
    <>
      <aside
        className={`fixed top-0 left-20 h-full w-80 bg-background border-l border-border z-40 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "hidden"
        }`}
      >
        <div className="flex flex-col h-full p-4 border-r border-border">
          <div className="border-b border-border">
            <Calendar />

            <SearchInput
              placeholder="Search tasks..."
              onSearch={handleSearch}
            />
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Tasks</h2>
              <Button size="sm" className="h-8 w-8 p-0" onClick={openAddTask}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Task Groups */}
          <ScrollArea className="flex-1 overflow-y-auto h-[calc(100vh-100px)] mr-[-12px]">
            <div className="pr-4 my-2">
              {/* Carried Over Tasks */}
              {renderTaskSection(
                "Carried Over",
                groupedTasks.carriedOver,
                <RotateCw className="h-4 w-4 text-red-600 dark:text-red-400" />,
                "border-red-200 dark:border-red-800"
              )}

              {/* Pending Tasks */}
              {renderTaskSection(
                "Pending",
                groupedTasks.pending,
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
                "border-orange-200 dark:border-orange-800"
              )}

              {/* Completed Tasks */}
              {renderTaskSection(
                "Completed",
                groupedTasks.completed,
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
                "border-green-200 dark:border-green-800"
              )}

              {/* Empty State */}
              {groupedTasks.carriedOver.length === 0 &&
                groupedTasks.pending.length === 0 &&
                groupedTasks.completed.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No tasks for this date</p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Modal Container */}
      <ModalContainer />
    </>
  );
}
