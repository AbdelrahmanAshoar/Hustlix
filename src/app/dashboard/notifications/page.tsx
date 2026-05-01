import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, CreditCard, FileText, MessageSquare } from "lucide-react";

const notificationTypes = [
  {
    title: "New proposals",
    description: "Clients receive alerts when freelancers apply to open projects.",
    icon: FileText,
    status: "Ready",
  },
  {
    title: "Accepted bids",
    description: "Freelancers can track accepted, rejected, and pending proposals.",
    icon: CheckCircle,
    status: "Ready",
  },
  {
    title: "Work submitted",
    description: "Submitted deliverables move the project into client review.",
    icon: Bell,
    status: "Ready",
  },
  {
    title: "Payment lifecycle",
    description: "Escrow and released payment states are reflected in the payments page.",
    icon: CreditCard,
    status: "Ready",
  },
  {
    title: "Messages",
    description: "Project chat and attachment APIs are wired through local proxy routes.",
    icon: MessageSquare,
    status: "Ready",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Lifecycle alerts for proposals, awards, submissions, and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {notificationTypes.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {item.status}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
