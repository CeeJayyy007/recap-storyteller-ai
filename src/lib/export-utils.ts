import { RecapGenerationConfig } from "@/stores/recap-store";

interface ExportOptions {
  title: string;
  dateRange: { start: string; end: string };
  config: RecapGenerationConfig;
}

// PDF Export using browser's print functionality
export async function exportToPDF(
  content: string,
  options: ExportOptions
): Promise<void> {
  return new Promise((resolve) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      throw new Error(
        "Unable to open print window. Please check your popup blocker."
      );
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${options.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3 { color: #2563eb; margin-top: 1.5em; }
          h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5em; }
          ul, ol { padding-left: 1.5em; }
          li { margin: 0.5em 0; }
          pre { background: #f8f9fa; padding: 1em; border-radius: 4px; overflow-wrap: break-word; }
          .header { border-bottom: 1px solid #e5e7eb; margin-bottom: 2em; padding-bottom: 1em; }
          .meta { color: #6b7280; font-size: 0.9em; }
          @media print {
            body { margin: 0; padding: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${options.title}</h1>
          <div class="meta">
            <p>Date Range: ${formatDateRange(options.dateRange)}</p>
            <p>Tone: ${
              options.config.tone
            } | Target: ${options.config.target.replace("-", " ")} | Format: ${
      options.config.format
    }</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div class="content">
          ${formatContentForPrint(content, options.config.format)}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        resolve();
      }, 100);
    };
  });
}

// CSV Export - converts content to structured data
export async function exportToCSV(
  content: string,
  options: ExportOptions
): Promise<void> {
  const csvData = convertContentToCSV(content, options);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${sanitizeFilename(options.title)}.csv`);
}

// Markdown Export - downloads as .md file
export async function exportToMarkdown(
  content: string,
  options: ExportOptions
): Promise<void> {
  let markdownContent = content;

  // Add metadata header if not markdown format
  if (options.config.format !== "markdown") {
    markdownContent = `# ${options.title}

**Date Range:** ${formatDateRange(options.dateRange)}  
**Tone:** ${options.config.tone}  
**Target:** ${options.config.target.replace("-", " ")}  
**Generated:** ${new Date().toLocaleDateString()}

---

${markdownContent}`;
  }

  const blob = new Blob([markdownContent], {
    type: "text/markdown;charset=utf-8;",
  });
  downloadBlob(blob, `${sanitizeFilename(options.title)}.md`);
}

// Helper function to format date range
function formatDateRange(dateRange: { start: string; end: string }): string {
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (dateRange.start === dateRange.end) {
    return formatDate(start);
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
}

// Helper function to format content for printing
function formatContentForPrint(content: string, format: string): string {
  if (format === "html") {
    return content;
  }

  if (format === "markdown") {
    // Simple markdown to HTML conversion for basic formatting
    return content
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gms, "<ul>$1</ul>")
      .replace(/\n/g, "<br>");
  }

  // Plain text - wrap in pre tag to preserve formatting
  return `<pre>${content}</pre>`;
}

// Helper function to convert content to CSV format
function convertContentToCSV(content: string, options: ExportOptions): string {
  const rows: string[][] = [];

  // Add header row
  rows.push(["Field", "Value"]);

  // Add metadata
  rows.push(["Title", options.title]);
  rows.push(["Date Range", formatDateRange(options.dateRange)]);
  rows.push(["Tone", options.config.tone]);
  rows.push(["Target", options.config.target.replace("-", " ")]);
  rows.push(["Format", options.config.format]);
  rows.push(["Generated", new Date().toISOString()]);
  rows.push([""]); // Empty row separator

  // Extract content sections
  const lines = content.split("\n");
  let currentSection = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Check if it's a header
    if (
      trimmedLine.startsWith("###") ||
      trimmedLine.startsWith("##") ||
      trimmedLine.startsWith("#")
    ) {
      currentSection = trimmedLine.replace(/^#+\s*/, "").replace(/[()]/g, "");
      rows.push(["Section", currentSection]);
    }
    // Check if it's a list item
    else if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
      const item = trimmedLine
        .replace(/^[-*]\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1");
      if (currentSection) {
        rows.push([currentSection, item]);
      } else {
        rows.push(["Item", item]);
      }
    }
    // Regular content
    else if (trimmedLine.length > 0) {
      rows.push(["Content", trimmedLine]);
    }
  }

  // Convert to CSV format
  return rows
    .map((row) =>
      row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// Helper function to trigger download
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
