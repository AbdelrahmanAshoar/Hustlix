"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, DollarSign, Loader2, TrendingUp, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AppliedProject,
  getMyAppliedProjects,
} from "@/services/freelancer/myAppliedProjects";

const getProject = (item: AppliedProject) => item.project || item;

const isAccepted = (status?: string) => {
  const value = status?.toLowerCase() || "";
  return (
    value.includes("accept") ||
    value.includes("award") ||
    value.includes("progress") ||
    value.includes("complete")
  );
};

export default function FreelancerEarningsPage() {
  const [items, setItems] = useState<AppliedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyAppliedProjects();
        setItems(data);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const acceptedItems = useMemo(
    () => items.filter((item) => isAccepted(item.status)),
    [items]
  );

  const totalEarnings = acceptedItems.reduce(
    (sum, item) => sum + (Number(item.proposedPrice) || 0),
    0
  );

  const pendingClearance = acceptedItems
    .filter((item) => {
      const status = item.status?.toLowerCase() || "";
      return status.includes("progress") || status.includes("submitted");
    })
    .reduce((sum, item) => sum + (Number(item.proposedPrice) || 0), 0);

  const availableBalance = Math.max(totalEarnings - pendingClearance, 0);

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
          <h1 className="text-3xl font-bold tracking-tight">
            Wallet & Earnings
          </h1>
          <p className="text-muted-foreground">
            View accepted project value, pending clearance, and withdrawal state.
          </p>
        </div>
        <Button disabled>
          <Wallet className="mr-2 h-4 w-4" />
          Request Withdrawal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Clearance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingClearance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${availableBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accepted Project Earnings List */}
      <Card>
        <CardHeader>
          <CardTitle>Accepted Project Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {!acceptedItems.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Accepted projects will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {acceptedItems.map((item) => {
                const project = getProject(item);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h2 className="font-semibold">
                        {project.title || "Untitled project"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Delivery: {item.deliveryDays || 0} days
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.status || "Accepted"}</Badge>
                      <div className="text-lg font-bold">
                        ${Number(item.proposedPrice || 0).toLocaleString()}
                      </div>
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
