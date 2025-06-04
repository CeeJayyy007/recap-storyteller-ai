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
  HelpCircle,
  Bolt,
  Menu,
  Sun,
  Moon,
  ListRestart,
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
import { Logo } from "../common/Logo";
import { Separator } from "@/components/ui/separator";
import { useThemeStore } from "@/stores/theme-store";

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
    href: "/notes",
    icon: Edit3,
    label: "Notes",
    key: "notes",
  },
  {
    href: "/calendar",
    icon: Calendar,
    label: "Calendar",
    key: "calendar",
  },
  {
    href: "/recap",
    icon: ListRestart,
    label: "Recap",
    key: "recap",
  },
  // {
  //   href: "/vault",
  //   icon: Archive,
  //   label: "Vault",
  //   key: "vault",
  // },
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

  const { theme, toggleTheme } = useThemeStore();

  // Toggle between avatar and logo every 5 seconds with coin flip animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
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

    // Check for exact dashboard match first
    if (path === "/dashboard") return "dashboard";

    // Check if path starts with any navigation item href
    for (const item of navigationItems) {
      if (path.startsWith(item.href)) {
        return item.key;
      }
    }

    // Check footer navigation items
    for (const item of navigationFooterItems) {
      if (path.startsWith(item.href)) {
        return item.key;
      }
    }

    // Fallback to the original behavior
    return path.slice(1);
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
        {/* Profile section with coin flip animation */}
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-14 h-14 rounded-lg  transition-all duration-200 group">
                <div
                  className="w-full h-full relative"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: showLogo ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.6s ease-in-out",
                  }}
                >
                  {/* Avatar side */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* Logo side */}
                  <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Logo className="w-14 h-14" />
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48">
              <DropdownMenuItem onClick={() => handleProfileMenuAction("home")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuAction("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuAction("logout")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
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
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-accent group text-muted-foreground hover:text-foreground"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                {theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"}
              </p>
            </TooltipContent>
          </Tooltip>

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
