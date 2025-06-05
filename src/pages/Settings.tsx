import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  User,
  Lock,
  Bell,
  Palette,
  Database,
  Keyboard,
  Download,
  Trash2,
  Save,
  RefreshCw,
  Play,
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Task } from "@/types/task";
import { toast } from "sonner";

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { resetOnboarding, startAppTransition } = useOnboardingStore();

  // Profile settings state
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Productivity enthusiast who loves getting things done efficiently.",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    autoSave: true,
    taskCarryOver: true,
    showCompletedTasks: true,
    dateFormat: "MMM dd, yyyy",
    defaultTaskView: "list",
    enableAnimations: true,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    dailyRecap: false,
    weeklyReport: true,
    emailNotifications: true,
  });

  const handleProfileSave = () => {
    toast.success("Profile updated successfully!");
  };

  const handlePreferencesSave = () => {
    toast.success("Preferences saved!");
  };

  const handleExportData = (format: string) => {
    toast.info(`Exporting data as ${format.toUpperCase()}...`);
  };

  const handleClearData = (dataType: string) => {
    toast.warning(`Are you sure you want to clear all ${dataType}?`);
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    toast.success("Onboarding reset! Refresh the page to see it again.");
  };

  const handleShowOnboarding = () => {
    startAppTransition();
    toast.info("Starting onboarding flow...");
  };

  const getDataStats = () => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(
      (t: Task) => t.completedAt !== undefined && t.completedAt !== null
    ).length,
    totalNotes: notes.length,
    storageUsed: "2.3 MB", // Mock value
  });

  const stats = getDataStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Account Status
                  </div>
                  <div className="font-medium text-green-600">Active</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Member Since
                  </div>
                  <div className="font-medium">January 2024</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Plan Type</div>
                  <div className="font-medium">Free Tier</div>
                </div>
              </div>

              <Separator />

              {/* Session Management */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your active login sessions across devices
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-muted-foreground">
                        Windows • Chrome • Current device
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active: Now
                      </div>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">Mobile Session</div>
                      <div className="text-sm text-muted-foreground">
                        iOS • Safari • iPhone
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active: 2 hours ago
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full sm:w-auto">
                  Sign Out All Other Sessions
                </Button>
              </div>

              <Separator />

              {/* Account Actions */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Account Actions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Additional account management options
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Account Data
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                {/* <Button variant="outline" className="w-full sm:w-auto">
                  <Lock className="h-4 w-4 mr-2" />
                  Two-Factor Authentication
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save task changes
                  </p>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, autoSave: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task carry-over</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically carry over incomplete tasks
                  </p>
                </div>
                <Switch
                  checked={preferences.taskCarryOver}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, taskCarryOver: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show completed tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Display completed tasks in task list
                  </p>
                </div>
                <Switch
                  checked={preferences.showCompletedTasks}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      showCompletedTasks: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, dateFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMM dd, yyyy">Jan 15, 2024</SelectItem>
                    <SelectItem value="dd/MM/yyyy">15/01/2024</SelectItem>
                    <SelectItem value="MM/dd/yyyy">01/15/2024</SelectItem>
                    <SelectItem value="yyyy-MM-dd">2024-01-15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Task View</Label>
                <Select
                  value={preferences.defaultTaskView}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, defaultTaskView: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="compact">Compact View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handlePreferencesSave}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="flex items-center gap-2"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth transitions and animations
                  </p>
                </div>
                <Switch
                  checked={preferences.enableAnimations}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      enableAnimations: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming task deadlines
                  </p>
                </div>
                <Switch
                  checked={notifications.taskReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      taskReminders: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Recap</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily summary of completed tasks
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyRecap}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, dailyRecap: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly productivity insights
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      weeklyReport: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Tasks
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.completedTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalNotes}
                  </div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.storageUsed}
                  </div>
                  <div className="text-sm text-muted-foreground">Storage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export & Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExportData("json")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("csv")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium mb-2">Clear Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete data from your account. This action cannot
                  be undone.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData("tasks")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Tasks
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData("notes")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Notes
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData("all data")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <h4 className="font-medium mb-2">Onboarding Controls</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Test and manage the onboarding experience.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShowOnboarding}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Show Onboarding
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetOnboarding}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Onboarding
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shortcuts Tab */}
        <TabsContent value="shortcuts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Toggle taskbar</span>
                  <Badge variant="outline" className="font-mono">
                    Ctrl + B
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Quick search</span>
                  <Badge variant="outline" className="font-mono">
                    Ctrl + K <span className="text-xs ml-1">(coming soon)</span>
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">New task</span>
                  <Badge variant="outline" className="font-mono">
                    Ctrl + N <span className="text-xs ml-1">(coming soon)</span>
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">New note</span>
                  <Badge variant="outline" className="font-mono">
                    Ctrl + Shift + N{" "}
                    <span className="text-xs ml-1">(coming soon)</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
