import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "./DateRangePicker";
import { generateRecap } from "@/lib/recap-generator";
import {
  useRecapStore,
  RecapTone,
  RecapTarget,
  RecapFormat,
} from "@/stores/recap-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import {
  Sparkles,
  Filter,
  FileText,
  Target,
  Palette,
  Download,
  CheckCircle,
  Clock,
  RotateCw,
} from "lucide-react";

const TONES: {
  value: RecapTone;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "formal",
    label: "Formal",
    description: "Professional reports & resumes",
    icon: "👔",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Internal team updates",
    icon: "😊",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Quick, concise summaries",
    icon: "✨",
  },
  {
    value: "resume-style",
    label: "Resume Style",
    description: "LinkedIn & CV ready",
    icon: "📄",
  },
  {
    value: "reflective",
    label: "Reflective",
    description: "Deep insights & learnings",
    icon: "💭",
  },
];

const TARGETS: { value: RecapTarget; label: string; description: string }[] = [
  {
    value: "daily-standup",
    label: "Daily Standup",
    description: "Quick progress update",
  },
  {
    value: "weekly-report",
    label: "Weekly Report",
    description: "Comprehensive week overview",
  },
  {
    value: "monthly-report",
    label: "Monthly Report",
    description: "Month-end summary",
  },
  {
    value: "career-highlight",
    label: "Career Highlight",
    description: "Achievement showcase",
  },
  {
    value: "reflection",
    label: "Reflection",
    description: "Learning & growth insights",
  },
];

const FORMATS: { value: RecapFormat; label: string; description: string }[] = [
  {
    value: "markdown",
    label: "Markdown",
    description: "Rich formatting with headers",
  },
  {
    value: "plain-text",
    label: "Plain Text",
    description: "Simple, clean text",
  },
  { value: "html", label: "HTML", description: "Web-ready markup" },
];

const TASK_STATUS_OPTIONS = [
  { value: "all", label: "All Tasks", icon: <Filter className="h-4 w-4" /> },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  },
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "carried-over",
    label: "Carried Over",
    icon: <RotateCw className="h-4 w-4 text-red-500" />,
  },
];

export function RecapGeneratorPanel() {
  const {
    currentConfig,
    setGenerationConfig,
    setGeneratedContent,
    setIsGenerating,
    isGenerating,
  } = useRecapStore();

  const { getTasksForDateRange } = useTaskStore();
  const { notes } = useNoteStore();

  const [previewStats, setPreviewStats] = useState<{
    taskCount: number;
    noteCount: number;
  } | null>(null);

  // Calculate preview stats when config changes
  const updatePreviewStats = () => {
    const tasks = getTasksForDateRange(
      currentConfig.dateRange.start,
      currentConfig.dateRange.end
    );
    const dateRange = currentConfig.dateRange;
    const notesInRange = notes.filter(
      (note) => note.date >= dateRange.start && note.date <= dateRange.end
    );

    setPreviewStats({
      taskCount: tasks.length,
      noteCount: notesInRange.length,
    });
  };

  const handleGenerateRecap = async () => {
    setIsGenerating(true);

    try {
      // Get tasks and notes for the date range
      const tasks = getTasksForDateRange(
        currentConfig.dateRange.start,
        currentConfig.dateRange.end
      );
      const dateRange = currentConfig.dateRange;
      const notesInRange = currentConfig.includeNotes
        ? notes.filter(
            (note) => note.date >= dateRange.start && note.date <= dateRange.end
          )
        : [];

      // Generate the recap content
      const content = await generateRecap({
        tasks,
        notes: notesInRange,
        config: currentConfig,
      });

      setGeneratedContent(content);
    } catch (error) {
      console.error("Failed to generate recap:", error);
      setGeneratedContent("Failed to generate recap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskStatusChange = (status: string, checked: boolean) => {
    const currentFilters = currentConfig.taskStatusFilter;

    if (status === "all") {
      setGenerationConfig({
        taskStatusFilter: checked ? ["all"] : [],
      });
    } else {
      let newFilters;
      if (checked) {
        newFilters = [...currentFilters.filter((f) => f !== "all"), status];
      } else {
        newFilters = currentFilters.filter((f) => f !== status);
      }

      // If all specific statuses are selected, switch to "all"
      const specificStatuses = ["completed", "pending", "carried-over"];
      if (specificStatuses.every((s) => newFilters.includes(s))) {
        newFilters = ["all"];
      }

      setGenerationConfig({
        taskStatusFilter: newFilters,
      });
    }
  };

  // Update stats when config changes
  useEffect(() => {
    updatePreviewStats();
  }, [currentConfig.dateRange, currentConfig.includeNotes]);

  return (
    <div className="p-4 space-y-6">
      {/* Date Range */}
      <div className="space-y-3">
        <DateRangePicker
          value={currentConfig.dateRange}
          onChange={(dateRange) => setGenerationConfig({ dateRange })}
        />
      </div>

      <Separator />

      {/* Task Status Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label className="text-sm font-medium">Task Status Filter</Label>
        </div>

        <div className="space-y-2">
          {TASK_STATUS_OPTIONS.map((option) => {
            const isChecked =
              currentConfig.taskStatusFilter.includes(option.value) ||
              (option.value !== "all" &&
                currentConfig.taskStatusFilter.includes("all"));

            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleTaskStatusChange(option.value, !!checked)
                  }
                />
                <Label
                  htmlFor={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  {option.icon}
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Include Notes Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <Label htmlFor="include-notes" className="text-sm font-medium">
            Include Notes
          </Label>
        </div>
        <Switch
          id="include-notes"
          checked={currentConfig.includeNotes}
          onCheckedChange={(includeNotes) =>
            setGenerationConfig({ includeNotes })
          }
        />
      </div>

      <Separator />

      {/* Tone Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <Label className="text-sm font-medium">Tone</Label>
        </div>

        <Select
          value={currentConfig.tone}
          onValueChange={(tone: RecapTone) => setGenerationConfig({ tone })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((tone) => (
              <SelectItem key={tone.value} value={tone.value}>
                <div className="flex items-center gap-2">
                  <span>{tone.icon}</span>
                  <div>
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {tone.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Target Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <Label className="text-sm font-medium">Summary Target</Label>
        </div>

        <Select
          value={currentConfig.target}
          onValueChange={(target: RecapTarget) =>
            setGenerationConfig({ target })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TARGETS.map((target) => (
              <SelectItem key={target.value} value={target.value}>
                <div>
                  <div className="font-medium">{target.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {target.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Output Format */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <Label className="text-sm font-medium">Output Format</Label>
        </div>

        <Select
          value={currentConfig.format}
          onValueChange={(format: RecapFormat) =>
            setGenerationConfig({ format })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMATS.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                <div>
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {format.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview Stats */}
      {previewStats && (
        <Card className="p-3 bg-muted/50">
          <div className="text-xs text-muted-foreground mb-1">Preview</div>
          <div className="flex gap-4 text-sm">
            <span>{previewStats.taskCount} tasks</span>
            <span>{previewStats.noteCount} notes</span>
          </div>
        </Card>
      )}

      <Separator />

      {/* Generate Button */}
      <Button
        onClick={handleGenerateRecap}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Recap
          </>
        )}
      </Button>
    </div>
  );
}
