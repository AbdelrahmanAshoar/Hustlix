"use client";

import ChatComponent from "@/components/chat/ChatComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/config";
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
        <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
        <p className="text-muted-foreground">
          Continue project conversations and exchange attachments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Project Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatComponent userId={user.id.toString()} hubUrl={`${API_BASE_URL}/chatHub`} />
        </CardContent>
      </Card>
    </div>
  );
}
