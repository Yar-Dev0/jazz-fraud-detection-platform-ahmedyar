import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api",
});

// You can add interceptors here in the future for auth, logging, etc.

export default axiosInstance;
