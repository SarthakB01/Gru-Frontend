// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // File upload
  UPLOAD: `${API_BASE_URL}/api/upload`,
  
  // AI endpoints
  SUMMARIZE_DOCUMENT: `${API_BASE_URL}/api/ai/summarize-document`,
  SUMMARIZE: `${API_BASE_URL}/api/ai/summarize`,
  GENERATE_QUIZ: `${API_BASE_URL}/api/ai/generate-quiz`,
  VERIFY_ANSWERS: `${API_BASE_URL}/api/ai/verify-answers`,
  CHAT: `${API_BASE_URL}/api/ai/chat`,
  TEXT_TO_SPEECH: `${API_BASE_URL}/api/ai/text-to-speech`,
  
  // Message endpoint
  MESSAGE: `${API_BASE_URL}/api/message`,
  
  // Legacy upload endpoint
  LEGACY_UPLOAD: `${API_BASE_URL}/upload`,
} as const; 