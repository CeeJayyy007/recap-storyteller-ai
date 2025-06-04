import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import Recap from "./pages/Recap";
import Vault from "./pages/Vault";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { NoteEditor } from "@/components/notes/NoteEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            path="/notes/:id"
            element={
              <AppLayout>
                <NoteEditor />
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
