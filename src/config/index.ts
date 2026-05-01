const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function normalizeApiBaseUrl(url: string): string {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(rawApiBaseUrl);

export const API_ENDPOINTS = {
  PROJECTS: `${API_BASE_URL}/api/projects`,
  AUTH: `${API_BASE_URL}/api/auth`,
};
