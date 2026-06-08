'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { normalizeImageUrl } from '@/lib/imageUrl';

interface ChatUser {
  id: string;
  fullName?: string;
  profilePictureUrl?: string | null;
}

interface Conversation {
  otherUser: ChatUser;
  lastMessage?: string;
}

interface ChatsideProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  isOnline: boolean;
}

export default function Chatside({ conversations, selectedId, onSelect, isOnline }: ChatsideProps) {
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
          conversations.map((c) => (
            <div 
              key={c.otherUser.id}
              onClick={() => onSelect(c)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50",
                selectedId === c.otherUser.id && "bg-indigo-50 "
              )}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-indigo-600 flex items-center justify-center text-white font-bold">
                {c.otherUser.profilePictureUrl ? (
                  <Image
                    src={normalizeImageUrl(c.otherUser.profilePictureUrl)}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    alt={c.otherUser.fullName || 'Profile picture'}
                  />
                ) : (
                  <span>{c.otherUser.fullName?.charAt(0).toUpperCase()}</span>
                )}
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