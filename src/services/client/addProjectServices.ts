import { AddProjectDto } from "@/app/services/types/client";


export const addProjectServices = async (data: AddProjectDto) => {
  const res = await fetch("/api/projects", {
    method: "POST",
     headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed")
  }

  return res.json()
}