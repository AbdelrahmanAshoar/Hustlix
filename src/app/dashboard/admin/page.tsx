"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Activity, Settings, AlertCircle, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type MatchingStatus = "idle" | "loading" | "success" | "error";

export default function AdminDashboard() {
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>("idle");
  const [matchingMessage, setMatchingMessage] = useState<string>("");

  const handleRunAiMatching = async () => {
    setMatchingStatus("loading");
    setMatchingMessage("");
    try {
      const res = await fetch("/api/admin/run-ai-matching", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMatchingStatus("success");
        setMatchingMessage(data.message || "AI matching completed successfully.");
      } else {
        setMatchingStatus("error");
        setMatchingMessage(data.message || "AI matching failed. Please try again.");
      }
    } catch {
      setMatchingStatus("error");
      setMatchingMessage("Network error. Could not reach the server.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
          <p className="text-muted-foreground">System overview, financial monitoring, and user management.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500.00</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">Freelancers: 840, Clients: 400</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Link href="/dashboard/admin/disputes" className="block transition-transform hover:scale-[1.02]">
          <Card className="border-destructive/30 hover:border-destructive/60 transition-all shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Disputes / Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">Review</div>
              <p className="text-xs text-muted-foreground">Requires immediate review</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Signups</CardTitle>
            <CardDescription>Latest registrations across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alice J.", role: "Freelancer", time: "10 mins ago" },
                { name: "TechNova Solutions", role: "Client", time: "1 hour ago" },
                { name: "Mike R.", role: "Freelancer", time: "2 hours ago" },
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-muted/50 transition-colors rounded-md cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-sm">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.time}</p>
                  </div>
                  <Badge variant={user.role === "Client" ? "secondary" : "default"} className="text-[10px] uppercase">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs">View All Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings &amp; Quick Actions</CardTitle>
            <CardDescription>Configure platform fees, AI matching, and CMS integration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm">Manage Commission (currently 10%)</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span className="text-sm">Sanity CMS Sync</span>
              </Button>
              <Link href="/dashboard/admin/disputes" className="w-full block col-span-1">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20 hover:text-destructive">
                  <AlertCircle className="h-5 w-5 animate-pulse" />
                  <span className="text-sm">Resolve Disputes</span>
                </Button>
              </Link>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm">System Logs</span>
              </Button>
            </div>

            {/* AI Matching Section */}
            <div className="mt-2 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-900">AI Freelancer Matching</p>
              </div>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                Runs the AI engine to match subscribed freelancers with relevant projects based on their skills and profile.
              </p>

              {/* Status feedback */}
              {matchingStatus === "success" && (
                <div className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700">{matchingMessage}</p>
                </div>
              )}
              {matchingStatus === "error" && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-600">{matchingMessage}</p>
                </div>
              )}

              <Button
                onClick={handleRunAiMatching}
                disabled={matchingStatus === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                size="sm"
              >
                {matchingStatus === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running AI Matching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run AI Matching
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
