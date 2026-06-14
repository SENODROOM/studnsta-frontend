import api from "./api";
export const getUserProfile = (userId) => userId ? api.get(`/api/profile?userId=${userId}`) : api.get("/api/profile");
export const getAllUsers = () => api.get("/api/profile/users");
export const getUserPostsBySubject = (userId, subject) => api.get(`/api/profile/${userId}/posts?subject=${subject}`);
export const updateProfile = (data) => api.put("/api/profile", data);
export const uploadAvatar = (formData) => api.post("/api/profile/avatar", formData);
export const deleteUserPost = (postId) => api.delete(`/api/profile/posts/${postId}`);
