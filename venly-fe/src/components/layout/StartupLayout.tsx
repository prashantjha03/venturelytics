import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { GradientText } from "@/components/ui/GradientText";
import {
  LayoutDashboard,
  Building2,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getProfile } from "@/api/profileApi";

/* ================================
   Types
================================ */
interface Profile {
  name: string;
  avatar: string;
}

const sidebarLinks = [
  { name: "Dashboard", href: "/startup/dashboard", icon: LayoutDashboard },
  { name: "My Startups", href: "/startup/startups", icon: Building2 },
  { name: "Profile", href: "/startup/profile", icon: User },
  { name: "Settings", href: "/startup/settings", icon: Settings },
];

export const StartupLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  /* ================================
     Fetch Profile
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile(token)
      .then((res) => setProfile(res))
      .catch(console.error);
  }, []);

  /* ================================
     Close dropdown on outside click
  ================================ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================================
     Logout
  ================================ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* ================= Sidebar ================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/50 bg-card/50 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <GradientText className="text-lg font-bold">
              Venturelytics
            </GradientText>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <div className="flex flex-1 flex-col">
        {/* ================= Top Bar ================= */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border/50 bg-card p-4 shadow-xl">
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="mt-4 text-sm text-muted-foreground">
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            {/* ================= User Dropdown ================= */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={profile?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border"
                />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border/50 bg-card shadow-xl">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-semibold">
                      {profile?.name}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= Page Content ================= */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
