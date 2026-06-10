export interface ChatUser {
  id: string | number;
  fullName?: string;
  profilePictureUrl?: string | null;
}

export interface Conversation {
  otherUser: ChatUser;
  lastMessage?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string | number;
  receiverId?: string | number;
  message: string;
  sentAt: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  isLocal?: boolean;
}

export interface UploadAttachmentResponse {
  attachmentUrl?: string;
  fileUrl?: string;
  url?: string;
  path?: string;
  message?: string;
  file?: {
    url?: string;
    name?: string;
  };
  attachmentName?: string;
  fileName?: string;
  name?: string;
}
