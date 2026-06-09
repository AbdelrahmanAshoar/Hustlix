import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
export const projectsServices = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value?.trim();
  try {
    const res = await fetch(`${API_BASE_URL}/api/Freelancer/browse-projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("FETCH ERROR:", error);
    return [];
  }
};
