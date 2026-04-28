export const getProjectByID = async (id: number) => {
  try {
    const res = await fetch(`/api/Freelancer/GetProject/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to get project");
    }

    return data;
  } catch (err) {
    console.error("getProject error:", err);
    throw err;
  }
};