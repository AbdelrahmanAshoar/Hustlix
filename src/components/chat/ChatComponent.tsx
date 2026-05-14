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