import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";

/**
 * Fetches all projects belonging to the currently authenticated client.
 * Must be called from a Server Component or Server Action (uses next/headers).
 */
export const getProjects = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_BASE_URL}/api/Client/my-projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    return { projects: [] };
  }

  try {
    return text ? JSON.parse(text) : { projects: [] };
  } catch (err) {
    return { projects: [] };
  }
};
