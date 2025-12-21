import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { adminApi } from "@/api/adminApi";

const LIMIT = 10;
const ROLES = ["admin", "startup"];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteUser, setDeleteUser] = useState<any>(null);

  /* ==============================
     Debounced Search
  ============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ==============================
     Fetch Users
  ============================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers({
        search: searchQuery || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        page,
        limit: LIMIT,
      });

      setUsers(data?.users || []);
      setTotalPages(data?.pagination?.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, page]);

  /* ==============================
     Change User Role (Optimistic)
  ============================== */
  const changeUserRole = async (user: any, newRole: string) => {
    const prevRole = user.role;

    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, role: newRole } : u
      )
    );

    try {
      await adminApi.updateUserRole(user._id, newRole);
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, role: prevRole } : u
        )
      );
    }
  };

  /* ==============================
     VERIFY / UNVERIFY USER ✅
  ============================== */
  const toggleUserVerification = async (user: any) => {
    const newValue = !user.isVerified;

    // optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isVerified: newValue } : u
      )
    );

    try {
      await adminApi.updateUserVerification(user._id, newValue);
    } catch {
      // rollback
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isVerified: user.isVerified } : u
        )
      );
    }
  };

  /* ==============================
     Delete User
  ============================== */
  const confirmDelete = async () => {
    await adminApi.deleteUser(deleteUser._id);
    setUsers((prev) =>
      prev.filter((u) => u._id !== deleteUser._id)
    );
    setDeleteUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">
          Manage <GradientText>Users</GradientText>
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and manage platform users
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border bg-card/50 px-3 py-2 text-sm"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {!loading && users.length > 0 && (
        <>
          <GlassCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Verified</th>
                  <th className="px-6 py-4 text-left">Joined</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          changeUserRole(user, e.target.value)
                        }
                        className="rounded-md border bg-card px-2 py-1 text-sm"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* VERIFIED STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          user.isVerified
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserVerification(user)}
                      >
                        {user.isVerified ? "Deactivate" : "Activate"}
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteUser(user)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GlassCard className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold">Delete User</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{deleteUser.name}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
