"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AppliedProject,
  getMyAppliedProjects,
} from "@/services/freelancer/myAppliedProjects";

const getProject = (item: AppliedProject) => item.project || item;

const getProjectId = (item: AppliedProject) =>
  item.projectId || item.project?.id || item.id;

const getStatusClass = (status?: string) => {
  const value = status?.toLowerCase() || "pending";

  if (value.includes("accept") || value.includes("award")) {
    return "bg-green-100 text-green-700 hover:bg-green-100";
  }

  if (value.includes("reject")) {
    return "bg-red-100 text-red-700 hover:bg-red-100";
  }

  return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
};

export default function FreelancerApplicationsPage() {
  const [applications, setApplications] = useState<AppliedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyAppliedProjects();
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return applications;

    return applications.filter((item) => {
      const project = getProject(item);
      return (
        project.title?.toLowerCase().includes(term) ||
        project.requiredSkills?.toLowerCase().includes(term) ||
        item.status?.toLowerCase().includes(term)
      );
    });
  }, [applications, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Proposals</h1>
          <p className="text-muted-foreground">
            Track every bid you sent and see what needs your attention.
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project, skill, or status"
            className="pl-9"
          />
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {applications.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {
              applications.filter((item) =>
                (item.status || "Pending").toLowerCase().includes("pending")
              ).length
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {
              applications.filter((item) => {
                const status = item.status?.toLowerCase() || "";
                return status.includes("accept") || status.includes("award");
              }).length
            }
          </CardContent>
        </Card>
      </div>

      {!filteredApplications.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No proposals found</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Browse open projects and send your first proposal when you find a
              good fit.
            </p>
            <Link href="/projects">
              <Button>Browse Projects</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((item) => {
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
                        <Badge className={getStatusClass(item.status)}>
                          {item.status || "Pending"}
                        </Badge>
                      </div>

                      <p className="max-w-3xl text-sm text-muted-foreground line-clamp-2">
                        {project.description || item.coverLetter}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills
                          ?.split(",")
                          .filter(Boolean)
                          .slice(0, 5)
                          .map((skill) => (
                            <Badge key={skill.trim()} variant="secondary">
                              {skill.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="grid min-w-60 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Your bid
                        </span>
                        <strong className="text-foreground">
                          ${item.proposedPrice?.toLocaleString() || "0"}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Delivery
                        </span>
                        <strong className="text-foreground">
                          {item.deliveryDays || 0} days
                        </strong>
                      </div>
                      <Link href={`/projects/${projectId}`}>
                        <Button variant="outline" className="w-full">
                          View Project
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
    </div>
  );
}
