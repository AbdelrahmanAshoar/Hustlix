'use client';
import Image from 'next/image';
import { useRef, useEffect, useState, useCallback, type ChangeEvent } from 'react';
import { Send, Paperclip, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { normalizeImageUrl } from '@/lib/imageUrl';
import type { ChatMessage, Conversation } from './types';

interface ChatAreaProps {
  selectedConv: Conversation | null;
  messages: ChatMessage[];
  onSendMessage: (attachment?: File | null) => Promise<boolean>;
  currentUserId: string | number | null;
  inputText: string;
  setInputText: (value: string) => void;
}

export default function ChatArea({ selectedConv, messages, onSendMessage, currentUserId, inputText, setInputText }: ChatAreaProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);

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

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedAttachment(file);
  };

  const handleSendClick = async () => {
    const sent = await onSendMessage(selectedAttachment);
    if (sent) {
      setSelectedAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = () => {
    setSelectedAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      <div className="px-6 py-3 border-b flex items-center justify-between bg-white shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <Image src={normalizeImageUrl(selectedConv.otherUser.profilePictureUrl)} width={40} height={40} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{selectedConv.otherUser.fullName}</h4>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8"><MoreVertical size={16} /></Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc] custom-scrollbar">
        {messages.map((msg: ChatMessage, i: number) => {
          const isMe = String(msg.senderId) === String(currentUserId);
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`group relative max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                <div className={`py-1 px-2 rounded-xl text-sm shadow-sm leading-relaxed ${isMe ? 'bg-blue-400 text-primary-foreground rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                  {msg.message}
                  {msg.attachmentUrl ? (
                    <div className="mt-2 rounded-lg bg-slate-100 p-2 text-xs text-slate-700">
                      <a
                        href={`/api/User/preview-attachment?fileUrl=${encodeURIComponent(msg.attachmentUrl)}`}
                        download={msg.attachmentName || true}
                        className="font-medium text-slate-900 underline"
                      >
                        {msg.attachmentName || 'Download attachment'}
                      </a>
                    </div>
                  ) : null}
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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleAttachmentChange}
          />
          <Button variant="ghost" size="icon" className="text-slate-400 shrink-0" onClick={handleAttachClick}>
            <Paperclip size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            {selectedAttachment ? (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <div className="truncate">
                  <span className="font-medium">{selectedAttachment.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{Math.round(selectedAttachment.size / 1024)} KB</span>
                </div>
                <button type="button" onClick={removeAttachment} className="rounded-full p-1 text-slate-500 hover:bg-slate-100">
                  <X size={16} />
                </button>
              </div>
            ) : null}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  await handleSendClick();
                }
              }}
              placeholder="Write a message..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <Button
            onClick={handleSendClick}
            disabled={!inputText.trim() && !selectedAttachment}
            className="rounded-xl px-4 h-9 shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}