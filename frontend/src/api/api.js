import axios from "axios";

const BASE_URL = "http://localhost:5500";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ─── USER APIs ─────────────────────────────────────────────── */
export const userAPI = {
  signup: (data) => api.post("/signup", data),
  login: (data) => api.post("/login", data),
  getProfile: (id) => api.get(`/userProfile/${id}`),
  getAllUsers: () => api.get("/allUsers"),
  updateProfile: (id, data) => api.put(`/updateProfile/${id}`, data),
  deleteProfile: (id) => api.delete(`/deleteProfile/${id}`),
};

/* ─── REPOSITORY APIs ───────────────────────────────────────── */
export const repoAPI = {
  create: (data) => api.post("/repo/create", data),
  getAll: () => api.get("/repo/all"),
  getById: (id) => api.get(`/repo/${id}`),
  getByName: (name) => api.get(`/repo/name/${name}`),
  getByUser: (userId) => api.get(`/repo/user/${userId}`),
  update: (id, data) => api.put(`/repo/update/${id}`, data),
  delete: (id) => api.delete(`/repo/delete/${id}`),
  toggleVisibility: (id) => api.patch(`/repo/toggle/${id}`),
};

/* ─── ISSUE APIs ────────────────────────────────────────────── */
export const issueAPI = {
  create: (data) => api.post("/issue/create", data),
  getAll: () => api.get("/issue/all"),
  getById: (id) => api.get(`/issue/${id}`),
  update: (id, data) => api.put(`/issue/update/${id}`, data),
  delete: (id) => api.delete(`/issue/delete/${id}`),
};

export default api;
