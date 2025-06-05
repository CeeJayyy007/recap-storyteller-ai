import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Download,
  Save,
  FileText,
  Eye,
  Edit3,
  Code,
  Globe,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { useRecapStore } from "@/stores/recap-store";
import { exportToPDF, exportToCSV, exportToMarkdown } from "@/lib/export-utils";
import { toast } from "sonner";

export function RecapOutputPanel() {
  const {
    generatedContent,
    setGeneratedContent,
    currentConfig,
    saveRecap,
    isGenerating,
  } = useRecapStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleStartEdit = () => {
    setEditedContent(generatedContent);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setGeneratedContent(editedContent);
    setIsEditing(false);
    toast.success("Changes saved!");
  };

  const handleCancelEdit = () => {
    setEditedContent("");
    setIsEditing(false);
  };

  const handleSaveRecap = () => {
    if (!saveTitle.trim()) {
      toast.error("Please enter a title for your recap");
      return;
    }

    const tags = generateTags();

    const savedId = saveRecap({
      title: saveTitle.trim(),
      content: generatedContent,
      dateRange: currentConfig.dateRange,
      tone: currentConfig.tone,
      format: currentConfig.format,
      target: currentConfig.target,
      includeNotes: currentConfig.includeNotes,
      taskStatusFilter: currentConfig.taskStatusFilter,
      tags,
    });

    setSaveTitle("");
    setShowSaveDialog(false);
    toast.success("Recap saved to library!");
  };

  const generateTags = (): string[] => {
    const tags: string[] = [];

    // Add date-based tags
    const start = new Date(currentConfig.dateRange.start);
    const end = new Date(currentConfig.dateRange.end);

    if (start.toDateString() === end.toDateString()) {
      tags.push("daily");
    } else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        tags.push("weekly");
      } else if (diffDays <= 31) {
        tags.push("monthly");
      } else {
        tags.push("long-term");
      }
    }

    // Add config-based tags
    tags.push(currentConfig.tone);
    tags.push(currentConfig.target);

    return tags;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(generatedContent, {
        title: saveTitle || "Recap Export",
        dateRange: currentConfig.dateRange,
        config: currentConfig,
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await exportToCSV(generatedContent, {
        title: saveTitle || "Recap Export",
        dateRange: currentConfig.dateRange,
        config: currentConfig,
      });
      toast.success("CSV exported successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = async () => {
    setIsExporting(true);
    try {
      await exportToMarkdown(generatedContent, {
        title: saveTitle || "Recap Export",
        dateRange: currentConfig.dateRange,
        config: currentConfig,
      });
      toast.success("Markdown file exported successfully!");
    } catch (error) {
      toast.error("Failed to export Markdown");
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = () => {
    switch (currentConfig.format) {
      case "markdown":
        return <FileText className="h-4 w-4" />;
      case "html":
        return <Globe className="h-4 w-4" />;
      case "plain-text":
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <div>
            <h3 className="font-medium">Generating your recap...</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing {currentConfig.taskStatusFilter.join(", ")} tasks
              {currentConfig.includeNotes && " and notes"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedContent) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">No recap generated yet</h3>
            <p className="text-sm text-muted-foreground">
              Configure your settings in the left panel and click "Generate
              Recap" to create your summary.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with config info and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getFormatIcon()}
          <Badge variant="outline" className="text-xs">
            {currentConfig.format}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {currentConfig.tone}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {currentConfig.target.replace("-", " ")}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>

          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleStartEdit}>
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Content Display/Edit */}
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="edit-content">Edit Content</Label>
            <Textarea
              id="edit-content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Edit your recap content..."
            />
          </div>
        ) : (
          <Card className="p-4">
            {currentConfig.format === "markdown" ? (
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            ) : currentConfig.format === "html" ? (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {generatedContent}
              </pre>
            )}
          </Card>
        )}
      </div>

      <Separator />

      {/* Save Section */}
      {!showSaveDialog ? (
        <Button
          variant="default"
          onClick={() => setShowSaveDialog(true)}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save to Library
        </Button>
      ) : (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="save-title">Recap Title</Label>
            <Input
              id="save-title"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Enter a title for this recap..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRecap} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Recap
            </Button>
          </div>
        </Card>
      )}

      <Separator />

      {/* Export Options */}
      <div className="space-y-3">
        <Label>Export Options</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMarkdown}
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            .md
          </Button>
        </div>
      </div>
    </div>
  );
}
