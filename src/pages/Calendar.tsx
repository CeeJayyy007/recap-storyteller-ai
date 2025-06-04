import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { DateModal } from "@/components/calendar/DateModal";
import { useModalStore } from "@/stores/modal-store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { openAddTask, openSearch } = useModalStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSearch = () => {
    openSearch();
  };

  const handleAddEvent = () => {
    openAddTask();
  };

  // Generate calendar days
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Review your tasks and notes easily
          </p>
        </div>

        {/* Centered Calendar Container */}
        <div className="flex flex-col items-center  space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="text-lg font-semibold min-w-[140px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="text-sm ml-2"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Today
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearch}
                  className="pl-9 w-64"
                />
              </div>

              {/* Add Event Button */}
              <Button onClick={handleAddEvent} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="w-full border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/50">
              {WEEKDAYS.map((weekday) => (
                <div
                  key={weekday}
                  className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
                >
                  {weekday}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day) => (
                <CalendarDay
                  key={day.toISOString()}
                  date={day}
                  isCurrentMonth={isSameMonth(day, currentDate)}
                  isToday={isSameDay(day, new Date())}
                  isSelected={
                    selectedDate ? isSameDay(day, selectedDate) : false
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date Modal */}
      <DateModal />
    </div>
  );
};

export default Calendar;
