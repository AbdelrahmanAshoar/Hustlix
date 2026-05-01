"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, DollarSign, Loader2, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AppliedProject,
  getMyAppliedProjects,
} from "@/services/freelancer/myAppliedProjects";
import { submitWork } from "@/services/freelancer/submitWork";

const getProject = (item: AppliedProject) => item.project || item;

const getProjectId = (item: AppliedProject) =>
  item.projectId || item.project?.id || item.id;

const isActiveStatus = (status?: string) => {
  const value = status?.toLowerCase() || "";
  return (
    value.includes("accept") ||
    value.includes("award") ||
    value.includes("progress") ||
    value.includes("submitted")
  );
};

export default function FreelancerActiveProjectsPage() {
  const [projects, setProjects] = useState<AppliedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<AppliedProject | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    milestoneId: "",
    fileUrls: "",
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getMyAppliedProjects();
        setProjects(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load active projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const activeProjects = useMemo(
    () => projects.filter((item) => isActiveStatus(item.status)),
    [projects]
  );

  const openSubmitDialog = (project: AppliedProject) => {
    setSelectedProject(project);
    setFormData({
      milestoneId: project.milestoneId ? String(project.milestoneId) : "",
      fileUrls: "",
    });
  };

  const handleSubmitWork = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProject) return;

    const projectId = getProjectId(selectedProject);
    const milestoneId = Number(formData.milestoneId);

    if (!projectId || !milestoneId || !formData.fileUrls.trim()) {
      toast.error("Project, milestone, and deliverable link are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitWork({
        projectId,
        milestoneId,
        fileUrls: formData.fileUrls.trim(),
      });
      toast.success("Work submitted for client review");
      setSelectedProject(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit work");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
        <p className="text-muted-foreground">
          Manage accepted work, deadlines, and final submissions.
        </p>
      </div>

      {!activeProjects.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No active projects yet</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Accepted proposals will appear here with submission controls.
            </p>
            <Link href="/dashboard/freelancer/applications">
              <Button variant="outline">View My Proposals</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeProjects.map((item) => {
            const project = getProject(item);
            const projectId = getProjectId(item);

            return (
              <Card key={`${item.id}-${projectId}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          {project.title || "Untitled project"}
                        </h2>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {item.status || "In Progress"}
                        </Badge>
                      </div>
                      <p className="max-w-3xl text-sm text-muted-foreground line-clamp-2">
                        {project.description || item.coverLetter}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          ${item.proposedPrice?.toLocaleString() || "0"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : `${item.deliveryDays || 0} days`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:min-w-48">
                      <Button onClick={() => openSubmitDialog(item)}>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Work
                      </Button>
                      <Link href={`/projects/${projectId}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent>
          <form onSubmit={handleSubmitWork}>
            <DialogHeader>
              <DialogTitle>Submit Work</DialogTitle>
              <DialogDescription>
                Send the finished deliverables to the client for review.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="milestoneId">Milestone ID</Label>
                <Input
                  id="milestoneId"
                  type="number"
                  min="1"
                  value={formData.milestoneId}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      milestoneId: event.target.value,
                    }))
                  }
                  placeholder="Example: 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrls">Deliverable link or file URL</Label>
                <Textarea
                  id="fileUrls"
                  rows={4}
                  value={formData.fileUrls}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      fileUrls: event.target.value,
                    }))
                  }
                  placeholder="Paste uploaded file URL, Drive link, or final delivery notes"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedProject(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
