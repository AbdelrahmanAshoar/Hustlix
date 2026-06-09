import { Dispute, ResolveDisputeDto } from "@/app/services/types/admin";

export async function getDisputes(): Promise<Dispute[]> {
  const res = await fetch("/api/admin/disputes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch disputes");
  }

  return res.json();
}

export async function resolveDispute(data: ResolveDisputeDto): Promise<{ message: string }> {
  const res = await fetch("/api/admin/resolve-dispute", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(resData.message || "Failed to resolve dispute");
  }

  return resData;
}
