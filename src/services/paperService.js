import api from "./api";
export const uploadPaper = (formData) => api.post("/api/papers", formData);
export const getPapers = (params) => api.get("/api/papers", { params });
export const getPaper = (id) => api.get(`/api/papers/${id}`);
export const deletePaper = (id) => api.delete(`/api/papers/${id}`);
export const getFilterOptions = () => api.get("/api/papers/filters");
