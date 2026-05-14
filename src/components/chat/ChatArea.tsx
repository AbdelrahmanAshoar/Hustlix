'use client';
import { useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, MoreVertical, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ChatArea({ selectedConv, messages, onSendMessage, currentUserId, inputText, setInputText }: any) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    // Add a small delay to ensure the DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 0);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  if (!selectedConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fdfdfd] text-muted-foreground p-10 text-center h-full">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">💬</div>
        <h4 className="text-slate-900 font-semibold mb-1">Your Inbox</h4>
        <p className="text-xs max-w-[200px]">Select a conversation from the left to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0 relative">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-white shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <img src={selectedConv.otherUser.profilePicture || '/default-avatar.png'} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{selectedConv.otherUser.fullName}</h4>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8"><Search size={16} /></Button>
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8"><MoreVertical size={16} /></Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc] custom-scrollbar">
        {messages.map((msg: any, i: number) => {
          const isMe = String(msg.senderId) === String(currentUserId);
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`group relative max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.message}
                </div>
                <p className={`text-[9px] mt-1.5 font-bold text-slate-400 uppercase tracking-tighter ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t bg-white shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-slate-50 border rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
          <Button variant="ghost" size="icon" className="text-slate-400 shrink-0"><Paperclip size={20} /></Button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Write a message..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          <Button 
            onClick={onSendMessage} 
            disabled={!inputText.trim()}
            className="rounded-xl px-4 h-9 shadow-lg shadow-primary/20"
          >
            <Send size={16} className="mr-2" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}