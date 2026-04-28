import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Activity, Settings, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disputes / Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">5</div>
            <p className="text-xs text-muted-foreground">Requires immediate review</p>
          </CardContent>
        </Card>
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
                  <Badge variant={user.role === 'Client' ? 'secondary' : 'default'} className="text-[10px] uppercase">
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
            <CardTitle>System Settings & Quick Actions</CardTitle>
            <CardDescription>Configure platform fees and CMS integration.</CardDescription>
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
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20 hover:text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Resolve Disputes (5)</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm">System Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
