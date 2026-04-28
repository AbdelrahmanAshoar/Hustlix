
// app/services/types/client.ts

export interface clientProjects {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedDate: string;
  status: "Open" | "Closed" | string;
  requiredSkills: string;
  proposalsCount: number;
  workDeliveriesCount: number;
  selectedFreelancer: any;
  milestones: MilestoneResponse[];
}

export interface MilestoneResponse {
  id: number;
  title: string;
  amount: number;
  description: string;
  deadline: string;
  status: "Pending" | "Completed" | string;
}

export interface AddProjectDto {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  requiredSkills: string;
  milestones: Milestone[];
}

export interface Milestone {
  title: string;
  description: string;
  amount: number;
  deadline: string;
}

// ✅ This is the correct interface for edit
export interface EditProjectDto {
  projectId: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  requiredSkills: string;
  milestones: EditMilestoneDto[];
}

export interface EditMilestoneDto {
  id: number;
  title: string;
  description?: string;
  amount: number;
  deadline: string;
}

// app/services/types/proposals.ts

export interface Proposal {
  id: number;
  proposedPrice: number;
  deliveryDays: number;
  coverLetter: string;
  status: "Pending" | "Accepted" | "Rejected" | string;
  freelancer: Freelancer;
}

export interface Freelancer {
  id: number;
  fullName: string;
  email: string | null;
}

export interface SelectFreelancerDto {
  proposalId: number;
}

export interface ApproveWorkDto {
  workDeliveryId: number;
  isApproved: boolean;
}