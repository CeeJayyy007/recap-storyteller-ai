import { Task, getTaskStatusForDate } from "@/types/task";
import { Note } from "@/types/note";
import { RecapGenerationConfig } from "@/stores/recap-store";
import { format, parseISO } from "date-fns";

interface GenerateRecapParams {
  tasks: Task[];
  notes: Note[];
  config: RecapGenerationConfig;
}

// AI Prompt Templates
const generatePrompt = (params: GenerateRecapParams): string => {
  const { tasks, notes, config } = params;
  const { dateRange, tone, target, includeNotes, taskStatusFilter } = config;

  const startDate = format(parseISO(dateRange.start), "MMMM d, yyyy");
  const endDate = format(parseISO(dateRange.end), "MMMM d, yyyy");
  const dateRangeText =
    dateRange.start === dateRange.end
      ? startDate
      : `${startDate} to ${endDate}`;

  const toneInstructions = {
    formal:
      "Use professional language suitable for reports or resumes. Be concise and achievement-focused.",
    friendly:
      "Use warm, conversational tone suitable for team updates. Be encouraging and collaborative.",
    minimal:
      "Use extremely concise language. Focus on key facts and brief bullet points.",
    "resume-style":
      "Use action-oriented language with quantifiable achievements. Ready for LinkedIn or CV.",
    reflective:
      "Use thoughtful, introspective language. Focus on learnings, growth, and insights.",
  };

  const targetInstructions = {
    "daily-standup":
      "Structure as: What I did, What I'm doing next, Any blockers. Keep it brief.",
    "weekly-report":
      "Group activities by theme/project. Include accomplishments and next steps.",
    "monthly-report":
      "Provide high-level summary with key metrics, major achievements, and strategic insights.",
    "career-highlight":
      "Focus on significant achievements, impact, and professional growth moments.",
    reflection:
      "Emphasize learnings, challenges overcome, and personal/professional development.",
  };

  // Filter tasks based on status filter and date range
  const filteredTasks = tasks.filter((task) => {
    if (taskStatusFilter.includes("all")) return true;

    // Check task status for the date range
    const taskStatus = getTaskStatusForDate(task, dateRange.end); // Use end date for status
    return taskStatus && taskStatusFilter.includes(taskStatus);
  });

  // Group tasks by status
  const completedTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "completed";
  });

  const pendingTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "pending";
  });

  const carriedOverTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "carried-over";
  });

  return `
You are an assistant tasked with creating a professional summary based on the following activity between ${dateRangeText}.

### Instructions:
${toneInstructions[tone]}
${targetInstructions[target]}

### Task Summary:
**Completed Tasks (${completedTasks.length}):**
${completedTasks
  .map(
    (task) =>
      `- ${task.title}${task.description ? `: ${task.description}` : ""}`
  )
  .join("\n")}

**Pending Tasks (${pendingTasks.length}):**
${pendingTasks
  .map(
    (task) =>
      `- ${task.title}${task.description ? `: ${task.description}` : ""}`
  )
  .join("\n")}

**Carried Over Tasks (${carriedOverTasks.length}):**
${carriedOverTasks
  .map(
    (task) =>
      `- ${task.title}${task.description ? `: ${task.description}` : ""}`
  )
  .join("\n")}

${
  includeNotes
    ? `
### Notes & Documentation (${notes.length}):
${notes
  .map(
    (note) =>
      `- ${note.title || "Untitled Note"}${
        note.content ? `: ${getContentPreview(note.content)}` : ""
      }`
  )
  .join("\n")}
`
    : ""
}

Generate a ${target.replace("-", " ")} in ${tone} tone using ${
    config.format
  } format.
Be specific about accomplishments and provide actionable next steps where appropriate.
Structure the content with appropriate headings and organize by theme/project when relevant.
  `.trim();
};

