// Use environment variables directly
export const ENDPOINTS = {
  LOGIN: import.meta.env.VITE_N8N_JWT_WEBHOOK,
  CHAT: import.meta.env.VITE_N8N_CHAT_WEBHOOK,
  FEEDBACK: import.meta.env.VITE_N8N_FEEDBACK_WEBHOOK,
  SURVEY: import.meta.env.VITE_N8N_SURVEY_WEBHOOK,
};