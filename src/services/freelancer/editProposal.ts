// services/freelancer/editProposal.ts
import { UpdateProposalDto, ProposalData } from "@/app/services/types/freelancer";

export async function editProposal(proposalId: number, data: UpdateProposalDto) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Freelancer/edit-proposal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // if using auth token
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update proposal');
    }

    const result = await response.json();
    return {
      success: true,
      data: result as ProposalData,
      message: 'Proposal updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    return {
      success: false,
      message: error.message || 'Failed to update proposal'
    };
  }
}