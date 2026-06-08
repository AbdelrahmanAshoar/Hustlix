/**
 * Type representing a freelancer's applied project (proposal).
 * The `project` field is populated when the API returns nested project data;
 * otherwise top-level fields (title, budget, etc.) are used directly.
 */
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
  // Flat fields (when API returns project data at the top level)
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
  requiredSkills?: string;
  milestoneId?: number;
  workDeliveryId?: number;
}

/**
 * Fetches all projects the current freelancer has applied to.
 * Handles multiple possible API response shapes gracefully.
 */
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
