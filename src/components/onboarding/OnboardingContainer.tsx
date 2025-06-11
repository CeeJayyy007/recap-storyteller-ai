import { useEffect } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useProfileStore } from "@/stores/profile-store";
import { SplashScreen } from "./SplashScreen";
import { OnboardingFlow } from "./OnboardingFlow";

export function OnboardingContainer() {
  const {
    showSplashScreen,
    showOnboardingFlow,
    isAppLoading,
    setSplashScreen,
    setOnboardingFlow,
    completeOnboarding,
    startAppTransition,
  } = useOnboardingStore();

  const { initializeProfile } = useProfileStore();

  // Start the onboarding flow when the app first loads
  useEffect(() => {
    const hasInitialized = sessionStorage.getItem("app-initialized");

    if (!hasInitialized) {
      startAppTransition();
      initializeProfile();
      sessionStorage.setItem("app-initialized", "true");
    }
  }, [startAppTransition, initializeProfile]);

  const handleSplashComplete = () => {
    setSplashScreen(false);

    // Check if we should show onboarding
    const hasSeenOnboarding = useOnboardingStore.getState().hasSeenOnboarding;
    if (!hasSeenOnboarding) {
      setOnboardingFlow(true);
    }
  };

  const handleOnboardingComplete = () => {
    completeOnboarding();
  };

  const handleOnboardingSkip = () => {
    completeOnboarding();
  };

  return (
    <>
      <SplashScreen
        isVisible={showSplashScreen}
        onComplete={handleSplashComplete}
        duration={5000}
      />

      <OnboardingFlow
        isVisible={showOnboardingFlow}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </>
  );
}
