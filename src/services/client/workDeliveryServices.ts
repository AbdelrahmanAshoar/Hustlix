import { ApproveWorkDto } from "@/app/services/types/client";

export const getWorkDelivery = async (workDeliveryId: number) => {
  const res = await fetch(`/api/Client/work-delivery/${workDeliveryId}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load work delivery");
  }

  return data;
};

export const approveWork = async (payload: ApproveWorkDto) => {
  const res = await fetch("/api/Client/approve-work", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to approve work");
  }

  return data;
};

export const rateFreelancer = async (payload: {
  projectId: number;
  freelancerId: number;
  rating: number;
  comment: string;
}) => {
  const res = await fetch("/api/Client/rate-freelancer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to rate freelancer");
  }

  return data;
};
