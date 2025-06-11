import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { OnboardingContainer } from "@/components/onboarding/OnboardingContainer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import Recap from "./pages/Recap";
import Vault from "./pages/Vault";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OnboardingContainer />
      <BrowserRouter>
        <Routes>
          {/* Landing page without sidebar */}
          <Route path="/" element={<Index />} />

          {/* App pages with sidebar */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/notes"
            element={
              <AppLayout>
                <Notes />
              </AppLayout>
            }
          />
          <Route
            path="/calendar"
            element={
              <AppLayout>
                <Calendar />
              </AppLayout>
            }
          />
          <Route
            path="/recap"
            element={
              <AppLayout>
                <Recap />
              </AppLayout>
            }
          />
          <Route
            path="/vault"
            element={
              <AppLayout>
                <Vault />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <Profile />
              </AppLayout>
            }
          />
          <Route
            path="/help"
            element={
              <AppLayout>
                <Help />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <AppLayout>
                <NoteEditor />
              </AppLayout>
            }
          />
          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
