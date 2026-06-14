import api from "./api";

/**
 * Send chat messages to the Studnsta AI tutor.
 * @param {Array<{role: string, content: string}>} messages
 */
export const sendMessage = (messages) => api.post("/api/ai/chat", { messages });

/**
 * Get the list of available Groq models from the backend.
 */
export const getAvailableModels = () => api.get("/api/ai/models");
