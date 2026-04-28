"use client";

import { useEffect, useState } from "react";
import { Globe, MapPin, Star, Flag, CheckCircle, Clock, Zap, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Link from "next/link";
import { useParams } from 'next/navigation';
import { toast } from "sonner";
import { getProjectByID } from "@/services/freelancer/getProjectByID";
import { ProjectData } from "@/app/services/types/freelancer";
import { getProposalByProject } from "@/services/freelancer/getProposalByProject";
import { ProposalData } from "@/app/services/types/freelancer";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingProposal, setExistingProposal] = useState<ProposalData | null>(null);
  const [isCheckingProposal, setIsCheckingProposal] = useState(true);

  // Fetch project details
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // Check for existing proposal after project is loaded
  useEffect(() => {
    if (projectId && project) {
      checkExistingProposal();
    }
  }, [projectId, project]);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjectByID(projectId);
      console.log("Project details:", data);
      setProject(data);
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message || "Failed to load project details");
      toast.error(err.message || "Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingProposal = async () => {
    setIsCheckingProposal(true);
    try {
      const proposal = await getProposalByProject(projectId);
      setExistingProposal(proposal);
    } catch (error) {
      console.error("Error checking proposal:", error);
    } finally {
      setIsCheckingProposal(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden shadow-lg border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading project details...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden shadow-lg border-0 border-red-200 bg-red-50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Project</h2>
              <p className="text-red-600 mb-4">{error || "Project not found"}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Card */}
        <Card className="overflow-hidden shadow-lg border-0">
          <CardContent className="p-0">
            {/* Job Title Section */}
            <div className="p-6 md:p-8 border-b">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted {formatDate(project.postedDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{project.clientLocation || "Worldwide"}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Flag className="h-4 w-4 mr-1" />
                  Flag as inappropriate
                </Button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="p-6 md:p-8 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Skills Section */}
            {project.requiredSkills && (
              <div className="p-6 md:p-8 border-b bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Connects Section */}
            <div className="p-6 md:p-8 border-b bg-amber-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Required Connects to submit a proposal:</div>
                  <div className="text-2xl font-bold text-gray-900">14</div>
                  <div className="text-sm text-gray-500 mt-1">Available Connects: 60</div>
                </div>
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Connects used</span>
                    <span>14/60</span>
                  </div>
                  <Progress value={23.3} className="h-2" />
                </div>
              </div>
            </div>

            {/* Client Info Section */}
            <div className="p-6 md:p-8 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About the client</h2>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Payment method verified
                  </Badge>
                  <Badge variant="secondary" className="bg-green-50 text-blue-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Phone number verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(project.clientRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {project.clientRating?.toFixed(1) || "5.00"}
                  </span>
                  <span className="text-gray-500">
                    of {project.clientReviews || 0} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Details Section */}
            <div className="p-6 md:p-8 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    ${project.budget?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Fixed-price</div>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-12" />
                <div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {project.status === "Open" ? "Open for Bids" : project.status}
                  </Badge>
                  <div className="text-sm text-gray-500 mt-2">
                    {project.proposalsCount || 0} proposals submitted
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-12" />
                <div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{project.clientLocation || "Worldwide"}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Stats Section */}
            <div className="p-6 md:p-8 bg-gray-50 rounded-b-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-gray-200">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {project.clientName?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {project.clientName || "Client"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.clientJobsPosted || 0} jobs posted
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {project.clientHireRate && project.clientHireRate >= 90 && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {project.clientHireRate}% hire rate
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-gray-100">
                    {project.status === "Open" ? "Accepting Proposals" : "Closed"}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {project.status === "Open" && (
                    !existingProposal ? (
                      <Link 
                        href={`/projects/addProposals/${project.id}`} 
                        className="py-2 px-4 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-green-600 hover:bg-green-700"
                      >
                        Submit a Proposal
                        <Zap className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link 
                        href={`/projects/edit-proposal/${project.id}`} 
                        className="py-2 px-4 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700"
                      >
                        Edit Proposal
                        <Zap className="h-4 w-4" />
                      </Link>
                    )
                  )}
                  
                  {/* Show existing proposal info if available */}
                  {existingProposal && !isCheckingProposal && (
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">Your proposal:</span> ${existingProposal.proposedPrice} • {existingProposal.deliveryDays} days
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(existingProposal.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {/* Show checking proposal state */}
                  {isCheckingProposal && (
                    <div className="text-right text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                      Checking your proposal...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}