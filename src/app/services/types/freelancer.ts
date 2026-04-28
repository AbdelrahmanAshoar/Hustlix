// app/services/types/freelancer.ts


export interface UpdateProposalDto {
  proposalId: number;
  proposedPrice: number;
  deliveryDays: number;
  coverLetter: string;
}

export interface ProposalData {
  id: number;
  projectId: number;
  proposedPrice: number;
  deliveryDays: number;
  coverLetter: string;
  status: string;
  submittedAt: string;
}

export interface AddProposalRequest {
  projectId: number;
  proposedPrice: number;
  deliveryDays: number;
  coverLetter: string;
}

export interface AddProposalResponse {
  success: boolean;
  message?: string;
  data?: ProposalData;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedDate: string;
  status: string;
  requiredSkills: string;
  proposalsCount: number;
  clientName?: string;
  clientRating?: number;
  clientReviews?: number;
  clientLocation?: string;
  clientJobsPosted?: number;
  clientHireRate?: number;
}
export interface AddSkillDto {
  name?: string;
  category?: string;
}

export interface SubmitWorkDto {
  projectId: number;
  milestoneId: number;
  fileUrls: string;
}

export interface ClientDto {
  id: number;
  fullName: string;
  totalProjectsPosted: number;
  totalSpent: number;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedDate: string;
  status: string;
  requiredSkills: string;
  proposalsCount: number;
  clientName?: string;
  clientRating?: number;
  clientReviews?: number;
  clientLocation?: string;
  clientJobsPosted?: number;
  clientHireRate?: number;
}
export interface UpdateProposalDto {
  proposalId: number;
  proposedPrice: number;
  deliveryDays: number;
  coverLetter: string;
}

