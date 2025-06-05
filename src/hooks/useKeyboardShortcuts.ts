import { useEffect } from "react";

interface KeyboardShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const isMatch =
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.metaKey === !!shortcut.metaKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey;

        if (isMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// Utility hook specifically for taskbar toggle
export function useTaskbarToggle(toggleFunction: () => void) {
  useKeyboardShortcuts([
    {
      key: "b",
      ctrlKey: true,
      action: toggleFunction,
      description: "Toggle taskbar (Ctrl+B)",
    },
    {
      key: "b",
      metaKey: true,
      action: toggleFunction,
      description: "Toggle taskbar (Cmd+B)",
    },
  ]);
}
