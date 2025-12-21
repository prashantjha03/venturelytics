import axios from "axios";

/* ================================
   Axios Instance
================================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

/* ================================
   Request Interceptor
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   Types
================================ */
export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  email: string;
  linkedin?: string;
  avatar?: File | string;
}

export interface StartupData {
  id?: string;
  name: string;
  description: string;
  industry: string;
  website?: string;
  fundingStatus?: string;
  fundingAmount?: number;
  teamMembers: TeamMember[];
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

/* ================================
   Helper: Build FormData
================================ */
const buildStartupFormData = (data: StartupData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("industry", data.industry);
  formData.append("description", data.description);

  if (data.website) formData.append("website", data.website);
  if (data.fundingStatus) formData.append("fundingStatus", data.fundingStatus);
  if (data.fundingAmount !== undefined) {
    formData.append("fundingAmount", String(data.fundingAmount));
  }

  formData.append("teamMembers", JSON.stringify(data.teamMembers));

  return formData;
};

/* ================================
   API Methods
================================ */
export const startupApi = {
  /* CREATE */
  createStartup: async (data: StartupData) => {
    const formData = buildStartupFormData(data);
    const res = await api.post("/startups", formData);
    return res.data;
  },

  /* READ */
  getMyStartups: async () => {
    const res = await api.get("/startups/my");
    return res.data;
  },

  /* UPDATE ✅ FIXED */
  updateStartup: async (startupId: string, data: StartupData) => {
    if (!startupId) {
      throw new Error("Startup ID is required");
    }

    const formData = buildStartupFormData(data);

    const res = await api.put(`/startups/${startupId}`, formData);
    return res.data;
  },

  /* DELETE */
  deleteStartup: async (startupId: string) => {
    if (!startupId) {
      throw new Error("Startup ID is required");
    }

    const res = await api.delete(`/startups/${startupId}`);
    return res.data;
  },

  /* DASHBOARD */
  getDashboardStats: async () => {
    const res = await api.get("/dashboard/stats");
    return res.data;
  },

  getRecentActivity: async () => {
    const res = await api.get("/dashboard/activity");
    return res.data;
  },
};
