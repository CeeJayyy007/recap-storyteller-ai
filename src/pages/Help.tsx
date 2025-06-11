import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Rocket,
  Shield,
  User,
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Keyboard,
  Save,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn how to use the app, explore key features, and get the most out of your productivity tools.",
    icon: <Rocket className="h-6 w-6" />,
    color: "text-blue-600",
  },
  {
    id: "security",
    title: "Security & Privacy",
    description:
      "Keep your account safe with our advanced security measures and privacy controls.",
    icon: <Shield className="h-6 w-6" />,
    color: "text-green-600",
  },
  {
    id: "account",
    title: "Account & Profile",
    description:
      "Manage your account settings, subscription plans, and personal preferences.",
    icon: <User className="h-6 w-6" />,
    color: "text-purple-600",
  },
];

const SUPPORT_TYPES = [
  { value: "bug", label: "Bug Report", icon: <Bug className="h-4 w-4" /> },
  {
    value: "feature",
    label: "Feature Request",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    value: "feedback",
    label: "General Feedback",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    value: "help",
    label: "Need Help",
    icon: <HelpCircle className="h-4 w-4" />,
  },
];

const FAQ_DATA: FAQItem[] = [
  {
    category: "getting-started",
    question: "How do I create and manage tasks?",
    answer:
      "You can create tasks by clicking the 'Add Task' button in the taskbar. Tasks can be organized by date, linked to notes, and have three states: pending (orange), completed (green), and carried-over (red for overdue tasks). Tasks automatically carry over if not completed by their due date.",
  },
  {
    category: "getting-started",
    question: "How does the note-taking system work?",
    answer:
      "Our rich text editor supports headings, paragraphs, lists, links, and formatting. Notes auto-save after 1 second of inactivity. You can link multiple tasks to a single note, and notes are organized by date. The title is automatically extracted from your content if not set manually.",
  },
  {
    category: "getting-started",
    question: "What is the Recap feature?",
    answer:
      "Recap generates professional work summaries from your tasks and notes for any date range. Choose from different tones (formal, friendly, minimal, resume-style, reflective) and targets (daily standup, weekly report, monthly report, career highlight, reflection). Export as PDF, CSV, or Markdown.",
  },
  {
    category: "getting-started",
    question: "How do I navigate between different sections?",
    answer:
      "Use the sidebar on desktop or bottom navigation on mobile. The sidebar includes Dashboard, Notes, Calendar, and Recap sections. You can toggle the taskbar on/off for more screen space. Your preferences are saved automatically.",
  },
  {
    category: "security",
    question: "Is my data stored securely?",
    answer:
      "All your data is stored locally in your browser using encrypted localStorage. We use TypeScript for type safety and follow modern security practices. No data is sent to external servers without your explicit consent.",
  },
  {
    category: "security",
    question: "Can I export my data?",
    answer:
      "Yes! You can export recaps as PDF, CSV, or Markdown files. We're working on comprehensive data export features for tasks and notes. Your data remains yours and can be exported at any time.",
  },
  {
    category: "account",
    question: "How do I customize the app's appearance?",
    answer:
      "Toggle between light and dark themes using the sun/moon icon in the sidebar. The app is fully responsive and adapts to your screen size. Your theme preference is saved automatically.",
  },
  {
    category: "account",
    question: "How does the taskbar work?",
    answer:
      "The taskbar is a 320px collapsible panel that shows your calendar, search, and grouped tasks. It can be toggled on/off and your preference is saved. On mobile, it's hidden for better screen space usage.",
  },
  {
    category: "getting-started",
    question: "How do task-note relationships work?",
    answer:
      "Each task can link to one note (one-to-one), while each note can be linked to multiple tasks (one-to-many). Use the 'Add Note' button in task cards or 'Link Tasks' in note headers to create these relationships.",
  },
  {
    category: "getting-started",
    question: "What happens to overdue tasks?",
    answer:
      "Tasks that remain pending past their due date automatically become 'carried-over' tasks with a red color theme. This creates visual urgency and helps you prioritize overdue work.",
  },
  {
    category: "getting-started",
    question: "What keyboard shortcuts are available?",
    answer:
      "Currently available shortcuts: Ctrl+B (or Cmd+B on Mac) toggles the taskbar visibility. More shortcuts like Ctrl+K for quick search are planned for future updates. Keyboard shortcuts work globally throughout the app.",
  },
];

const Help = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [supportType, setSupportType] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set());

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supportType || !subject || !message || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate form submission
    toast.success("Thank you for your feedback! We'll get back to you soon.");

    // Reset form
    setSupportType("");
    setSubject("");
    setMessage("");
    setEmail("");
    setSelectedCategory("");
  };

  const toggleFAQ = (index: number) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(index)) {
      newOpenFAQs.delete(index);
    } else {
      newOpenFAQs.add(index);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const filteredFAQs = selectedCategory
    ? FAQ_DATA.filter((faq) => faq.category === selectedCategory)
    : FAQ_DATA;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className=" mb-8">
          <h1 className="text-4xl font-bold mb-4">Need Assistance?</h1>
          <p className="text-muted-foreground mt-1">
            If you're feeling overwhelmed, remember you don't have to face it
            alone.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Input
            placeholder="Ask a question..."
            className="pl-4 pr-20 py-6 text-lg rounded-lg border-2"
          />
          <Button
            className="absolute right-1 top-1 rounded-md px-6"
            onClick={() => toast.info("Search functionality coming soon!")}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {HELP_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? "" : category.id
                )
              }
            >
              <CardHeader className="text-center">
                <div className={`${category.color} mb-3 flex justify-center`}>
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {category.description}
                </p>
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Get Support
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tell us how we can help you
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-type">Type of Request *</Label>
                  <Select value={supportType} onValueChange={setSupportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your request"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your request, issue, or feedback..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about the app
              </p>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Filter by Category
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === "" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("")}
                  >
                    All
                  </Badge>
                  {HELP_CATEGORIES.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.title}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="mb-6" />

              {/* FAQ Items */}
              <ScrollArea className="h-96 w-full rounded-md ">
                <div className="space-y-3 pr-4">
                  {filteredFAQs.map((faq, index) => (
                    <Collapsible key={index} open={openFAQs.has(index)}>
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full p-3 text-left bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="font-medium text-sm">
                          {faq.question}
                        </span>
                        {openFAQs.has(index) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No FAQs found for this category</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Tips & Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Keyboard className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Keyboard Shortcuts</h4>
                  <p className="text-sm text-muted-foreground">
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">
                      B
                    </kbd>{" "}
                    - Toggle taskbar
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">
                      K
                    </kbd>{" "}
                    - Quick search (coming soon)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Save className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Auto-save</h4>
                  <p className="text-sm text-muted-foreground">
                    Your notes save automatically every second - no need to
                    worry about losing work
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <List className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Task Organization</h4>
                  <p className="text-sm text-muted-foreground">
                    Color coding helps you quickly identify task status: red
                    (overdue), orange (pending), green (completed)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
