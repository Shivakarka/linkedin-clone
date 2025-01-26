import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linkedin-clone-backend.vercel.app/api/v1",
  withCredentials: true,
});
