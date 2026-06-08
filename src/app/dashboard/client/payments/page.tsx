import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/services/client/getProjects";
import { Calendar, CreditCard, DollarSign, FileText } from "lucide-react";

const getPaymentStatus = (status?: string) => {
  const value = status?.toLowerCase() || "";

  if (value.includes("complete") || value.includes("closed")) {
    return {
      label: "Released",
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    };
  }

  if (value.includes("progress") || value.includes("award")) {
    return {
      label: "In Escrow",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    };
  }

  return {
    label: "Awaiting Award",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  };
};

export default async function ClientPaymentsPage() {
  const data = await getProjects();
  const projects = data?.projects || [];

  const totalBudget = projects.reduce(
    (sum: number, project: any) => sum + (Number(project.budget) || 0),
    0
  );
  const escrowTotal = projects
    .filter((project: any) => {
      const status = project.status?.toLowerCase() || "";
      return status.includes("progress") || status.includes("award");
    })
    .reduce((sum: number, project: any) => sum + (Number(project.budget) || 0), 0);
  const releasedTotal = projects
    .filter((project: any) => {
      const status = project.status?.toLowerCase() || "";
      return status.includes("complete") || status.includes("closed");
    })
    .reduce((sum: number, project: any) => sum + (Number(project.budget) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Payments & Invoices
        </h1>
        <p className="text-muted-foreground">
          Track project budgets, escrowed funds, and release history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${escrowTotal.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Released</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${releasedTotal.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Payment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Payment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {!projects.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No payment records yet.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project: any) => {
                const paymentStatus = getPaymentStatus(project.status);

                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">
                          {project.title || "Untitled project"}
                        </h2>
                        <Badge className={paymentStatus.className}>
                          {paymentStatus.label}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {project.postedDate
                            ? new Date(project.postedDate).toLocaleDateString()
                            : "No date"}
                        </span>
                        <span>Project status: {project.status || "Open"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${Number(project.budget || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fixed budget
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Invoice
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
