import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linkedin-clone-backend.vercel.app",
  withCredentials: true,
});
