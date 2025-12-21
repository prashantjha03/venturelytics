/**
 * Authentication API Layer (Secure JWT Flow)
 * ------------------------------------------
 */

import axios, { AxiosInstance } from "axios";

/* ===================== TYPES ===================== */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "startup" | "admin";
  };
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: "startup" | "admin";
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface NewPasswordPayload {
  token: string;
  password: string;
}

/* ===================== STORAGE HELPERS ===================== */
const TOKEN_KEY = "token";
const USER_KEY = "user";

const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/* ===================== AXIOS INSTANCE ===================== */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== INTERCEPTOR ===================== */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== AUTH API ===================== */
export const authApi = {
  /* -------- LOGIN -------- */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    // 🧹 clear previous session completely
    clearAuthStorage();

    const res = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      payload
    );

    // ✅ save fresh session
    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

    return res.data;
  },

  /* -------- SIGNUP -------- */
  signup: async (payload: SignupPayload): Promise<void> => {
    await axiosInstance.post("/auth/signup", payload);
  },

  /* -------- VERIFY OTP -------- */
  verifyOtp: async (payload: OtpPayload): Promise<void> => {
    await axiosInstance.post("/auth/verify-otp", payload);
  },

  /* -------- RESEND OTP -------- */
  resendOtp: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/resend-otp", { email });
  },

  /* -------- FORGOT PASSWORD -------- */
  requestPasswordReset: async (
    payload: ResetPasswordPayload
  ): Promise<void> => {
    await axiosInstance.post("/auth/forgot-password", payload);
  },

  /* -------- RESET PASSWORD -------- */
  resetPassword: async (
    payload: NewPasswordPayload
  ): Promise<void> => {
    await axiosInstance.post("/auth/reset-password", payload);
  },

  /* -------- LOGOUT -------- */
  logout: async (): Promise<void> => {
    clearAuthStorage();

    // optional: backend audit/log only
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore
    }
  },

  /* -------- CURRENT USER -------- */
  getCurrentUser: async (): Promise<LoginResponse["user"]> => {
    const res = await axiosInstance.get<{ user: LoginResponse["user"] }>(
      "/auth/me"
    );

    // keep frontend in sync
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

    return res.data.user;
  },
};
