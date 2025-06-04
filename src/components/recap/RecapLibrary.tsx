import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  MoreVertical,
  Copy,
  Edit3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRecapStore,
  SavedRecap,
  RecapTone,
  RecapTarget,
} from "@/stores/recap-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { exportToPDF, exportToCSV, exportToMarkdown } from "@/lib/export-utils";

const FILTER_TONES: { value: RecapTone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "minimal", label: "Minimal" },
  { value: "resume-style", label: "Resume Style" },
  { value: "reflective", label: "Reflective" },
];

const FILTER_TARGETS: { value: RecapTarget; label: string }[] = [
  { value: "daily-standup", label: "Daily Standup" },
  { value: "weekly-report", label: "Weekly Report" },
  { value: "monthly-report", label: "Monthly Report" },
  { value: "career-highlight", label: "Career Highlight" },
  { value: "reflection", label: "Reflection" },
];

export function RecapLibrary() {
  const {
    getFilteredRecaps,
    librarySearch,
    setLibrarySearch,
    libraryFilters,
    setLibraryFilters,
    deleteRecap,
    setGeneratedContent,
    setGenerationConfig,
  } = useRecapStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const filteredRecaps = getFilteredRecaps();

  const handleViewRecap = (recap: SavedRecap) => {
    // Load the recap into the output panel
    setGeneratedContent(recap.content);
    setGenerationConfig({
      dateRange: recap.dateRange,
      tone: recap.tone,
      format: recap.format,
      target: recap.target,
      includeNotes: recap.includeNotes,
      taskStatusFilter: recap.taskStatusFilter,
    });
    toast.success("Recap loaded in output panel");
  };

  const handleCopyRecap = async (recap: SavedRecap) => {
    try {
      await navigator.clipboard.writeText(recap.content);
      toast.success("Recap copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy recap");
    }
  };

  const handleDeleteRecap = (recap: SavedRecap) => {
    if (confirm(`Are you sure you want to delete "${recap.title}"?`)) {
      deleteRecap(recap.id);
      toast.success("Recap deleted");
    }
  };

  const handleExportRecap = async (
    recap: SavedRecap,
    format: "pdf" | "csv" | "markdown"
  ) => {
    setIsExporting(recap.id);

    try {
      const exportOptions = {
        title: recap.title,
        dateRange: recap.dateRange,
        config: {
          tone: recap.tone,
          format: recap.format,
          target: recap.target,
          includeNotes: recap.includeNotes,
          taskStatusFilter: recap.taskStatusFilter,
          dateRange: recap.dateRange,
        },
      };

      switch (format) {
        case "pdf":
          await exportToPDF(recap.content, exportOptions);
          break;
        case "csv":
          await exportToCSV(recap.content, exportOptions);
          break;
        case "markdown":
          await exportToMarkdown(recap.content, exportOptions);
          break;
      }

      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleGenerateNewFromRecap = (recap: SavedRecap) => {
    // Load the recap's configuration for regeneration
    setGenerationConfig({
      dateRange: recap.dateRange,
      tone: recap.tone,
      format: recap.format,
      target: recap.target,
      includeNotes: recap.includeNotes,
      taskStatusFilter: recap.taskStatusFilter,
    });
    toast.success("Settings loaded - ready to regenerate");
  };

  const clearFilters = () => {
    setLibrarySearch("");
    setLibraryFilters({
      tags: [],
      dateRange: null,
      tone: null,
      target: null,
    });
  };

  const formatRecapDate = (dateRange: { start: string; end: string }) => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    if (dateRange.start === dateRange.end) {
      return format(start, "MMM d, yyyy");
    }

    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const getContentPreview = (content: string) => {
    return content.length > 150 ? content.slice(0, 150) + "..." : content;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recaps..."
          value={librarySearch}
          onChange={(e) => setLibrarySearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(libraryFilters.tone ||
            libraryFilters.target ||
            libraryFilters.tags.length > 0) && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {
                [
                  libraryFilters.tone,
                  libraryFilters.target,
                  ...libraryFilters.tags,
                ].filter(Boolean).length
              }
            </Badge>
          )}
        </Button>

        {(librarySearch ||
          libraryFilters.tone ||
          libraryFilters.target ||
          libraryFilters.tags.length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Tone Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tone</Label>
              <Select
                value={libraryFilters.tone || ""}
                onValueChange={(value: RecapTone) =>
                  setLibraryFilters({ tone: value || null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All tones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All tones</SelectItem>
                  {FILTER_TONES.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Target</Label>
              <Select
                value={libraryFilters.target || ""}
                onValueChange={(value: RecapTarget) =>
                  setLibraryFilters({ target: value || null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All targets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All targets</SelectItem>
                  {FILTER_TARGETS.map((target) => (
                    <SelectItem key={target.value} value={target.value}>
                      {target.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      <Separator />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredRecaps.length} recap{filteredRecaps.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {/* Recap List */}
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-3">
          {filteredRecaps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recaps found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRecaps.map((recap) => (
              <Card
                key={recap.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{recap.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatRecapDate(recap.dateRange)}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isExporting === recap.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewRecap(recap)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View & Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyRecap(recap)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Content
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGenerateNewFromRecap(recap)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Use Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleExportRecap(recap, "pdf")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportRecap(recap, "csv")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportRecap(recap, "markdown")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Markdown
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteRecap(recap)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {recap.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getContentPreview(recap.content)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {format(new Date(recap.createdAt), "MMM d, h:mm a")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {recap.format}
                      </Badge>
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
