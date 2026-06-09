'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
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

export default function ChatComponent({ currentUser }: any) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connection, setConnection] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [initialUserId, setInitialUserId] = useState<string | number | null>(null);
  const pendingRef = useRef<{ key: string; localId: string }[]>([]);
  const [inputText, setInputText] = useState('');

  // Refs for stable access inside SignalR handlers (avoid stale closures)
  const currentUserIdRef = useRef<string | null>(null);
  const selectedConvRef = useRef<any>(null);

  // Keep refs in sync with state
  useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);
  useEffect(() => { selectedConvRef.current = selectedConv; }, [selectedConv]);


  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      setAuthToken(token);
      const tokenUserId = getUserIdFromToken(token);
      setCurrentUserId(tokenUserId);
    }

    // Fallback: use currentUser prop if available
    if (currentUser?.id) {
      setCurrentUserId(String(currentUser.id));
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('userId');
      if (userId) {
        const parsedId = !isNaN(Number(userId)) ? Number(userId) : userId;
        setInitialUserId(parsedId);
      }
    }
  }, [currentUser]);

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

  // Stable loadConvs function that does NOT depend on selectedConv
  // This prevents the infinite re-render loop
  const loadConvs = useCallback(async () => {
    const data = await apiCall('GET', '/api/User/my-conversations');
    if (data) {
      setConversations((prevConversations: any) => {
        const currentSelectedConv = selectedConvRef.current;
        let finalData = data;
        if (currentSelectedConv?.otherUser?.id) {
          const exists = data.some((conv: any) => String(conv.otherUser.id) === String(currentSelectedConv.otherUser.id));
          if (!exists) {
            finalData = [currentSelectedConv, ...data];
          }
        }
        return finalData;
      });
    }
    return data;
  }, [apiCall]); // Only depends on apiCall (which depends on authToken)

  const normalizeServerMessage = (msg: any) => {
    if (!msg) return msg;
    const attachmentUrl = msg.attachmentUrl || msg.fileUrl || msg.url || msg.path || msg.attachment || (msg.file && msg.file.url) || null;
    const attachmentName = msg.attachmentName || msg.fileName || msg.name || (msg.file && msg.file.name) || null;
    return { ...msg, attachmentUrl, attachmentName };
  };

  // SignalR connection setup - only depends on authToken and loadConvs
  // No longer depends on currentUserId (uses ref instead) or selectedConv
  useEffect(() => {
    if (!authToken) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/chatHub?access_token=${encodeURIComponent(authToken)}`, {
        transport: signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    const appendMessageOnce = (msg: any) => {
      const normalized = normalizeServerMessage(msg);

      // Try to match pending optimistic messages by sender_receiver_message
      const key = `${normalized.senderId}_${normalized.receiverId}_${normalized.message}`;
      const pendingIndex = pendingRef.current.findIndex((p) => p.key === key);
      if (pendingIndex >= 0) {
        const { localId } = pendingRef.current[pendingIndex];
        pendingRef.current.splice(pendingIndex, 1);
        setMessages((msgs: any) => msgs.map((m: any) => m.id === localId ? { ...normalized, isLocal: false } : m));
        return;
      }

      setMessages((msgs: any) => {
        const alreadyExists = msgs.some((existing: any) =>
          existing.senderId === normalized.senderId &&
          existing.receiverId === normalized.receiverId &&
          existing.message === normalized.message
        );
        return alreadyExists ? msgs : [...msgs, normalized];
      });
    };

    newConnection.on("ReceiveMessage", (msg) => {
      // Use ref for latest selectedConv and currentUserId (no stale closure)
      const currentConv = selectedConvRef.current;
      const userId = currentUserIdRef.current;
      if (
        currentConv &&
        String(currentConv.otherUser.id) === String(msg.senderId) &&
        String(msg.senderId) !== String(userId)
      ) {
        appendMessageOnce(msg);
      }
      loadConvs();
    });

    newConnection.on("MessageSent", (msg) => {
      // Use ref for latest selectedConv and currentUserId (no stale closure)
      const currentConv = selectedConvRef.current;
      const userId = currentUserIdRef.current;
      if (
        currentConv &&
        String(currentConv.otherUser.id) === String(msg.receiverId) &&
        String(msg.senderId) === String(userId)
      ) {
        appendMessageOnce(msg);
      }
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

  const handleOpenConv = useCallback(async (conv: any) => {
    setSelectedConv(conv);
    const data = await apiCall('GET', `/api/User/conversation-with/${conv.otherUser.id}`);
    if (data) setMessages(data);
  }, [apiCall]);

  useEffect(() => {
    if (!initialUserId || !authToken) return;
    if (selectedConv?.otherUser?.id === initialUserId) return;

    const matchedConv = conversations.find((conv: any) => String(conv.otherUser.id) === String(initialUserId));
    if (matchedConv) {
      void handleOpenConv(matchedConv);
      return;
    }

    const openDirectConv = async () => {
      // Open a silent placeholder (no name shown) while we fetch real data
      const placeholderConv = {
        otherUser: {
          id: initialUserId,
          fullName: '',
          profilePictureUrl: null,
        },
      };
      setSelectedConv(placeholderConv);
      setConversations((prev: any) => {
        const exists = prev.some((conv: any) => String(conv.otherUser.id) === String(initialUserId));
        return exists ? prev : [placeholderConv, ...prev];
      });
      const data = await apiCall('GET', `/api/User/conversation-with/${initialUserId}`);
      if (data) setMessages(data);
    };

    void openDirectConv();
  }, [initialUserId, authToken, conversations, selectedConv?.otherUser?.id, handleOpenConv, apiCall]);

  const handleSend = async (attachment?: File | null) => {
    if (!connection || !selectedConv) return false;

    let attachmentUrl: string | null = null;
    if (attachment) {
      try {
        const formData = new FormData();
        formData.append('file', attachment);

        const uploadRes = await fetch('/api/User/upload-attachment', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          return false;
        }

        const uploadData = await uploadRes.json();
        attachmentUrl =
          typeof uploadData === 'string'
            ? uploadData
            : uploadData.attachmentUrl || uploadData.fileUrl || uploadData.url || uploadData.path || uploadData.message || null;
      } catch (err) {
        return false;
      }
    }

    if (!inputText.trim() && !attachmentUrl) return false;
    // create optimistic local message so attachment shows immediately
    const optimisticMessage = {
      id: `local-${Date.now()}`,
      senderId: currentUserId,
      receiverId: selectedConv.otherUser.id,
      message: inputText.trim() || (attachment ? attachment.name : ''),
      sentAt: new Date().toISOString(),
      attachmentUrl,
      attachmentName: attachment ? attachment.name : undefined,
      isLocal: true,
    };
    const key = `${optimisticMessage.senderId}_${optimisticMessage.receiverId}_${optimisticMessage.message}`;
    pendingRef.current.push({ key, localId: optimisticMessage.id });
    setMessages((m: any) => [...m, optimisticMessage]);

    try {
      const receiverId = !isNaN(Number(selectedConv.otherUser.id))
        ? Number(selectedConv.otherUser.id)
        : selectedConv.otherUser.id;

      await connection.invoke(
        'SendMessage',
        receiverId,
        inputText.trim() || attachment?.name || '',
        attachmentUrl
      );
      setInputText('');
      return true;
    } catch (e) {
      pendingRef.current = pendingRef.current.filter((p) => p.localId !== optimisticMessage.id);
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-120px)] min-h-[500px] shadow-2xl rounded-3xl overflow-hidden border border-slate-200 bg-white">
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