import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateStore } from "@/stores/date-store";
import { useTaskStore } from "@/stores/task-store";
import { getTaskStatusForDate } from "@/types/task";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedDate,
    currentMonth,
    setSelectedDate,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousDay,
    goToNextDay,
  } = useDateStore();

  const { tasks } = useTaskStore();

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonthYear = (date: Date) => {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      });
    }

    // Next month's leading days
    const remainingSlots = 42 - days.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      });
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // const isNextDayDisabled = () => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const selected = new Date(selectedDate);
  //   selected.setHours(0, 0, 0, 0);
  //   return selected >= today;
  // };

  const hasTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    // Check if any tasks have a valid status for this date (including carried-over tasks)
    return tasks.some((task) => {
      const status = getTaskStatusForDate(task, dateString);
      return status !== null;
    });
  };

  const days = getDaysInMonth(currentMonth);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsOpen(false);
    }
  };

  const handlePreviousDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPreviousDay();
  };

  const handleNextDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNextDay();
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="h-8 w-8 p-0 hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-8 px-2 text-sm font-medium hover:bg-background"
              >
                {formatSelectedDate(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              side="right"
              align="start"
              sideOffset={8}
            >
              <ShadcnCalendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            // disabled={isNextDayDisabled()}
            className="h-8 w-8 p-0 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Today button - only visible above Tasks */}
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-sm px-2 h-8"
          >
            <CalendarDaysIcon className="w-4 h-4 " />
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}
