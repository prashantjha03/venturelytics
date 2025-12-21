import axios, { AxiosInstance } from "axios";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const contactApi = {
  sendMessage: async (payload: ContactPayload): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>("/contact", payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to send message");
    }
  },
};
