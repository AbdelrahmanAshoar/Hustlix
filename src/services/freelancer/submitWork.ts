import { SubmitWorkDto } from "@/app/services/types/freelancer";

export const submitWork = async (payload: SubmitWorkDto) => {
  const res = await fetch("/api/Freelancer/submit-work", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to submit work");
  }

  return data;
};
