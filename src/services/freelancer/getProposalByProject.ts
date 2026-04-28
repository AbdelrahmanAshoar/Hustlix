// services/freelancer/getProposalByProject.ts
import { ProposalData } from "@/app/services/types/freelancer";

export async function getProposalByProject(projectId: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Freelancer/get-proposal/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No proposal found
      }
      throw new Error('Failed to fetch proposal');
    }

    const data = await response.json();
    return data as ProposalData;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
}