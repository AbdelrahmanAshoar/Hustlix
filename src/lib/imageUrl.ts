import { API_BASE_URL } from "@/config";

/**
 * Normalizes image URLs to ensure they include the full API base URL when needed
 * @param url - The image URL to normalize
 * @returns The normalized image URL
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "/default.png";
  if (url.startsWith("data:image")) return url;
  if (url.startsWith("blob:")) return url;
  if (url.startsWith("http")) return url;
  // Add API_BASE_URL prefix for relative URLs
  return `${API_BASE_URL}${url}`;
}
