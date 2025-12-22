import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Building2,
  Search,
  Trash2,
  X,
  Edit,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { startupApi, StartupData, TeamMember } from "@/api/startupApi";

/* ================= Types ================= */

type StartupStatus = "approved" | "rejected" | "pending";

/* ================= Initial State ================= */

const emptyStartup: StartupData = {
  name: "",
  description: "",
  industry: "",
  website: "",
  fundingStatus: "",
  teamMembers: [],
};

const emptyMember: TeamMember = {
  name: "",
  role: "",
  email: "",
};

/* ================= Helpers ================= */

const getInitials = (name?: string) =>
  name
    ?.trim()
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") ?? "";

const getStatusClasses = (status?: StartupStatus) => {
  if (status === "approved") return "bg-green-500/15 text-green-500";
  if (status === "rejected") return "bg-red-500/15 text-red-500";
  return "bg-yellow-500/15 text-yellow-500";
};

/* ================= Component ================= */

const StartupsPage = () => {
  const { toast } = useToast();

  /* UI State */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Data */
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(
    null
  );

  /* Search */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* Expand Teams */
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    {}
  );

  /* Forms */
  const [createForm, setCreateForm] = useState<StartupData>(emptyStartup);
  const [editForm, setEditForm] = useState<StartupData>(emptyStartup);

  const [createMember, setCreateMember] =
    useState<TeamMember>(emptyMember);
  const [editMember, setEditMember] = useState<TeamMember>(emptyMember);

  /* ================= Fetch ================= */

  const fetchMyStartups = useCallback(async () => {
    try {
      const data = await startupApi.getMyStartups();
      setStartups(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load startups",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchMyStartups();
  }, [fetchMyStartups]);

  /* ================= Debounce ================= */

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= Create ================= */

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await startupApi.createStartup(createForm);
      setStartups((prev) => [created, ...prev]);
      toast({ title: "Startup created successfully" });
      setIsCreateOpen(false);
      setCreateForm(emptyStartup);
      setCreateMember(emptyMember);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create startup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= Edit ================= */

  const openEdit = (startup: StartupData) => {
    setSelectedStartup(startup);
    setEditForm(startup);
    setEditMember(emptyMember);
    setIsEditOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStartup?._id) return;

    setLoading(true);
    try {
      const updated = await startupApi.updateStartup(
        selectedStartup._id,
        editForm
      );
      setStartups((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
      toast({ title: "Startup updated" });
      setIsEditOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update startup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= Delete ================= */

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Delete this startup?")) return;

    try {
      await startupApi.deleteStartup(id);
      setStartups((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Startup deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete startup",
        variant: "destructive",
      });
    }
  };

  /* ================= Filter ================= */

  const filteredStartups = startups.filter((s) =>
    `${s.name} ${s.industry} ${s.fundingStatus ?? ""}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  /* ================= Render ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">
            My <GradientText>Startups</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Manage your startup profiles and teams
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" /> Add Startup
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Startup</DialogTitle>
              <DialogDescription>Create a new startup</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                placeholder="Startup name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                required
              />

              <Input
                placeholder="Industry"
                value={createForm.industry}
                onChange={(e) =>
                  setCreateForm({ ...createForm, industry: e.target.value })
                }
                required
              />

              <Textarea
                placeholder="Description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
              />

              <Button disabled={loading} type="submit" variant="gradient">
                {loading ? "Creating..." : "Create Startup"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search startups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {filteredStartups.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4">No startups found</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStartups.map(
            (s) =>
              s._id && (
                <GlassCard key={s._id} className="relative space-y-4 p-4">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.industry}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${getStatusClasses(
                        s.status as StartupStatus
                      )}`}
                    >
                      {s.status ?? "pending"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedStartup(s);
                        setIsDetailsOpen(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEdit(s)}
                    >
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Button>
                  </div>
                </GlassCard>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default StartupsPage;
