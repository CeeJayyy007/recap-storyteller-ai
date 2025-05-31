import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Edit3,
  Calendar,
  Archive,
  LogOut,
  User,
  Zap,
  HelpCircle,
  Bolt,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "../common/logo";
import { Separator } from "@/components/ui/separator";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
    key: "dashboard",
  },
  {
    href: "/tasks",
    icon: Edit3,
    label: "Tasks",
    key: "tasks",
  },
  {
    href: "/calendar",
    icon: Calendar,
    label: "Calendar",
    key: "calendar",
  },
  {
    href: "/vault",
    icon: Archive,
    label: "Vault",
    key: "vault",
  },
];

const navigationFooterItems: NavigationItem[] = [
  {
    href: "/help",
    icon: HelpCircle,
    label: "Help",
    key: "help",
  },
  {
    href: "/settings",
    icon: Bolt,
    label: "Settings",
    key: "settings",
  },
];

interface SidebarProps {
  userAvatar?: string;
  userName?: string;
  onTaskbarToggle?: (isVisible: boolean) => void;
}

export function Sidebar({
  userAvatar,
  userName = "User",
  onTaskbarToggle,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isTaskbarVisible, setIsTaskbarVisible] = useState(() => {
    const saved = localStorage.getItem("taskbar-visible");
    return saved ? JSON.parse(saved) : false;
  });

  // Toggle between avatar and logo every 5 seconds with coin flip animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      // Switch content mid-flip (when rotated 90 degrees)
      setTimeout(() => {
        setShowLogo((prev) => !prev);
      }, 150); // Half of the 300ms flip duration
      // Reset flip state after animation completes
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Persist taskbar visibility and notify parent
  useEffect(() => {
    localStorage.setItem("taskbar-visible", JSON.stringify(isTaskbarVisible));
    onTaskbarToggle?.(isTaskbarVisible);
  }, [isTaskbarVisible, onTaskbarToggle]);

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    return path.slice(1); // Remove leading slash
  };

  const handleProfileMenuAction = (action: string) => {
    switch (action) {
      case "home":
        navigate("/dashboard");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        // Handle logout logic here
        navigate("/");
        break;
    }
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const toggleTaskbar = () => {
    setIsTaskbarVisible((prev) => !prev);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-white dark:bg-slate-900 border-r border-border flex-col items-center py-4 z-50">
        {/* Profile/Logo Section */}
        <div className="mb-8" style={{ perspective: "1000px" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-14 h-14 overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                {/* Avatar */}
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-300 ease-in-out",
                    isFlipping && "animate-coin-flip"
                  )}
                  style={{
                    transform: showLogo ? "rotateY(180deg)" : "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Logo */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
                    isFlipping && "animate-coin-flip"
                  )}
                  style={{
                    transform: showLogo ? "rotateY(0deg)" : "rotateY(-180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Logo />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem onClick={() => handleProfileMenuAction("home")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuAction("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuAction("logout")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Taskbar Toggle Button */}
        <div className="mb-6">
          <Separator className="w-full mb-2" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTaskbar}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-accent group",
                  isTaskbarVisible
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isTaskbarVisible ? "Hide Taskbar" : "Show Taskbar"}</p>
            </TooltipContent>
          </Tooltip>
          <Separator className="w-full mt-2" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-4 flex-1">
          {navigationItems.map((item) => {
            const isActive = getActiveKey() === item.key;
            const Icon = item.icon;

            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-accent group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer Navigation Items */}
        <div className="flex flex-col gap-4 mt-4">
          {navigationFooterItems.map((item) => {
            const isActive = getActiveKey() === item.key;
            const Icon = item.icon;

            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-accent group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-border px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const isActive = getActiveKey() === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Settings item for mobile */}
          {(() => {
            const settingsItem = navigationFooterItems.find(
              (item) => item.key === "settings"
            );
            if (!settingsItem) return null;

            const isActive = getActiveKey() === settingsItem.key;
            const Icon = settingsItem.icon;

            return (
              <button
                key={settingsItem.key}
                onClick={() => handleNavigation(settingsItem.href)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">
                  {settingsItem.label}
                </span>
              </button>
            );
          })()}
        </div>
      </nav>

      {/* Desktop Content Padding */}
      <div className="hidden md:block w-16" />

      {/* Mobile Content Padding */}
      <div className="md:hidden h-20" />
    </>
  );
}
