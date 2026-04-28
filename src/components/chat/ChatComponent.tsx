'use client';

import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachment?: string;
  seen: boolean;
}

interface ChatComponentProps {
  userId: string;
  hubUrl: string;
}

export default function ChatComponent({ userId, hubUrl }: ChatComponentProps) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.on('ReceiveMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newConnection.on('MessageSeen', (messageId: string) => {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, seen: true } : msg
      ));
    });

    newConnection.start()
      .then(() => {
        setIsConnected(true);
        console.log('Connected to chat hub');
      })
      .catch(err => console.error('Connection failed: ', err));

    return () => {
      newConnection.stop();
    };
  }, [hubUrl]);

  const sendMessage = async () => {
    if (connection && messageInput.trim()) {
      try {
        await connection.invoke('SendMessage', userId, messageInput, attachment?.name);
        setMessageInput('');
        setAttachment(null);
      } catch (err) {
        console.error('Send message failed: ', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat</h2>

      <div className="mb-4">
        <span className={`font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        disabled={!isConnected}
      >
        Send Message
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="p-3 border-b border-gray-200 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600">{msg.senderId}</div>
                <div className="text-gray-800">{msg.content}</div>
                {msg.attachment && (
                  <a href={msg.attachment} className="text-orange-600 text-sm underline ml-2">
                    Attachment
                  </a>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleString()} {msg.seen && '✓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}