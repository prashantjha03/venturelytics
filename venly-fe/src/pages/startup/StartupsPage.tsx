import { useEffect, useState } from "react";
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
import { startupApi, StartupData, TeamMember } from "@/api/StartupApi";

/* ================= Initial State ================= */
const initialFormData: StartupData = {
  name: "",
  description: "",
  industry: "",
  website: "",
  fundingStatus: "",
  teamMembers: [],
};

const StartupsPage = () => {
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startups, setStartups] = useState<StartupData[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);

  /* Search */
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /* Expand teams */
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  /* Form states */
  const [createFormData, setCreateFormData] = useState<StartupData>(initialFormData);
  const [editFormData, setEditFormData] = useState<StartupData>(initialFormData);

  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
    email: "",
  });

  /* ================= Helpers ================= */
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const getStatusClasses = (status?: string) => {
  if (status === "approved")
    return "bg-green-500/15 text-green-500";

  if (status === "rejected")
    return "bg-red-500/15 text-red-500";

  return "bg-yellow-500/15 text-yellow-500"; // pending
};


  /* ================= Fetch Startups ================= */
  const fetchMyStartups = async () => {
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
  };

  useEffect(() => {
    fetchMyStartups();
  }, []);

  /* ================= Debounce Search ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ================= Create Handlers ================= */
  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMemberToCreate = () => {
    if (!newMember.name || !newMember.role || !newMember.email) return;
    setCreateFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { ...newMember }],
    }));
    setNewMember({ name: "", role: "", email: "" });
  };

  const handleRemoveMemberFromCreate = (index: number) => {
    setCreateFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await startupApi.createStartup(createFormData);
      setStartups((prev) => [created, ...prev]);
      toast({
        title: "Startup Created",
        description: "Startup saved successfully",
      });
      setIsCreateDialogOpen(false);
      setCreateFormData(initialFormData);
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

  /* ================= Edit Handlers ================= */
  const handleOpenEdit = (startup: StartupData) => {
    setEditFormData({ ...startup });
    setSelectedStartup(startup);
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMemberToEdit = () => {
    if (!newMember.name || !newMember.role || !newMember.email) return;
    setEditFormData((prev) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), { ...newMember }],
    }));
    setNewMember({ name: "", role: "", email: "" });
  };

  const handleRemoveMemberFromEdit = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStartup?._id) return;
    setLoading(true);
    try {
      const updated = await startupApi.updateStartup(selectedStartup._id, editFormData);
      setStartups((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
      toast({
        title: "Startup Updated",
        description: "Changes saved successfully",
      });
      setIsEditDialogOpen(false);
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
  const handleDeleteStartup = async (startupId?: string) => {
    if (!startupId) return;
    if (!window.confirm("Are you sure you want to delete this startup?")) return;

    try {
      await startupApi.deleteStartup(startupId);
      setStartups((prev) => prev.filter((s) => s._id !== startupId));
      toast({
        title: "Startup Deleted",
        description: "Startup removed successfully",
      });
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
    `${s.name} ${s.industry} ${s.fundingStatus || ""}`
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">
            My <GradientText>Startups</GradientText>
          </h1>
          <p className="mt-1 text-muted-foreground">Manage your startup profiles and team</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Add Startup
            </Button>
          </DialogTrigger>

          {/* Create Dialog */}
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Startup</DialogTitle>
              <DialogDescription>Fill in the details to create your startup</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Startup Name</Label>
                  <Input
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input
                    name="industry"
                    value={createFormData.industry}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={createFormData.description}
                  onChange={handleCreateInputChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    name="website"
                    value={createFormData.website}
                    onChange={handleCreateInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Funding Status</Label>
                  <select
                    name="fundingStatus"
                    value={createFormData.fundingStatus}
                    onChange={handleCreateInputChange}
                    className="flex h-11 w-full rounded-lg border border-border bg-card/50 px-4 text-sm"
                  >
                    <option value="">Select status</option>
                    <option value="pre-seed">Pre-Seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="bootstrapped">Bootstrapped</option>
                  </select>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <Label>Team Members</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <Input
                    placeholder="Role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                    <Button type="button" variant="outline" onClick={handleAddMemberToCreate}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {createFormData.teamMembers.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                  >
                    <span className="text-sm">
                      {m.name} • {m.role} • {m.email}
                    </span>
                    <button type="button" onClick={() => handleRemoveMemberFromCreate(i)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={loading}>
                  {loading ? "Creating..." : "Create Startup"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search startups..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Startup List */}
      {filteredStartups.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Building2 className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No startups found</h3>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStartups.map((s) => {
            const isExpanded = expandedTeams[s._id || ""] ?? false;

            return (
              <GlassCard key={s._id} className="relative p-4 space-y-4">
                <button
                  onClick={() => handleDeleteStartup(s._id)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.industry}</p>

                  <div className="relative mt-2 inline-block group">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
      s.status
    )}`}
  >
    {s.status || "pending"}
  </span>

  {s.status === "rejected" && s.rejectionReason && (
    <div
      className="
        absolute left-0 top-full z-50 mt-2
        w-max max-w-xs
        rounded-lg bg-background px-3 py-2
        text-xs text-muted-foreground
        shadow-xl
        opacity-0
        transition-opacity
        group-hover:opacity-100
      "
    >
      {s.rejectionReason}
    </div>
  )}
</div>

                </div>

                {s.teamMembers?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Team</span>
                      <button
                        className="text-xs text-primary"
                        onClick={() =>
                          setExpandedTeams((prev) => ({
                            ...prev,
                            [s._id || ""]: !isExpanded,
                          }))
                        }
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {isExpanded &&
                      s.teamMembers.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.role}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStartup(s);
                      setIsDetailsOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenEdit(s)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedStartup?.name}</DialogTitle>
            <DialogDescription>{selectedStartup?.industry}</DialogDescription>
          </DialogHeader>

          {selectedStartup && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedStartup.description}</p>

              {selectedStartup.teamMembers?.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.role} • {m.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Startup</DialogTitle>
            <DialogDescription>Update your startup information and team</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Startup Name</Label>
                <Input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  name="industry"
                  value={editFormData.industry}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  name="website"
                  value={editFormData.website}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Funding Status</Label>
                <select
                  name="fundingStatus"
                  value={editFormData.fundingStatus}
                  onChange={handleEditInputChange}
                  className="flex h-11 w-full rounded-lg border border-border bg-card/50 px-4 text-sm"
                >
                  <option value="">Select status</option>
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="bootstrapped">Bootstrapped</option>
                </select>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <Label>Team Members</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={handleAddMemberToEdit}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editFormData.teamMembers?.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                >
                  <span className="text-sm">
                    {m.name} • {m.role} • {m.email}
                  </span>
                  <button type="button" onClick={() => handleRemoveMemberFromEdit(i)}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartupsPage;