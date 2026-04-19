import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403) {
      const message = err.response?.data?.message || "";
      if (
        message.toLowerCase().includes("banned") ||
        message.toLowerCase().includes("suspended")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        const reason = message.toLowerCase().includes("banned")
          ? "banned"
          : "suspended";
        window.location.href = `/login?reason=${reason}`;
      }
    }
    return Promise.reject(err);
  }
);

export default api;