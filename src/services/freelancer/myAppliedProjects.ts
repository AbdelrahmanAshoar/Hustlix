export interface AppliedProject {
  id: number;
  projectId?: number;
  proposedPrice?: number;
  deliveryDays?: number;
  coverLetter?: string;
  status?: string;
  submittedAt?: string;
  project?: {
    id?: number;
    title?: string;
    description?: string;
    budget?: number;
    deadline?: string;
    status?: string;
    requiredSkills?: string;
  };
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
  requiredSkills?: string;
  milestoneId?: number;
  workDeliveryId?: number;
}

export const getMyAppliedProjects = async (): Promise<AppliedProject[]> => {
  const res = await fetch("/api/Freelancer/my-applied-projects", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load applications");
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.proposals)) return data.proposals;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};
