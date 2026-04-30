'use client';

import ChatComponent from '@/components/chat/ChatComponent';
import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access chat.</div>;
  }

  const hubUrl = `${API_BASE_URL}/chatHub`; // Replace with actual hub URL

  return (
    <div className="container mx-auto p-4">
      <ChatComponent userId={user.id.toString()} hubUrl={hubUrl} />
    </div>
  );
}