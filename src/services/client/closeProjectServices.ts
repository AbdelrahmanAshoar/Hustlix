export const closeProjectServices = async (projectId: number) => {
  const res = await fetch(`/api/projects/${projectId}/close`, {
    method: "PUT",
  })

  const data = await res.json()
  console.log("*************closed***************")

  if (!res.ok) {
    throw new Error(data.message || "Failed to close project")
  }

  return data
}