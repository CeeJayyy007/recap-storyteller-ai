import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTaskStore } from "./task-store";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  company: string;
  role: string;
  location: string;
  joinedDate: string;
  profileImage: string;
}

interface ProfileState {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateProfileImage: (imageUrl: string) => void;
  initializeProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: {
        firstName: "New",
        lastName: "User",
        email: "user@example.com",
        bio: "Welcome to your productivity journey! Update your profile to personalize your experience.",
        company: "Your Company",
        role: "Your Role",
        location: "Your Location",
        joinedDate: new Date().toISOString(),
        profileImage: "/placeholder-avatar.jpg",
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      updateProfileImage: (imageUrl) => {
        set((state) => ({
          profile: { ...state.profile, profileImage: imageUrl },
        }));
      },

      initializeProfile: () => {
        const taskStore = useTaskStore.getState();
        const tasks = taskStore.tasks;

        // Find the earliest task creation date
        const firstTaskDate =
          tasks.length > 0
            ? tasks.reduce((earliest, task) => {
                const taskDate = new Date(task.createdAt);
                return taskDate < earliest ? taskDate : earliest;
              }, new Date(tasks[0].createdAt))
            : new Date();

        set((state) => ({
          profile: {
            ...state.profile,
            joinedDate: firstTaskDate.toISOString(),
          },
        }));
      },
    }),
    {
      name: "profile-storage",
    }
  )
);
