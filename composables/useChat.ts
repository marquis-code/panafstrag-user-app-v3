import { io, Socket } from 'socket.io-client';
import { useUser } from './modules/auth/user';

const socket = ref<Socket | null>(null);
const messages = ref<any[]>([]);
const isConnected = ref(false);
const isTyping = ref<{ name: string; isGuest: boolean } | null>(null);
const conversationId = ref<string | null>(null);

export const useChat = () => {
  const config = useRuntimeConfig();
  const { user } = useUser();

  const getOrInitConversationId = () => {
    if (conversationId.value) return conversationId.value;
    let id = localStorage.getItem('chat_conversation_id');
    if (!id) {
      id = `conv_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem('chat_conversation_id', id);
    }
    conversationId.value = id;
    return id;
  };

  const connect = (guestInfo?: { name: string, email: string }) => {
    const handleJoinAndFetch = () => {
      if (!socket.value) return;
      const convId = getOrInitConversationId();
      
      console.log(`[Chat] UserApp: WhatsApp Overhaul: Joining room [${convId}]`);
      socket.value.emit('joinRoom', { roomId: convId });

      console.log('[Chat] UserApp: Fetching messages for session:', convId);
      socket.value.emit('findAllMessages', { conversationId: convId }, (data: any[]) => {
        console.log(`[Chat] UserApp: Received ${data.length} messages from history`);
        messages.value = data;
      });
    };

    if (socket.value) {
      if (socket.value.connected) {
        handleJoinAndFetch();
      }
      return;
    }

    socket.value = io(config.public.apiBase, {
      transports: ['websocket'],
    });

    socket.value.on('connect', () => {
      console.log('[Chat] UserApp: 🟢 Socket connected successfully! ID:', socket.value?.id);
      isConnected.value = true;
      handleJoinAndFetch();
    });

    socket.value.on('connect_error', (error) => {
      console.error('[Chat] UserApp: 🔴 Socket connection error:', error);
    });

    socket.value.on('disconnect', (reason) => {
      console.log(`[Chat] UserApp: 🟠 Socket disconnected. Reason: ${reason}`);
      isConnected.value = false;
    });

    socket.value.on('newMessage', (message: any) => {
      console.log('[Chat] UserApp: 📥 Received newMessage:', message._id, 'isAdmin:', message.isAdmin);
      // Deduplicate
      const exists = messages.value.some((m: any) => m._id === message._id);
      if (!exists) {
        messages.value.push(message);
      }
    });

    socket.value.on('userTyping', (data: { name: string; isGuest: boolean }) => {
      console.log('[Chat] UserApp: userTyping:', data.name);
      isTyping.value = data;
    });

    socket.value.on('userStoppedTyping', () => {
      console.log('[Chat] UserApp: userStoppedTyping');
      isTyping.value = null;
    });
  };

  // Added setTyping function
  const setTyping = (isCurrentlyTyping: boolean, name: string, isGuest: boolean, roomId?: string) => {
    if (!socket.value) return;
    const event = isCurrentlyTyping ? 'typing' : 'stopTyping';
    socket.value.emit(event, { name, isGuest, roomId });
  };

  const sendMessage = (content: string, type: 'text' | 'image' = 'text', imageUrl?: string, guestInfo?: { name: string, email: string }) => {
    if (!socket.value) {
      console.error('[Chat] UserApp: Cannot sendMessage, socket not connected');
      return;
    }
    
    const payload = {
      sender: (user.value as any)?._id,
      guestName: guestInfo?.name,
      guestEmail: guestInfo?.email,
      conversationId: getOrInitConversationId(),
      content,
      type,
      imageUrl,
    };
    
    console.log('[Chat] UserApp: Emitting sendMessage (WhatsApp Style):', payload);
    socket.value.emit('sendMessage', payload);
  };

  // The original disconnect function is replaced by the new return block's definition
  // const disconnect = () => {
  //   if (socket.value) {
  //     socket.value.disconnect();
  //     socket.value = null;
  //   }
  // };

  return {
    socket, // Added socket to return
    messages,
    isConnected,
    isTyping, // Added isTyping to return
    setTyping, // Added setTyping to return
    sendMessage,
    connect,
  };
};
