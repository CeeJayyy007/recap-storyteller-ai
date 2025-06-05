import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenOnboarding: boolean;
  showSplashScreen: boolean;
  showOnboardingFlow: boolean;
  isAppLoading: boolean;

  // Actions
  setSplashScreen: (show: boolean) => void;
  setOnboardingFlow: (show: boolean) => void;
  setAppLoading: (loading: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  startAppTransition: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasSeenOnboarding: false,
      showSplashScreen: false,
      showOnboardingFlow: false,
      isAppLoading: true,

      setSplashScreen: (show) => set({ showSplashScreen: show }),

      setOnboardingFlow: (show) => set({ showOnboardingFlow: show }),

      setAppLoading: (loading) => set({ isAppLoading: loading }),

      completeOnboarding: () =>
        set({
          hasSeenOnboarding: true,
          showOnboardingFlow: false,
        }),

      resetOnboarding: () =>
        set({
          hasSeenOnboarding: false,
          showSplashScreen: false,
          showOnboardingFlow: false,
        }),

      startAppTransition: () => {
        const { hasSeenOnboarding } = get();

        // Show splash screen first
        set({ showSplashScreen: true, isAppLoading: true });

        // After splash screen, show onboarding if not seen before
        setTimeout(() => {
          set({
            showSplashScreen: false,
            showOnboardingFlow: !hasSeenOnboarding,
            isAppLoading: false,
          });
        }, 3000);
      },
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
