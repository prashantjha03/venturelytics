import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  TrendingUp,
  IndianRupee,
  Plus,
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { startupApi } from "@/api/startupApi";
import { getProfile } from "@/api/profileApi";

/* ================================
   Types
================================ */
interface StatItem {
  title: string;
  value: string | number;
  icon: any;
  change: string;
  changeType: "neutral" | "positive" | "negative";
}

interface Activity {
  id: string;
  message: string;
}

interface Profile {
  name: string;
  avatar: string;
}

/* ================================
   Helpers
================================ */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ================================
   Component
================================ */
const StartupDashboard = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [statsRes, activityRes, profileRes] = await Promise.all([
          startupApi.getDashboardStats(),
          startupApi.getRecentActivity(),
          getProfile(token),
        ]);

        const formattedStats: StatItem[] = [
          {
            title: "Total Startups",
            value: statsRes?.totalStartups ?? 0,
            icon: Building2,
            change: "Updated recently",
            changeType: "neutral",
          },
          {
            title: "Team Members",
            value: statsRes?.teamMembers ?? 0,
            icon: Users,
            change: "Updated recently",
            changeType: "neutral",
          },
          {
            title: "Growth Rate",
            value: `${statsRes?.growthRate ?? 0}%`,
            icon: TrendingUp,
            change: "Last 30 days",
            changeType: "neutral",
          },
          {
            title: "Total Funding",
            value: formatCurrency(statsRes?.totalFunding ?? 0),
            icon: IndianRupee,
            change: "Overall funding",
            changeType: "neutral",
          },
        ];

        setStats(formattedStats);
        setActivities(activityRes ?? []);
        setProfile({
          name: profileRes?.name ?? "User",
          avatar: profileRes?.avatar ?? "",
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {profile?.avatar && (
            <img
              src={profile.avatar}
              alt="Profile"
              className="h-12 w-12 rounded-full border object-cover"
            />
          )}

          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              Welcome{" "}
              <GradientText>{profile?.name}</GradientText>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's an overview of your startup ecosystem
            </p>
          </div>
        </div>

        <Button variant="gradient" asChild>
          <Link to="/startup/startups">
            <Plus className="mr-2 h-4 w-4" />
            Add Startup
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <GlassCard key={i} className="p-6 animate-pulse">
                <div className="mb-3 h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-20 rounded bg-muted" />
              </GlassCard>
            ))
          : stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ActionButton
              to="/startup/startups"
              icon={Building2}
              title="Manage Startups"
              desc="Add or edit startup profiles"
            />
            <ActionButton
              to="/startup/profile"
              icon={Users}
              title="Update Profile"
              desc="Edit your personal info"
            />
            <ActionButton
              to="/startup/startups"
              icon={FileText}
              title="Upload Documents"
              desc="Add pitch decks & reports"
            />
            <ActionButton
              to="/startup/settings"
              icon={TrendingUp}
              title="View Analytics"
              desc="Track growth metrics"
            />
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))
            ) : activities.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No recent activity yet
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-md border p-3 text-sm"
                >
                  {activity.message}
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

/* ================================
   Small Reusable Component
================================ */
const ActionButton = ({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: any;
  title: string;
  desc: string;
}) => (
  <Button variant="outline" className="h-auto justify-start py-4" asChild>
    <Link to={to}>
      <Icon className="mr-3 h-5 w-5 text-primary" />
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  </Button>
);

export default StartupDashboard;
