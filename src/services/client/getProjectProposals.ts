// services/projects/getProjectProposals.ts

import { Proposal } from "@/app/services/types/client";

export const getProjectProposals = async (
  projectId: number
): Promise<Proposal[]> => {
  const res = await fetch(
    `/api/client/project-proposals?ProjectId=${projectId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch proposals");
  }

  return res.json();
};