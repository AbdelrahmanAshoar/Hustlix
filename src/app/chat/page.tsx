import ChatComponent from '@/Components/chat/ChatComponent';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
    <div className="max-w-7xl mx-auto h-[85vh]">
      <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Connect and collaborate with your freelance team in real-time.
          </p>
      </div>
      
      <ChatComponent />
    </div>
  </main>
  );
}