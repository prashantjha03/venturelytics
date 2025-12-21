import axios from "axios";

/**
 * Backend base URL
 * Example: http://localhost:5000/api
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------------- types ---------------- */

export interface AdminProfilePayload {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

/* ---------------- helpers ---------------- */

const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* ---------------- API calls ---------------- */

/**
 * GET admin profile
 * GET /api/admin/profile
 */
export const getAdminProfile = async (token: string) => {
  const res = await axios.get(
    `${API_URL}/admin/profile`,
    authHeader(token)
  );
  return res.data;
};

/**
 * UPDATE admin profile
 * PUT /api/admin/profile
 */
export const saveAdminProfile = async (
  data: AdminProfilePayload,
  token: string
) => {
  const res = await axios.put(
    `${API_URL}/admin/profile`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * UPLOAD admin avatar
 * POST /api/admin/profile/avatar
 */
export const uploadAdminAvatar = async (
  formData: FormData,
  token: string
) => {
  const res = await axios.post(
    `${API_URL}/admin/profile/avatar`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
