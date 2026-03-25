import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7443/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → redirect to login (skip for auth endpoints)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthRequest = url.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
