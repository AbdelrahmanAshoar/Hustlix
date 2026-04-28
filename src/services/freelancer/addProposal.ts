// services/freelancer/addProposal.ts
import { AddProposalRequest, AddProposalResponse } from "@/app/services/types/freelancer";

export const addProposal = async (data: AddProposalRequest): Promise<AddProposalResponse> => {
  try {
    // Get token from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const token = getCookie("token");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch("/api/Freelancer/add-proposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit proposal");
    }

    return result;
  } catch (error) {
    console.error("Add proposal error:", error);
    throw error;
  }
};