import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

/* -------------------- GET PROFILE -------------------- */
export const getProfile = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* -------------------- SAVE PROFILE -------------------- */
export const saveProfile = async (
  data: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
  },
  token: string
) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

/* -------------------- UPLOAD AVATAR -------------------- */
export const uploadAvatar = async (
  formData: FormData,
  token: string
) => {
  const res = await axios.post(
    `${API_URL}/avatar`,
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
