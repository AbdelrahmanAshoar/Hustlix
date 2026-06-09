import { DisputeRequestDto } from "@/app/services/types/admin";

export async function submitDispute(data: DisputeRequestDto): Promise<{ message: string; disputeId: number }> {
  const res = await fetch("/api/client/dispute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(resData.message || "Failed to submit dispute");
  }

  return resData;
}

export async function deleteProject(projectId: number): Promise<{ message: string }> {
  const res = await fetch(`/api/client/delete-project/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(resData.message || "Failed to delete project");
    (err as any).status = res.status;
    (err as any).data = resData;
    throw err;
  }

  return resData;
}
