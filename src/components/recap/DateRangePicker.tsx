import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";

interface DateRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const PRESET_RANGES = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      const dateStr = format(today, "yyyy-MM-dd");
      return { start: dateStr, end: dateStr };
    },
  },
  {
    label: "This Week",
    getValue: () => {
      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(today, { weekStartsOn: 1 });
      return {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const today = new Date();
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      return {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = new Date();
      const start = subDays(today, 6);
      return {
        start: format(start, "yyyy-MM-dd"),
        end: format(today, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      const start = subDays(today, 29);
      return {
        start: format(start, "yyyy-MM-dd"),
        end: format(today, "yyyy-MM-dd"),
      };
    },
  },
];

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample events for demonstration
  //   const [events] = useState([
  //     { title: "Kick-off Marc <> Nico", time: "8 - 8:30 AM", type: "upcoming" },
  //     { title: "Lunch with Maria", time: "12 - 12:30 PM", type: "upcoming" },
  //     { title: "Weekly Stand-up", time: "3 - 3:30 PM", type: "upcoming" },
  //     { title: "Dinner with Mia", time: "7 - 8 PM", type: "upcoming" },
  //   ]);

  const formatDateRange = (range: DateRange) => {
    const start = new Date(range.start);
    const end = new Date(range.end);

    if (range.start === range.end) {
      return format(start, "MMM d, yyyy");
    }

    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
      }
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }

    return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
  };

  const getPresetLabel = (range: DateRange) => {
    for (const preset of PRESET_RANGES) {
      const presetRange = preset.getValue();
      if (presetRange.start === range.start && presetRange.end === range.end) {
        return preset.label;
      }
    }
    return null;
  };

  const handlePresetClick = (preset: (typeof PRESET_RANGES)[0]) => {
    const newRange = preset.getValue();
    onChange(newRange);
  };

  //   const filteredEvents = events.filter((event) =>
  //     event.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Date Range Display */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formatDateRange(value)}</span>
              {getPresetLabel(value) && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getPresetLabel(value)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[500px] p-0" align="start" side="bottom">
            <div className="flex">
              {/* Calendar Section */}
              <div className="flex-1 border-r border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentMonth(subMonths(currentMonth, 1))
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold">
                      {format(currentMonth, "MMMM yyyy")}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentMonth(addMonths(currentMonth, 1))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                      <div
                        key={day}
                        className="p-2 text-muted-foreground font-medium"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days - Simplified for demo */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = addDays(startOfMonth(currentMonth), i - 6);
                      const isCurrentMonth =
                        date.getMonth() === currentMonth.getMonth();
                      const dateStr = format(date, "yyyy-MM-dd");
                      const isInRange =
                        dateStr >= value.start && dateStr <= value.end;
                      const isStart = dateStr === value.start;
                      const isEnd = dateStr === value.end;

                      return (
                        <button
                          key={i}
                          className={cn(
                            "p-2 text-sm rounded-lg hover:bg-accent transition-colors",
                            !isCurrentMonth && "text-muted-foreground/50",
                            isInRange && "bg-primary/10",
                            (isStart || isEnd) &&
                              "bg-primary text-primary-foreground",
                            date.toDateString() === new Date().toDateString() &&
                              !isInRange &&
                              "bg-accent"
                          )}
                          onClick={() => {
                            if (!value.start || (value.start && value.end)) {
                              // Start new selection
                              onChange({ start: dateStr, end: dateStr });
                            } else if (dateStr < value.start) {
                              // Selected date is before start
                              onChange({ start: dateStr, end: value.start });
                            } else {
                              // Selected date is after start
                              onChange({ start: value.start, end: dateStr });
                            }
                          }}
                        >
                          {format(date, "d")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preset Buttons */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_RANGES.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetClick(preset)}
                        className="justify-start"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Events Section */}
              {/* <div className="w-80 bg-muted/10 dark:bg-muted/5">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for event titles"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Upcoming
                    </h4>
                    {filteredEvents.map((event, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-sm font-medium">
                            {event.title}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground ml-4">
                          {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
