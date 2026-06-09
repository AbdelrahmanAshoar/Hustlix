// src/app/services/types/admin.ts

export interface Dispute {
  id: number;
  projectId: number;
  reason: string;
  status: string; // e.g., "Pending" | "Resolved"
  decision?: string; // e.g., "Refund" | "PayFreelancer"
  submittedAt?: string;
  projectTitle?: string;
  clientName?: string;
  freelancerName?: string;
  project?: {
    id: number;
    title: string;
    budget: number;
  };
}

export interface ResolveDisputeDto {
  disputeId: number;
  decision: "Refund" | "PayFreelancer" | string;
}

export interface DisputeRequestDto {
  projectId: number;
  reason: string;
}
