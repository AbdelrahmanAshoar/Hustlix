import { cookies } from "next/headers";

export const getProjects = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(
    "http://proafree.runasp.net/api/Client/my-projects",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const text = await res.text();

  if (!res.ok) {
    console.log("❌ Failed to fetch projects:", text);
    return { projects: [] };
  }

  try {
    return text ? JSON.parse(text) : { projects: [] };
  } catch (err) {
    console.log("❌ Invalid JSON:", text);
    return { projects: [] };
  }
};