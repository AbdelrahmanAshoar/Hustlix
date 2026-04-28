// app/dashboard/client/viewProposals/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Briefcase,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getProjectProposals } from "@/services/client/getProjectProposals";
import { selectFreelancer } from "@/services/client/selectFreelancer";
import { toast } from "sonner";
import { Proposal } from "@/app/services/types/client";

export default function ViewProposalsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProposals();
  }, [projectId]);

// app/dashboard/client/viewProposals/[id]/page.tsx
const fetchProposals = async () => {
  setIsLoading(true);
  setError(null);
  try {
    // Get token from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
      return null;
    };

    const token = getCookie('token');

    const response = await fetch(
      `http://proafree.runasp.net/api/Client/project-proposals/filter?ProjectId=${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Get response as text first
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let proposalsData = [];
    
    // Try to parse as JSON
    try {
      const parsedData = JSON.parse(responseText);
      proposalsData = Array.isArray(parsedData) ? parsedData : [];
    } catch (parseError) {
      // If it's not JSON (like "No proposals found"), return empty array
      console.log("Response is not JSON, returning empty array");
      proposalsData = [];
    }

    setProposals(proposalsData);
    
  } catch (err: any) {
    console.error("Error fetching proposals:", err);
    setError(err.message || "Failed to load proposals");
    setProposals([]); // Set empty array on error
  } finally {
    setIsLoading(false);
  }
};

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      setLoadingId(proposal.id);
      const res = await selectFreelancer(proposal.id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Freelancer selected successfully");

      // Update local state
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposal.id
            ? { ...p, status: "Accepted" }
            : p.status === "Pending" 
            ? { ...p, status: "Rejected" }
            : p
        )
      );

      // Optional: Refresh after 2 seconds
      setTimeout(() => {
        fetchProposals();
      }, 2000);
      
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">
                  Error Loading Proposals
                </h2>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProposals}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/client"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
              <p className="text-gray-600 mt-1">
                Review and manage freelancer proposals for this project
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {proposals.length} {proposals.length === 1 ? "Proposal" : "Proposals"}
            </Badge>
          </div>
        </div>

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-md mx-auto">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Proposals Yet
                </h3>
                <p className="text-gray-500">
                  No freelancers have submitted proposals for this project yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b bg-white">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {proposal.freelancer?.fullName?.charAt(0) || "F"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {proposal.freelancer?.fullName || "Unknown Freelancer"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-3 w-3" />
                          <span>Freelancer</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(proposal.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Proposed Price</p>
                        <p className="text-xl font-bold text-green-600">
                          ${proposal.proposedPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Time</p>
                        <p className="text-xl font-bold text-blue-600">
                          {proposal.deliveryDays} days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {proposal.coverLetter || "No cover letter provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleAcceptProposal(proposal)}
                      disabled={loadingId === proposal.id || proposal.status !== "Pending"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loadingId === proposal.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept Proposal
                        </>
                      )}
                    </Button>

                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message Freelancer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}