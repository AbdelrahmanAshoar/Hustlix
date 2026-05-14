// src/app/chat/page.tsx
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


// src/components/chat/ChatComponent.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '@/config';
import Chatside from './ChatSide';
import ChatArea from './ChatArea';

// Helper لقراءة الكوكيز وفك التوكن
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const getUserIdFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.Id || payload.sub || payload.nameid;
  } catch (e) { return null; }
};

export default function ChatComponent() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connection, setConnection] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // جلب البيانات الحقيقية من التوكن الموجود في الكوكي
  useEffect(() => {
    const token = getCookie('token'); 
    if (token) {
      setAuthToken(token);
      setCurrentUserId(getUserIdFromToken(token));
    }
  }, []);

  const apiCall = useCallback(async (method: string, url: string, body?: any) => {
    if (!authToken) return;
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
  }, [authToken]);

  const loadConvs = useCallback(async () => {
    const data = await apiCall('GET', '/api/User/my-conversations');
    if (data) setConversations(data);
  }, [apiCall]);

  useEffect(() => {
    if (!authToken) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/chatHub?access_token=${encodeURIComponent(authToken)}`, {
        transport: signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (msg) => {
      setSelectedConv((prev: any) => {
        if (prev && String(prev.otherUser.id) === String(msg.senderId)) {
          setMessages((msgs: any) => [...msgs, msg]);
        }
        return prev;
      });
      loadConvs();
    });

    newConnection.on("MessageSent", (msg) => {
      setSelectedConv((prev: any) => {
        if (prev && String(prev.otherUser.id) === String(msg.receiverId)) {
          setMessages((msgs: any) => [...msgs, msg]);
        }
        return prev;
      });
      loadConvs();
    });

    newConnection.start()
      .then(() => {
        setIsOnline(true);
        loadConvs();
      })
      .catch(err => console.error("SignalR Error: ", err));

    setConnection(newConnection);
    return () => { newConnection.stop(); };
  }, [authToken, loadConvs]);

  const handleOpenConv = async (conv: any) => {
    setSelectedConv(conv);
    const data = await apiCall('GET', `/api/User/conversation-with/${conv.otherUser.id}`);
    if (data) setMessages(data);
  };

  const handleSend = async () => {
    if (!connection || !inputText.trim() || !selectedConv) return;
    try {
      await connection.invoke("SendMessage", selectedConv.otherUser.id, inputText, null);
      setInputText('');
    } catch (e) { console.error("Send Error", e); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[75vh] min-h-[500px] max-h-[800px] shadow-2xl rounded-3xl overflow-hidden border border-slate-200 bg-white">
      <Chatside 
        conversations={conversations} 
        selectedId={selectedConv?.otherUser.id}
        onSelect={handleOpenConv}
        isOnline={isOnline}
      />
      <ChatArea 
        selectedConv={selectedConv}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSend}
        inputText={inputText}
        setInputText={setInputText}
      />
    </div>
  );
}


// src/components/chat/ChatSide.tsx
'use client';
import { cn } from '@/lib/utils';

export default function Chatside({ conversations, selectedId, onSelect, isOnline }: any) {
  return (
    <div className="flex flex-col h-full border-r border-slate-100 bg-white min-h-0"> {/* min-h-0 مهمة للـ Flexbox */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
        <h3 className="font-bold text-lg text-slate-800">Chats</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-xs font-medium text-slate-500">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* منطقة التمرير المستقلة */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {conversations.length > 0 ? (
          conversations.map((c: any) => (
            <div 
              key={c.otherUser.id}
              onClick={() => onSelect(c)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50",
                selectedId === c.otherUser.id && "bg-indigo-50 border-r-4 border-indigo-500"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                {c.otherUser.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-900 truncate text-sm">{c.otherUser.fullName}</p>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.lastMessage || 'No messages'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 p-10 text-sm">No conversations</p>
        )}
      </div>
    </div>
  );
}

// src/components/chat/ChatArea.tsx
'use client';
import { useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ChatArea({ selectedConv, messages, onSendMessage, currentUserId, inputText, setInputText }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc] custom-scrollbar">
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
        <div ref={scrollRef} className="h-4" />
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