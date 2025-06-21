import { useState, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Camera,
  TrendingUp,
  Activity,
  Target,
  Clock,
  CheckCircle,
  RotateCcw,
  Edit,
  Save,
} from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { useNoteStore } from "@/stores/note-store";
import { useProfileStore } from "@/stores/profile-store";
import { getTaskStatusForDate } from "@/types/task";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  subWeeks,
  subMonths,
  isToday,
  isSameDay,
} from "date-fns";
import { toast } from "sonner";

interface ProductivityData {
  date: string;
  taskCount: number;
  completedCount: number;
}

const Profile = () => {
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { profile, updateProfile, updateProfileImage } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [timeRange, setTimeRange] = useState<"week" | "month">("month");

  // Update edit profile when profile changes
  useState(() => {
    setEditProfile(profile);
  });

  // Calculate productivity metrics
  const productivityMetrics = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Get tasks for different time periods - but for carried-over tasks,
    // we need to consider all tasks that are currently active today
    const getTasksInPeriod = (startDate: Date) => {
      const start = startDate.toISOString().split("T")[0];
      const end = todayStr;

      // For productivity metrics, we want to include:
      // 1. Tasks created within the time period
      // 2. Tasks that are currently carried-over today (regardless of creation date)
      return tasks.filter((task) => {
        const taskDate = task.createdAt.split("T")[0];
        const currentStatus = getTaskStatusForDate(task, todayStr);

        // Include if created within period OR if currently carried-over today
        return (
          (taskDate >= start && taskDate <= end) ||
          currentStatus === "carried-over"
        );
      });
    };

    const dailyTasks = getTasksInPeriod(subDays(today, 1));
    const weeklyTasks = getTasksInPeriod(subWeeks(today, 1));
    const monthlyTasks = getTasksInPeriod(subMonths(today, 1));

    const calculateStats = (taskList: typeof tasks) => {
      const completed = taskList.filter((t) => t.completedAt).length;
      const pending = taskList.filter(
        (t) => !t.completedAt && getTaskStatusForDate(t, todayStr) === "pending"
      ).length;
      const carriedOver = taskList.filter(
        (t) =>
          !t.completedAt && getTaskStatusForDate(t, todayStr) === "carried-over"
      ).length;

      return {
        total: taskList.length,
        completed,
        pending,
        carriedOver,
        completionRate:
          taskList.length > 0 ? (completed / taskList.length) * 100 : 0,
      };
    };

    return {
      daily: calculateStats(dailyTasks),
      weekly: calculateStats(weeklyTasks),
      monthly: calculateStats(monthlyTasks),
      overall: calculateStats(tasks),
    };
  }, [tasks]);

  // Generate heatmap data for the selected time range
  const heatmapData = useMemo(() => {
    // Create clean date objects without time components to avoid timezone issues
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split("T")[0];

    const days = timeRange === "week" ? 7 : 30;

    // Create start date using clean date calculation
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    // End date is today (clean date without time)
    const endDate = new Date(today);

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    // Debug to verify dates
    console.log("Heatmap debug:", {
      todayStr,
      startDateStr: startDate.toISOString().split("T")[0],
      endDateStr: endDate.toISOString().split("T")[0],
      rangeLength: dateRange.length,
      lastRangeDate: dateRange[dateRange.length - 1]
        ?.toISOString()
        .split("T")[0],
    });

    const result = dateRange.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayTasks = tasks.filter((task) => {
        const taskCreated = task.createdAt.split("T")[0];
        const taskCompleted = task.completedAt?.split("T")[0];
        return taskCreated === dateStr || taskCompleted === dateStr;
      });

      const completedTasks = dayTasks.filter(
        (task) => task.completedAt?.split("T")[0] === dateStr
      );

      return {
        date: dateStr,
        taskCount: dayTasks.length,
        completedCount: completedTasks.length,
        intensity: Math.min(completedTasks.length, 4), // 0-4 scale for heatmap
      };
    });

    // Debug the actual heatmap data array
    console.log("Heatmap data array:", {
      firstDate: result[0]?.date,
      lastDate: result[result.length - 1]?.date,
      totalDays: result.length,
      allDates: result.map((d) => d.date),
    });

    return result;
  }, [tasks, timeRange]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateProfileImage(imageUrl);
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile(editProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const getIntensityColor = (intensity: number) => {
    const colors = [
      "bg-gray-100 dark:bg-muted/30", // 0 - no activity (light grey for contrast)
      "bg-green-200 dark:bg-green-900/40", // 1 - low activity
      "bg-green-300 dark:bg-green-800/60", // 2 - medium activity
      "bg-green-400 dark:bg-green-700/80", // 3 - high activity
      "bg-green-500 dark:bg-green-600", // 4 - very high activity
    ];
    return colors[intensity] || colors[0];
  };

  // Helper function to check if a date string (YYYY-MM-DD) is today
  const isTodayDate = (dateStr: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split("T")[0];

    // Debug logging for today comparison
    if (dateStr === "2025-06-03" || dateStr === "2025-06-04") {
      console.log("isTodayDate debug:", {
        dateStr,
        todayStr,
        isMatch: dateStr === todayStr,
        nowDetails: {
          year: now.getFullYear(),
          month: now.getMonth(),
          date: now.getDate(),
        },
      });
    }

    return dateStr === todayStr;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and view your productivity insights
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile.profileImage} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-3 w-3" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="pt-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editProfile.firstName}
                        onChange={(e) =>
                          setEditProfile((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="First Name"
                      />
                      <Input
                        value={editProfile.lastName}
                        onChange={(e) =>
                          setEditProfile((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Last Name"
                      />
                    </div>
                    <Input
                      value={editProfile.email}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={editProfile.bio}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={editProfile.company}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={editProfile.role}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editProfile.location}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {profile.role} at {profile.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Joined{" "}
                        {format(new Date(profile.joinedDate), "MMMM yyyy")}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {productivityMetrics.overall.completed}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {productivityMetrics.overall.pending}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {productivityMetrics.overall.carriedOver}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Carried Over
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {notes.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Notes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Productivity & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productivity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Productivity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      icon={<Target className="h-4 w-4" />}
                      label="Total Tasks"
                      value={productivityMetrics.daily.total}
                      color="blue"
                    />
                    <MetricCard
                      icon={<CheckCircle className="h-4 w-4" />}
                      label="Completed"
                      value={productivityMetrics.daily.completed}
                      color="green"
                    />
                    <MetricCard
                      icon={<Clock className="h-4 w-4" />}
                      label="Pending"
                      value={productivityMetrics.daily.pending}
                      color="orange"
                    />
                    <MetricCard
                      icon={<RotateCcw className="h-4 w-4" />}
                      label="Completion Rate"
                      value={`${productivityMetrics.daily.completionRate.toFixed(
                        1
                      )}%`}
                      color="purple"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="weekly" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      icon={<Target className="h-4 w-4" />}
                      label="Total Tasks"
                      value={productivityMetrics.weekly.total}
                      color="blue"
                    />
                    <MetricCard
                      icon={<CheckCircle className="h-4 w-4" />}
                      label="Completed"
                      value={productivityMetrics.weekly.completed}
                      color="green"
                    />
                    <MetricCard
                      icon={<Clock className="h-4 w-4" />}
                      label="Carried Over"
                      value={productivityMetrics.weekly.carriedOver}
                      color="red"
                    />
                    <MetricCard
                      icon={<RotateCcw className="h-4 w-4" />}
                      label="Completion Rate"
                      value={`${productivityMetrics.weekly.completionRate.toFixed(
                        1
                      )}%`}
                      color="purple"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      icon={<Target className="h-4 w-4" />}
                      label="Total Tasks"
                      value={productivityMetrics.monthly.total}
                      color="blue"
                    />
                    <MetricCard
                      icon={<CheckCircle className="h-4 w-4" />}
                      label="Completed"
                      value={productivityMetrics.monthly.completed}
                      color="green"
                    />
                    <MetricCard
                      icon={<Clock className="h-4 w-4" />}
                      label="Carried Over"
                      value={productivityMetrics.monthly.carriedOver}
                      color="red"
                    />
                    <MetricCard
                      icon={<RotateCcw className="h-4 w-4" />}
                      label="Completion Rate"
                      value={`${productivityMetrics.monthly.completionRate.toFixed(
                        1
                      )}%`}
                      color="purple"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Productivity Heatmap */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Heatmap
              </CardTitle>
              <Select
                value={timeRange}
                onValueChange={(value: "week" | "month") => setTimeRange(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {heatmapData.length > 0 ? (
                      <>
                        {format(
                          new Date(heatmapData[0].date + "T12:00:00"),
                          "MMM d"
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(
                            heatmapData[heatmapData.length - 1].date +
                              "T12:00:00"
                          ),
                          "MMM d"
                        )}
                      </>
                    ) : (
                      "No data"
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Less</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-sm ${getIntensityColor(
                            level
                          )}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">More</span>
                  </div>
                </div>

                <div
                  className={`grid gap-1 ${
                    timeRange === "week" ? "grid-cols-7" : "grid-cols-10"
                  }`}
                >
                  {heatmapData.map((day, index) => (
                    <div
                      key={day.date}
                      className={`
                        aspect-square rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-purple-500
                        ${getIntensityColor(day.intensity)}
                        ${isTodayDate(day.date) ? "ring-2 ring-purple-500" : ""}
                      `}
                      title={`${format(new Date(day.date), "MMM d, yyyy")}: ${
                        day.completedCount
                      } tasks completed`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-xl font-medium text-gray-600 dark:text-gray-300">
                        {format(new Date(day.date), "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {timeRange === "week" && (
                  <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div key={day}>{day}</div>
                      )
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper component for metric cards
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "blue" | "green" | "orange" | "purple" | "red";
}

const MetricCard = ({ icon, label, value, color }: MetricCardProps) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    green: "text-green-600 bg-green-50 dark:bg-green-950/30",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-950/30",
    red: "text-red-600 bg-red-50 dark:bg-red-950/30",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`${colorClasses[color].split(" ")[0]}`}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div
        className={`text-2xl font-bold ${colorClasses[color].split(" ")[0]}`}
      >
        {value}
      </div>
    </div>
  );
};

export default Profile;
