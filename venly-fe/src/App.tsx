import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StartupLayout } from "@/components/layout/StartupLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import AboutPage from "@/pages/public/AboutPage";
import TeamPage from "@/pages/public/TeamPage";
import ContactPage from "@/pages/public/ContactPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OtpPage from "@/pages/auth/OtpPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import RoleSelectPage from "@/pages/auth/RoleSelectPage";

// Startup Dashboard Pages
import StartupDashboard from "@/pages/startup/StartupDashboard";
import StartupsPage from "@/pages/startup/StartupsPage";
import ProfilePage from "@/pages/startup/ProfilePage";
import SettingsPage from "@/pages/startup/SettingsPage";

// Admin Dashboard Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminStartupsPage from "@/pages/admin/AdminStartupsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminProfile from "@/pages/admin/AdminProfile";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="otp" element={<OtpPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="role-select" element={<RoleSelectPage />} />
          </Route>

          {/* Startup Dashboard Routes */}
          <Route path="/startup" element={<StartupLayout />}>
            <Route path="dashboard" element={<StartupDashboard />} />
            <Route path="startups" element={<StartupsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

 {/* Admin Dashboard Routes */}
<Route path="/admin/*" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="startups" element={<AdminStartupsPage />} />
  <Route path="users" element={<AdminUsersPage />} />
<Route path="profile" element={<AdminProfile />} />
  <Route path="settings" element={<AdminSettingsPage />} />
</Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
