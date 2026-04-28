// services/client/editProjectServices.ts
import { EditProjectDto } from "@/app/services/types/client";

export const editProjectServices = async (payload: EditProjectDto) => {
  try {
    const res = await fetch(`/api/projects/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Update failed");
    }

    return data;
  } catch (err) {
    console.error("editProjectServices error:", err);
    throw err;
  }
};