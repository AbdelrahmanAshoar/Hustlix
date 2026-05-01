"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editProposal } from "@/services/freelancer/editProposal";
import { getProposalByProject } from "@/services/freelancer/getProposalByProject";

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [proposalId, setProposalId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    proposedPrice: "",
    deliveryDays: "",
    coverLetter: "",
  });

  useEffect(() => {
    const loadProposal = async () => {
      if (!projectId || Number.isNaN(projectId)) {
        setIsLoading(false);
        return;
      }

      const proposal = await getProposalByProject(projectId);

      if (!proposal) {
        toast.error("No proposal found for this project");
        setIsLoading(false);
        return;
      }

      setProposalId(proposal.id);
      setFormData({
        proposedPrice: String(proposal.proposedPrice || ""),
        deliveryDays: String(proposal.deliveryDays || ""),
        coverLetter: proposal.coverLetter || "",
      });
      setIsLoading(false);
    };

    loadProposal();
  }, [projectId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!proposalId) {
      toast.error("Proposal ID is missing");
      return;
    }

    try {
      setIsSaving(true);
      const result = await editProposal(proposalId, {
        proposalId,
        proposedPrice: Number(formData.proposedPrice),
        deliveryDays: Number(formData.deliveryDays),
        coverLetter: formData.coverLetter.trim(),
      });

      if (!result.success) {
        toast.error(result.message || "Failed to update proposal");
        return;
      }

      toast.success("Proposal updated successfully");
      router.push(`/projects/${projectId}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/projects/${projectId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Proposal</CardTitle>
            <CardDescription>
              Update your price, delivery time, and cover letter while the
              project is still accepting applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="proposedPrice">Proposed Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="proposedPrice"
                      type="number"
                      min="1"
                      step="0.01"
                      className="pl-9"
                      value={formData.proposedPrice}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          proposedPrice: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDays">Delivery Days</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="deliveryDays"
                      type="number"
                      min="1"
                      className="pl-9"
                      value={formData.deliveryDays}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryDays: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  rows={10}
                  value={formData.coverLetter}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverLetter: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/projects/${projectId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
