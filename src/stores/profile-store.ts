import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        bio: "Passionate productivity enthusiast who loves organizing tasks and achieving goals efficiently. Always looking for ways to optimize workflows and help teams succeed.",
        company: "Productivity Co.",
        role: "Senior Product Manager",
        location: "San Francisco, CA",
        joinedDate: "2023-01-15",
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
    }),
    {
      name: "profile-storage",
    }
  )
);
