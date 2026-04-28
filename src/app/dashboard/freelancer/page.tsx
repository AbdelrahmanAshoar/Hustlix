import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Briefcase, FileText, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FreelancerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h1>
        <p className="text-muted-foreground">{"Welcome back! Here's an overview of your activity."}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 deadline approaching</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 viewed recently</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
            <CardDescription>Your ongoing client work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm">Dashboard Redesign Project</h4>
                  <p className="text-xs text-muted-foreground">Client: TechCorp Inc.</p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <div className="font-bold text-sm">$1,500</div>
                  <div className="text-xs text-amber-500">In Progress</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Projects</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Proposals</CardTitle>
            <CardDescription>Status of your recent job applications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {[1, 2].map(i => (
              <div key={i} className="flex justify-between p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-semibold text-sm">Frontend Developer for E-commerce</h4>
                  <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Under Review</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat
          </CardTitle>
          <CardDescription>
            Communicate with your clients.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Start conversations with clients on your projects.
          </p>

          <Link href="/chat">
            <Button className="w-full">
              Open Chat
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
