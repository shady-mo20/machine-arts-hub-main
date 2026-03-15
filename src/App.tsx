import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AdminLayout from "@/admin/AdminLayout";
import DashboardHome from "@/admin/DashboardHome";
import UsersPage from "@/admin/UsersPage";
import MachinesPageAdmin from "@/admin/MachinesPage";
import GalleryPageAdmin from "@/admin/GalleryPage";
import InquiriesPage from "@/admin/InquiriesPage";
import SettingsPage from "@/admin/SettingsPage";
import AdminLoginPage from "@/admin/AdminLoginPage";
import HomePage from "./pages/HomePage";
import MachinesPage from "./pages/MachinesPage";
import MachineDetailPage from "./pages/MachineDetailPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <AuthProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/machines" element={<MachinesPage />} />
              <Route path="/machines/:id" element={<MachineDetailPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin", "developer"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="machines" element={<MachinesPageAdmin />} />
                <Route path="gallery" element={<GalleryPageAdmin />} />
                <Route path="inquiries" element={<InquiriesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
