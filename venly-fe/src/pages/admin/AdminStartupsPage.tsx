import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/api/adminApi";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RejectModal from "./RejectModal";
import {
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

/* =========================
   Types
========================= */
type StartupStatus = "pending" | "approved" | "rejected";

interface Startup {
  _id: string;
  name: string;
  industry: string;
  status: StartupStatus;
  isActive: boolean;
}

/* =========================
   Component
========================= */
const AdminStartupsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StartupStatus | "all">("all");
  const [page, setPage] = useState(1);

  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rejectId, setRejectId] = useState<string | null>(null);

  /* =========================
     Fetch Startups
  ========================= */
  const fetchStartups = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getAllStartups({
        search: search || undefined,
        status: status !== "all" ? status : undefined,
        page,
        limit: 5,
      });

      setStartups(res.startups || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch {
      setError("Failed to load startups");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  /* =========================
     Actions
  ========================= */
  const approveStartup = async (id: string) => {
    try {
      await adminApi.approveStartup(id);
      await fetchStartups();
    } catch {
      alert("Failed to approve startup");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Manage <GradientText>Startups</GradientText>
      </h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search startups..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as StartupStatus | "all");
          }}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <GlassCard className="py-6 text-center text-destructive">
          {error}
        </GlassCard>
      )}

      {/* Table */}
      {!loading && startups.length > 0 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4">Startup</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {startups.map((startup) => (
                <tr
                  key={startup._id}
                  className="border-b border-border/50"
                >
                  <td className="p-4 font-medium">
                    {startup.name}
                  </td>
                  <td>{startup.industry}</td>
                  <td className="capitalize">{startup.status}</td>

                  <td className="space-x-2">
                    {/* ONLY PENDING → APPROVE / REJECT */}
                    {startup.status === "pending" && (
                      <>
                        <Button
                          size="icon"
                          onClick={() =>
                            approveStartup(startup._id)
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() =>
                            setRejectId(startup._id)
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* APPROVED / REJECTED → NO ACTIONS */}
                    {startup.status !== "pending" && (
                      <span className="text-muted-foreground text-xs">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Empty */}
      {!loading && startups.length === 0 && (
        <GlassCard className="py-10 text-center text-muted-foreground">
          No startups found
        </GlassCard>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <RejectModal
          startupId={rejectId}
          onClose={() => setRejectId(null)}
          onSuccess={fetchStartups}
        />
      )}
    </div>
  );
};

export default AdminStartupsPage;
