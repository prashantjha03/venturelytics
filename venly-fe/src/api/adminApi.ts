import axios from "axios";

/* ================================
   Axios Instance
================================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================================
   Types & Interfaces
================================ */
export interface StartupListFilters {
  status?: "pending" | "approved" | "rejected";
  industry?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: "startup" | "admin";
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
}

/* ================================
   Admin API
================================ */
export const adminApi = {
  /* -------- Startup Management -------- */

  getAllStartups: async (filters?: StartupListFilters) => {
    const { data } = await api.get("/admin/startups", {
      params: filters,
    });
    return data;
  },

  getStartupDetails: async (id: string) => {
    const { data } = await api.get(`/admin/startups/${id}`);
    return data;
  },

  approveStartup: async (id: string) => {
    const { data } = await api.patch(`/admin/startups/${id}/approve`);
    return data;
  },

  rejectStartup: async (id: string, reason?: string) => {
    const { data } = await api.patch(`/admin/startups/${id}/reject`, {
      reason,
    });
    return data;
  },

  /* -------- User Management -------- */

  getAllUsers: async (filters?: UserFilters) => {
    const { data } = await api.get("/admin/users", {
      params: filters,
    });
    return data;
  },

  getUserDetails: async (id: string) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  // ✅ FIXED: Update User Role (MISSING BEFORE)
  updateUserRole: async (
    id: string,
    role: "admin" | "startup"
  ) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, {
      role,
    });
    return data;
  },

  updateUserStatus: async (
    id: string,
    status: "active" | "inactive"
  ) => {
    const { data } = await api.patch(`/admin/users/${id}/status`, {
      status,
    });
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  /* -------- Dashboard Analytics -------- */

  getDashboardAnalytics: async () => {
    const { data } = await api.get("/admin/dashboard/analytics");
    return data;
  },

  getStartupsByIndustry: async () => {
    const { data } = await api.get(
      "/admin/dashboard/startups-by-industry"
    );
    return data;
  },

  getStartupsByStatus: async () => {
    const { data } = await api.get(
      "/admin/dashboard/startups-by-status"
    );
    return data;
  },

  getRecentActivity: async () => {
    const { data } = await api.get(
      "/admin/dashboard/recent-activity"
    );
    return data;
  },

  /* -------- Reports -------- */

  exportStartupsReport: async (filters?: StartupListFilters) => {
    const response = await api.get(
      "/admin/reports/startups",
      {
        params: filters,
        responseType: "blob",
      }
    );
    return response.data;
  },

  exportUsersReport: async (filters?: UserFilters) => {
    const response = await api.get(
      "/admin/reports/users",
      {
        params: filters,
        responseType: "blob",
      }
    );
    return response.data;
  },
  updateUserVerification: async (
  id: string,
  isVerified: boolean
) => {
  const { data } = await api.patch(
    `/admin/users/${id}/verify`,
    { isVerified }
  );
  return data;
},

};
