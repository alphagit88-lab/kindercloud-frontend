import api from '@/lib/api/api';

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: UserSummary;
  receiver: UserSummary;
}

export const messagesAPI = {
  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    const response = await api.post<Message>('/api/messages', { receiverId, content });
    return response.data;
  },

  getConversation: async (otherUserId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/api/messages/${otherUserId}`);
    return response.data;
  },

  getConversations: async (): Promise<UserSummary[]> => {
    const response = await api.get<UserSummary[]>('/api/messages/list');
    return response.data;
  },

  getRecipients: async (role?: string): Promise<UserSummary[]> => {
    const response = await api.get<UserSummary[]>('/api/messages/recipients', {
      params: { role }
    });
    return response.data;
  }
};
