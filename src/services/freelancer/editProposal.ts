// services/freelancer/editProposal.ts
import { UpdateProposalDto, ProposalData } from "@/app/services/types/freelancer";

export async function editProposal(proposalId: number, data: UpdateProposalDto) {
  try {
    const response = await fetch("/api/Freelancer/edit-proposals", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, proposalId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update proposal");
    }

    const result = await response.json();
    return {
      success: true,
      data: result as ProposalData,
      message: "Proposal updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating proposal:", error);
    return {
      success: false,
      message: error.message || "Failed to update proposal",
    };
  }
}
