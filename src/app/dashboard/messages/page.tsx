"use client";

import ChatComponent from "@/components/chat/ChatComponent";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading message center...
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Please log in to access messages.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6 inline mr-2" strokeWidth={3.5} />
          Message Center
        </h1>
        <p className="text-muted-foreground">
          Continue project conversations and exchange attachments.
        </p>
      </div>

      <ChatComponent currentUser={user} />

    </div>
  );
}
