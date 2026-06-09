"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDisputes, resolveDispute } from "@/services/admin/adminServices";
import { Dispute } from "@/app/services/types/admin";
import { AlertCircle, Scale, CheckCircle, ShieldAlert, Loader2, ArrowLeft, Landmark, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await getDisputes();
      setDisputes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error("Failed to load disputes", {
        description: err.message || "An error occurred while fetching the disputes.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (disputeId: number, decision: "Refund" | "PayFreelancer") => {
    try {
      setActionLoadingId(disputeId);
      const res = await resolveDispute({ disputeId, decision });
      toast.success(res.message || "Dispute resolved successfully!");
      await fetchDisputes();
    } catch (err: any) {
      toast.error("Failed to resolve dispute", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <Link href="/dashboard/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Dispute Resolution Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Review conflicts raised by clients and issue final decisions (Refund Client or Pay Freelancer).
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDisputes} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Disputes Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Fetching disputes data...</p>
        </div>
      ) : disputes.length === 0 ? (
        <Card className="border-dashed border-2 py-16 text-center shadow-none bg-muted/5">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold">All clear!</h3>
            <p className="text-muted-foreground max-w-sm">
              There are currently no active disputes on the platform requiring immediate review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {disputes.map((dispute) => {
            const isPending = (dispute.status || "Pending").toLowerCase() === "pending";
            return (
              <Card key={dispute.id} className="overflow-hidden border-l-4 border-l-destructive shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="destructive" className="font-semibold uppercase tracking-wider text-[10px]">
                          Dispute #{dispute.id}
                        </Badge>
                        <Badge variant={isPending ? "outline" : "secondary"} className={isPending ? "border-amber-200 text-amber-700 bg-amber-50" : "bg-green-50 text-green-700 border-green-200"}>
                          {dispute.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold mt-2">
                        {dispute.projectTitle || dispute.project?.title || `Project #${dispute.projectId}`}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Disputed Project ID: <span className="font-mono">{dispute.projectId}</span>
                      </CardDescription>
                    </div>
                    {dispute.submittedAt && (
                      <span className="text-xs text-muted-foreground">
                        Submitted: {new Date(dispute.submittedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="py-6 space-y-4">
                  {/* Parties Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl text-sm border">
                    <div>
                      <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Client</span>
                      <span className="font-semibold text-slate-800">{dispute.clientName || "Platform Client"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Freelancer</span>
                      <span className="font-semibold text-slate-800">{dispute.freelancerName || "Assigned Freelancer"}</span>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Reason for Dispute</span>
                    <p className="text-sm text-slate-700 leading-relaxed bg-destructive/5 border border-destructive/10 p-3 rounded-lg flex items-start gap-2">
                      <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span>{dispute.reason}</span>
                    </p>
                  </div>

                  {/* Resolution Status if resolved */}
                  {!isPending && dispute.decision && (
                    <div className="mt-4 p-4 rounded-xl border border-green-200 bg-green-50/50 text-sm">
                      <span className="font-bold text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Resolved Decision: {dispute.decision}
                      </span>
                    </div>
                  )}
                </CardContent>

                {isPending && (
                  <CardFooter className="bg-muted/10 border-t flex justify-end gap-3 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(dispute.id, "Refund")}
                      disabled={actionLoadingId !== null}
                      className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-semibold gap-1.5"
                    >
                      {actionLoadingId === dispute.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Landmark className="h-4 w-4" />
                      )}
                      Refund Client
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleResolve(dispute.id, "PayFreelancer")}
                      disabled={actionLoadingId !== null}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
                    >
                      {actionLoadingId === dispute.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Pay Freelancer
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
