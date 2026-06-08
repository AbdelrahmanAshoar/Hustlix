"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { closeProjectServices } from "@/services/client/closeProjectServices";
import { editProjectServices } from "@/services/client/editProjectServices";
import {
  clientProjects,
  EditMilestoneDto,
  EditProjectDto,
} from "@/app/services/types/client";
import { Briefcase, Users, FileText, Activity, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ClientDashboard({ data }: { data: clientProjects[] }) {
  const [projects, setProjects] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  // State for edit dialog
  const [selectedProject, setSelectedProject] = useState<clientProjects | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 0,
    deadline: "",
    requiredSkills: "",
    milestones: [] as EditMilestoneDto[],
  });

  const getProjectState = (status?: string) =>
    (status || "Open").toLowerCase().replace(/\s+/g, "_");

  const isOpenProject = (status?: string) => getProjectState(status) === "open";

  const getStatusBadgeClass = (status?: string) => {
    const state = getProjectState(status);

    if (state.includes("complete") || state.includes("closed")) {
      return "text-green-700 border-green-200 bg-green-50";
    }

    if (state.includes("progress") || state.includes("award")) {
      return "text-blue-700 border-blue-200 bg-blue-50";
    }

    if (state.includes("cancel")) {
      return "text-red-700 border-red-200 bg-red-50";
    }

    return "text-emerald-700 border-emerald-200 bg-emerald-50";
  };

  // ===== Dynamic Stats =====
  const totalSpend = projects?.reduce((acc, p) => acc + (p.budget || 0), 0);
  const activeJobs = projects?.filter((p) => isOpenProject(p.status)).length;
  const hiredTalent = projects?.filter(
    (p) => p.selectedFreelancer !== null,
  ).length;
  const inProgressJobs = projects?.filter((p) => {
    const state = getProjectState(p.status);
    return state.includes("progress") || state.includes("award");
  }).length;
  const completedJobs = projects?.filter((p) => {
    const state = getProjectState(p.status);
    return state.includes("complete") || state.includes("closed");
  }).length;

  // Open edit dialog with project data
  // Open edit dialog with project data
  const openEditDialog = (project: clientProjects) => {
    setSelectedProject(project);

    // Format milestones for the form
    const formattedMilestones: EditMilestoneDto[] = project.milestones.map(
      (m) => ({
        id: m.id,
        title: m.title,
        description: m.description || "",
        amount: m.amount,
        deadline: m.deadline,
      }),
    );

    // Format deadline to YYYY-MM-DD and ensure it's not in the past
    let deadlineDate = project.deadline ? project.deadline.split("T")[0] : "";

    // If deadline is in the past, suggest a future date
    const today = new Date().toISOString().split("T")[0];
    if (deadlineDate && new Date(deadlineDate) < new Date(today)) {
      console.warn("⚠️ Project deadline is in the past:", deadlineDate);
      // Optionally set to today or keep as is
      // deadlineDate = today;
    }

    setFormData({
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: deadlineDate,
      requiredSkills: project.requiredSkills,
      milestones: formattedMilestones,
    });

    setIsEditDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsLoading(true);

    try {
      // Validate date
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert("❌ Deadline cannot be in the past");
        return;
      }

      const payload: EditProjectDto = {
        projectId: selectedProject.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
        requiredSkills: formData.requiredSkills.trim(),
        milestones: formData.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description || "",
          amount: Number(m.amount),
          deadline: new Date(m.deadline).toISOString(),
        })),
      };

      const result = await editProjectServices(payload);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                title: payload.title,
                description: payload.description,
                budget: payload.budget,
                deadline: payload.deadline,
                requiredSkills: payload.requiredSkills,
              }
            : p,
        ),
      );

      setIsEditDialogOpen(false);

      alert("✅ Project updated successfully!");
      console.log("Response:", result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Client Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your projects, proposals, and freelance talent.
          </p>
        </div>

        <Link
          href="./client/addProject"
          className="bg-[#2563EB] rounded-full px-8 py-2 text-white shadow-md hover:bg-[#2563EB]/90 transition-colors"
        >
          Post a New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spend Tracking
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpend?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">Open for proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressJobs || 0}</div>
            <p className="text-xs text-muted-foreground">Awarded or active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedJobs || hiredTalent || 0}
            </div>
            <p className="text-xs text-muted-foreground">Closed lifecycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Edit Project
              </DialogTitle>
              <DialogDescription>
                Update your project details below. Changes will be reflected
                immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* GRID INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Build a SaaS platform"
                    required
                  />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget ($)</label>
                  <input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Skills</label>
                  <input
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="React, Node, Next.js"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              {/* Milestones Section - Optional: Display current milestones */}
              {formData.milestones.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Current Milestones
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.milestones.map((milestone, idx) => (
                      <div
                        key={milestone.id}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              {milestone.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Amount: ${milestone.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              Due:{" "}
                              {new Date(
                                milestone.deadline,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">ID: {milestone.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Note: Milestones cannot be edited from this form. Contact
                    support to modify milestones.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Posted Projects</CardTitle>
              <CardDescription>
                Review and manage your current open listings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {!projects?.length ? (
                <p className="text-muted-foreground text-center py-8">
                  No projects yet
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="mb-4 sm:mb-0 flex-1">
                      <h4 className="font-semibold text-base mb-1 hover:underline cursor-pointer">
                        {project.title}
                      </h4>

                      <p className="text-xs text-muted-foreground mb-2">
                        Posted{" "}
                        {new Date(project.postedDate).toLocaleDateString()} •
                        Budget ${project.budget?.toLocaleString()}
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">
                          {project.proposalsCount} Proposals
                        </Badge>

                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(project.status)}
                        >
                          {project.status}
                        </Badge>
                        {project.selectedFreelancer && (
                          <Badge variant="outline">Freelancer selected</Badge>
                        )}
                        {(project.workDeliveriesCount || 0) > 0 && (
                          <Badge variant="secondary">
                            {project.workDeliveriesCount} deliveries
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 justify-start sm:justify-center">
                      <Link
                        href={`/dashboard/client/viewProposals/${project.id}`}
                      >
                        <Button variant="outline" size="sm">
                          View Proposals
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        disabled={!isOpenProject(project.status) || isLoading}
                        onClick={() => openEditDialog(project)}
                        size="sm"
                        className="text-primary hover:bg-primary/10"
                      >
                        Edit Job
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!isOpenProject(project.status) || isLoading}
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to close this project?",
                            )
                          ) {
                            await closeProjectServices(project.id);
                            setProjects((prev) =>
                              prev.map((p) =>
                                p.id === project.id
                                  ? { ...p, status: "Closed" }
                                  : p,
                              ),
                            );
                          }
                        }}
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Close Job
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            <CardFooter>
              <Button variant="ghost" className="w-full text-primary">
                View All History
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Chat */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
              <CardDescription>
                Communicate with your freelancers.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start conversations with freelancers on your projects.
              </p>

              <Link href="/dashboard/messages">
                <Button className="w-full">Open Chat</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
