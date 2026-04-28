// src/config/index.ts

// نقوم بجلب الرابط من ملف الـ .env
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// يمكنك أيضاً إضافة روابط فرعية إذا أردت
export const API_ENDPOINTS = {
  PROJECTS: `${API_BASE_URL}/api/projects`,
  AUTH: `${API_BASE_URL}/api/auth`,
};