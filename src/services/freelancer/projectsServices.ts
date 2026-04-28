import { cookies } from "next/headers";
export const projectsServices = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value?.trim();
  try {
    const res = await fetch("http://proafree.runasp.net/api/Freelancer/browse-projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("STATUS:", res.status);

    if (!res.ok) {
      console.log("ERROR:", res.statusText);
      return [];
    }

    const data = await res.json();
    console.log("DATA:", data);

    return data;
  } catch (error) {
    console.log("FETCH ERROR:", error);
    return [];
  }
};