// Helper function to extract text content from note content
function getContentPreview(content: unknown): string {
  try {
    if (typeof content === "string") {
      return content.slice(0, 200) + (content.length > 200 ? "..." : "");
    }

    // Handle Yoopta content structure
    if (content && typeof content === "object") {
      let textContent = "";

      Object.values(content).forEach((block: unknown) => {
        if (block && typeof block === "object" && block !== null) {
          const blockObj = block as Record<string, unknown>;

          if (blockObj.value && Array.isArray(blockObj.value)) {
            blockObj.value.forEach((element: unknown) => {
              if (element && typeof element === "object" && element !== null) {
                const elementObj = element as Record<string, unknown>;

                if (elementObj.children && Array.isArray(elementObj.children)) {
                  elementObj.children.forEach((child: unknown) => {
                    if (child && typeof child === "object" && child !== null) {
                      const childObj = child as Record<string, unknown>;
                      if (typeof childObj.text === "string") {
                        textContent += childObj.text + " ";
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });

      const trimmed = textContent.trim();
      if (trimmed.length > 0) {
        return trimmed.slice(0, 200) + (trimmed.length > 200 ? "..." : "");
      }
    }

    return "Content available";
  } catch (error) {
    return "Content preview unavailable";
  }
}

// Mock AI generation - replace with actual AI service when available
export async function generateRecap(
  params: GenerateRecapParams
): Promise<string> {
  const { config, tasks, notes } = params;

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For now, we'll generate a structured template-based recap
  // This will be replaced with actual AI generation later

  const prompt = generatePrompt(params);

  // Generate template-based content
  return generateTemplateContent(params);
}

function generateTemplateContent(params: GenerateRecapParams): string {
  const { tasks, notes, config } = params;
  const { dateRange, tone, target, includeNotes, taskStatusFilter } = config;

  const startDate = format(parseISO(dateRange.start), "MMMM d, yyyy");
  const endDate = format(parseISO(dateRange.end), "MMMM d, yyyy");
  const dateRangeText =
    dateRange.start === dateRange.end ? startDate : `${startDate} - ${endDate}`;

  // Filter and group tasks
  const filteredTasks = tasks.filter((task) => {
    if (taskStatusFilter.includes("all")) return true;
    const taskStatus = getTaskStatusForDate(task, dateRange.end);
    return taskStatus && taskStatusFilter.includes(taskStatus);
  });

  const completedTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "completed";
  });

  const pendingTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "pending";
  });

  const carriedOverTasks = filteredTasks.filter((task) => {
    const status = getTaskStatusForDate(task, dateRange.end);
    return status === "carried-over";
  });

  // Generate content based on format
  if (config.format === "markdown") {
    return generateMarkdownContent({
      dateRangeText,
      completedTasks,
      pendingTasks,
      carriedOverTasks,
      notes: includeNotes ? notes : [],
      tone,
      target,
    });
  } else if (config.format === "html") {
    return generateHtmlContent({
      dateRangeText,
      completedTasks,
      pendingTasks,
      carriedOverTasks,
      notes: includeNotes ? notes : [],
      tone,
      target,
    });
  } else {
    return generatePlainTextContent({
      dateRangeText,
      completedTasks,
      pendingTasks,
      carriedOverTasks,
      notes: includeNotes ? notes : [],
      tone,
      target,
    });
  }
}

interface ContentParams {
  dateRangeText: string;
  completedTasks: Task[];
  pendingTasks: Task[];
  carriedOverTasks: Task[];
  notes: Note[];
  tone: string;
  target: string;
}

function generateMarkdownContent(params: ContentParams): string {
  const {
    dateRangeText,
    completedTasks,
    pendingTasks,
    carriedOverTasks,
    notes,
    tone,
    target,
  } = params;

  const getTonePrefix = () => {
    switch (tone) {
      case "formal":
        return "## Executive Summary";
      case "friendly":
        return "# 👋 Progress Update";
      case "minimal":
        return "# Summary";
      case "resume-style":
        return "## Professional Accomplishments";
      case "reflective":
        return "# 🤔 Reflection & Insights";
      default:
        return "# Recap";
    }
  };

  const getIntro = () => {
    switch (target) {
      case "daily-standup":
        return `Here's my progress update for ${dateRangeText}:`;
      case "weekly-report":
        return `Week ending ${dateRangeText} - here's what I accomplished and what's coming up:`;
      case "monthly-report":
        return `Monthly summary for ${dateRangeText} with key achievements and strategic insights:`;
      case "career-highlight":
        return `Professional highlights from ${dateRangeText}:`;
      case "reflection":
        return `Reflections and learnings from ${dateRangeText}:`;
      default:
        return `Summary for ${dateRangeText}:`;
    }
  };

  let content = `${getTonePrefix()}\n\n${getIntro()}\n\n`;

  if (completedTasks.length > 0) {
    content += `### ✅ Completed (${completedTasks.length})\n\n`;
    completedTasks.forEach((task) => {
      content += `- **${task.title}**`;
      if (task.description && task.description.length > 0) {
        content += `: ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      if (task.tags.length > 0) {
        content += ` _${task.tags.slice(0, 2).join(", ")}_`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (pendingTasks.length > 0) {
    content += `### 🔄 In Progress (${pendingTasks.length})\n\n`;
    pendingTasks.forEach((task) => {
      content += `- **${task.title}**`;
      if (task.description && task.description.length > 0) {
        content += `: ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (carriedOverTasks.length > 0) {
    content += `### ⏭️ Carried Over (${carriedOverTasks.length})\n\n`;
    carriedOverTasks.forEach((task) => {
      content += `- **${task.title}**`;
      if (task.description && task.description.length > 0) {
        content += `: ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (notes.length > 0) {
    content += `### 📝 Notes & Documentation (${notes.length})\n\n`;
    notes.forEach((note) => {
      content += `- **${note.title || "Untitled Note"}**`;
      const preview = getContentPreview(note.content);
      if (preview && preview !== "Content available") {
        content += `: ${preview}`;
      }
      content += "\n";
    });
    content += "\n";
  }

  // Add insights based on tone
  if (
    tone === "reflective" &&
    (completedTasks.length > 0 || notes.length > 0)
  ) {
    content += `### 💡 Key Insights\n\n`;
    content += `- Completed ${completedTasks.length} tasks during this period\n`;
    if (carriedOverTasks.length > 0) {
      content += `- ${carriedOverTasks.length} tasks require continued focus\n`;
    }
    if (notes.length > 0) {
      content += `- Documented ${notes.length} important insights and learnings\n`;
    }
  }

  return content.trim();
}

function generateHtmlContent(params: ContentParams): string {
  const {
    dateRangeText,
    completedTasks,
    pendingTasks,
    carriedOverTasks,
    notes,
  } = params;

  const content = `
    <div class="recap-summary">
      <h1>Recap for ${dateRangeText}</h1>
      
      ${
        completedTasks.length > 0
          ? `
        <h2>✅ Completed Tasks (${completedTasks.length})</h2>
        <ul>
          ${completedTasks
            .map(
              (task) => `
            <li>
              <strong>${task.title}</strong>
              ${
                task.description
                  ? `<br><em>${task.description.slice(0, 100)}${
                      task.description.length > 100 ? "..." : ""
                    }</em>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
      
      ${
        pendingTasks.length > 0
          ? `
        <h2>🔄 Pending Tasks (${pendingTasks.length})</h2>
        <ul>
          ${pendingTasks
            .map(
              (task) => `
            <li>
              <strong>${task.title}</strong>
              ${
                task.description
                  ? `<br><em>${task.description.slice(0, 100)}${
                      task.description.length > 100 ? "..." : ""
                    }</em>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
      
      ${
        carriedOverTasks.length > 0
          ? `
        <h2>⏭️ Carried Over (${carriedOverTasks.length})</h2>
        <ul>
          ${carriedOverTasks
            .map(
              (task) => `
            <li>
              <strong>${task.title}</strong>
              ${
                task.description
                  ? `<br><em>${task.description.slice(0, 100)}${
                      task.description.length > 100 ? "..." : ""
                    }</em>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
      
      ${
        notes.length > 0
          ? `
        <h2>📝 Notes (${notes.length})</h2>
        <ul>
          ${notes
            .map(
              (note) => `
            <li>
              <strong>${note.title || "Untitled Note"}</strong>
              ${
                note.content
                  ? `<br><em>${getContentPreview(note.content)}</em>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
    </div>
  `;

  return content.trim();
}

function generatePlainTextContent(params: ContentParams): string {
  const {
    dateRangeText,
    completedTasks,
    pendingTasks,
    carriedOverTasks,
    notes,
  } = params;

  let content = `RECAP FOR ${dateRangeText.toUpperCase()}\n\n`;

  if (completedTasks.length > 0) {
    content += `COMPLETED TASKS (${completedTasks.length}):\n`;
    completedTasks.forEach((task, index) => {
      content += `${index + 1}. ${task.title}`;
      if (task.description) {
        content += ` - ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (pendingTasks.length > 0) {
    content += `PENDING TASKS (${pendingTasks.length}):\n`;
    pendingTasks.forEach((task, index) => {
      content += `${index + 1}. ${task.title}`;
      if (task.description) {
        content += ` - ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (carriedOverTasks.length > 0) {
    content += `CARRIED OVER (${carriedOverTasks.length}):\n`;
    carriedOverTasks.forEach((task, index) => {
      content += `${index + 1}. ${task.title}`;
      if (task.description) {
        content += ` - ${task.description.slice(0, 100)}${
          task.description.length > 100 ? "..." : ""
        }`;
      }
      content += "\n";
    });
    content += "\n";
  }

  if (notes.length > 0) {
    content += `NOTES (${notes.length}):\n`;
    notes.forEach((note, index) => {
      content += `${index + 1}. ${note.title || "Untitled Note"}`;
      const preview = getContentPreview(note.content);
      if (preview && preview !== "Content available") {
        content += ` - ${preview}`;
      }
      content += "\n";
    });
  }

  return content.trim();
}
