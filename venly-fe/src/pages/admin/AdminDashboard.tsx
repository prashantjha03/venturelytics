import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";

import { adminApi } from "@/api/adminApi";
import { getAdminProfile } from "@/api/adminProfileApi";

/* ================================
   Types
================================ */
interface DashboardAnalytics {
  totalStartups: number;
  totalUsers: number;
  pendingStartups: number;
  approvedStartups: number;
  rejectedStartups: number;
}

interface AdminProfile {
  name: string;
  avatar: string;
}

/* ================================
   Component
================================ */
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("token");

        if (!token) return;

        const [dashboardRes, profileRes] = await Promise.all([
          adminApi.getDashboardAnalytics(),
          getAdminProfile(token),
        ]);

        setAnalytics(dashboardRes?.data ?? null);
        setProfile({
          name: profileRes?.name ?? "Admin",
          avatar: profileRes?.avatar ?? "",
        });
      } catch (error) {
        console.error("Admin dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Failed to load dashboard
      </div>
    );
  }

  const stats = [
    {
      title: "Total Startups",
      value: analytics.totalStartups,
      icon: Building2,
      change: "All time",
      changeType: "neutral" as const,
    },
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      change: "All time",
      changeType: "neutral" as const,
    },
    {
      title: "Pending Review",
      value: analytics.pendingStartups,
      icon: Clock,
      change: "Needs attention",
      changeType: "neutral" as const,
    },
    {
      title: "Approved",
      value: analytics.approvedStartups,
      icon: CheckCircle,
      change: "All time",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header (same style as StartupDashboard) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full border">
            <img
              src={profile?.avatar || "/avatar-placeholder.png"}
              alt="Admin Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold lg:text-3xl">
              Welcome
              <GradientText>{profile?.name}</GradientText>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of platform activity
            </p>
          </div>
        </div>

        <Button variant="gradient" asChild>
          <Link to="/admin/startups">
            <Building2 className="mr-2 h-4 w-4" />
            Review Startups
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>

          <div className="mt-4 space-y-3">
            <QuickAction
              to="/admin/startups"
              icon={<Building2 className="h-5 w-5 text-accent" />}
              title="Review Startups"
              desc="Approve or reject submissions"
            />
            <QuickAction
              to="/admin/users"
              icon={<Users className="h-5 w-5 text-accent" />}
              title="Manage Users"
              desc="View and control users"
            />
            <QuickAction
              to="/admin/settings"
              icon={<TrendingUp className="h-5 w-5 text-accent" />}
              title="Analytics"
              desc="Platform insights"
            />
          </div>
        </GlassCard>

        {/* Status */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Startup Status</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/startups">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <StatusRow
              icon={<Clock className="h-5 w-5 text-warning" />}
              label="Pending"
              value={analytics.pendingStartups}
              bg="bg-warning/10"
            />
            <StatusRow
              icon={<CheckCircle className="h-5 w-5 text-success" />}
              label="Approved"
              value={analytics.approvedStartups}
              bg="bg-success/10"
            />
            <StatusRow
              icon={<XCircle className="h-5 w-5 text-destructive" />}
              label="Rejected"
              value={analytics.rejectedStartups}
              bg="bg-destructive/10"
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

/* ================================
   Small Components
================================ */
const StatusRow = ({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <span className="text-2xl font-bold">{value}</span>
  </div>
);

const QuickAction = ({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <Button variant="outline" className="h-auto w-full justify-start py-4" asChild>
    <Link to={to} className="flex gap-3">
      {icon}
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  </Button>
);

export default AdminDashboard;
