import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Plan = 'BASIC' | 'PRO' | 'ULTRA';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string; // Base64 image data
  searchResults?: SearchResult[];
  videoUrl?: string; // Generated video URL
  videoStatus?: 'processing' | 'success' | 'error'; // Video generation status
  taskId?: string; // Video generation task ID
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInfo {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number;
  plan: Plan;
  createdAt: string;
}

// Plan limits
const PLAN_LIMITS = {
  BASIC: {
    messagesPerDay: 5,
    imagesPerDay: 2,
    videosPerDay: 0,
    model: 'basic',
    priority: false,
    chatHistory: false,
  },
  PRO: {
    messagesPerDay: Infinity,
    imagesPerDay: 10,
    videosPerDay: 3,
    model: 'advanced',
    priority: false,
    chatHistory: true,
  },
  ULTRA: {
    messagesPerDay: Infinity,
    imagesPerDay: Infinity,
    videosPerDay: Infinity,
    model: 'ultra',
    priority: true,
    chatHistory: true,
  },
} as const;

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  anonymousMessageCount: number;
  anonymousImageCount: number;
  anonymousVideoCount: number;
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string | null; plan: Plan; messageCount: number; imageCount: number; videoCount: number } | null;
  showLoginModal: boolean;
  showUpgradeModal: boolean;
  pendingPayment: PaymentInfo | null;
  planUpgradeNotification: Plan | null;

  // Actions
  createChat: () => string;
  setCurrentChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessageVideoStatus: (chatId: string, messageId: string, videoUrl: string, status: 'success' | 'error') => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  incrementAnonymousCount: () => void;
  incrementAnonymousImageCount: () => void;
  incrementAnonymousVideoCount: () => void;
  incrementUserMessageCount: () => void;
  incrementUserImageCount: () => void;
  incrementUserVideoCount: () => void;
  setAuthenticated: (user: { id: string; email: string; name: string | null; plan: Plan; messageCount: number; imageCount: number; videoCount: number } | null) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  setPendingPayment: (payment: PaymentInfo | null) => void;
  resetAnonymousCount: () => void;
  updateUserPlan: (plan: Plan) => void;
  setPlanUpgradeNotification: (plan: Plan | null) => void;
  clearPlanUpgradeNotification: () => void;
  canSendMessage: () => boolean;
  canGenerateImage: () => boolean;
  canGenerateVideo: () => boolean;
  getRemainingMessages: () => number;
  getRemainingImages: () => number;
  getRemainingVideos: () => number;
  getPlanLimits: () => typeof PLAN_LIMITS[Plan];
  clearAllData: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      anonymousMessageCount: 0,
      anonymousImageCount: 0,
      anonymousVideoCount: 0,
      isAuthenticated: false,
      user: null,
      showLoginModal: false,
      showUpgradeModal: false,
      pendingPayment: null,
      planUpgradeNotification: null,

      createChat: () => {
        const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newChat: Chat = {
          id: chatId,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: chatId,
        }));
        return chatId;
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId });
      },

      addMessage: (chatId, message) => {
        const newMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...message,
          timestamp: new Date(),
        };
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: new Date(),
                  title: chat.messages.length === 0 && message.role === 'user' 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : chat.title,
                }
              : chat
          ),
        }));
      },

      updateMessageVideoStatus: (chatId, messageId, videoUrl, status) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, videoUrl, videoStatus: status }
                      : msg
                  ),
                }
              : chat
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId);
          const newCurrentChatId = state.currentChatId === chatId
            ? newChats.length > 0 ? newChats[0].id : null
            : state.currentChatId;
          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
          };
        });
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        }));
      },

      incrementAnonymousCount: () => {
        set((state) => ({
          anonymousMessageCount: state.anonymousMessageCount + 1,
        }));
      },

      incrementAnonymousImageCount: () => {
        set((state) => ({
          anonymousImageCount: state.anonymousImageCount + 1,
        }));
      },

      incrementAnonymousVideoCount: () => {
        set((state) => ({
          anonymousVideoCount: state.anonymousVideoCount + 1,
        }));
      },

      incrementUserMessageCount: () => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            messageCount: state.user.messageCount + 1,
          } : null,
        }));
      },

      incrementUserImageCount: () => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            imageCount: state.user.imageCount + 1,
          } : null,
        }));
      },

      incrementUserVideoCount: () => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            videoCount: state.user.videoCount + 1,
          } : null,
        }));
      },

      setAuthenticated: (user) => {
        set({
          isAuthenticated: !!user,
          user,
          showLoginModal: false,
        });
      },

      setShowLoginModal: (show) => {
        set({ showLoginModal: show });
      },

      setShowUpgradeModal: (show) => {
        set({ showUpgradeModal: show });
      },

      setPendingPayment: (payment) => {
        set({ pendingPayment: payment });
      },

      resetAnonymousCount: () => {
        set({ anonymousMessageCount: 0, anonymousImageCount: 0, anonymousVideoCount: 0 });
      },

      updateUserPlan: (plan) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            plan,
            messageCount: 0,
            imageCount: 0,
            videoCount: 0,
          } : null,
          planUpgradeNotification: plan,
        }));
      },

      setPlanUpgradeNotification: (plan) => {
        set({ planUpgradeNotification: plan });
      },

      clearPlanUpgradeNotification: () => {
        set({ planUpgradeNotification: null });
      },

      canSendMessage: () => {
        const state = get();
        
        // PRO and ULTRA users have unlimited messages
        if (state.user?.plan === 'PRO' || state.user?.plan === 'ULTRA') return true;
        
        // Registered BASIC users
        if (state.isAuthenticated && state.user) {
          return state.user.messageCount < PLAN_LIMITS.BASIC.messagesPerDay;
        }
        
        // Anonymous users
        return state.anonymousMessageCount < PLAN_LIMITS.BASIC.messagesPerDay;
      },

      canGenerateImage: () => {
        const state = get();
        
        // ULTRA users have unlimited images
        if (state.user?.plan === 'ULTRA') return true;
        
        // PRO users have 10 images per day
        if (state.user?.plan === 'PRO') {
          return state.user.imageCount < PLAN_LIMITS.PRO.imagesPerDay;
        }
        
        // BASIC users have 2 images per day
        if (state.isAuthenticated && state.user) {
          return state.user.imageCount < PLAN_LIMITS.BASIC.imagesPerDay;
        }
        
        // Anonymous users cannot generate images
        return false;
      },

      canGenerateVideo: () => {
        const state = get();
        
        // ULTRA users have unlimited videos
        if (state.user?.plan === 'ULTRA') return true;
        
        // PRO users have 3 videos per day
        if (state.user?.plan === 'PRO') {
          return state.user.videoCount < PLAN_LIMITS.PRO.videosPerDay;
        }
        
        // BASIC users cannot generate videos
        return false;
      },

      getRemainingMessages: () => {
        const state = get();
        
        if (state.user?.plan === 'PRO' || state.user?.plan === 'ULTRA') return Infinity;
        
        if (state.isAuthenticated && state.user) {
          return Math.max(0, PLAN_LIMITS.BASIC.messagesPerDay - state.user.messageCount);
        }
        
        return Math.max(0, PLAN_LIMITS.BASIC.messagesPerDay - state.anonymousMessageCount);
      },

      getRemainingImages: () => {
        const state = get();
        
        if (state.user?.plan === 'ULTRA') return Infinity;
        
        if (state.user?.plan === 'PRO') {
          return Math.max(0, PLAN_LIMITS.PRO.imagesPerDay - state.user.imageCount);
        }
        
        if (state.isAuthenticated && state.user) {
          return Math.max(0, PLAN_LIMITS.BASIC.imagesPerDay - state.user.imageCount);
        }
        
        return 0;
      },

      getRemainingVideos: () => {
        const state = get();
        
        if (state.user?.plan === 'ULTRA') return Infinity;
        
        if (state.user?.plan === 'PRO') {
          return Math.max(0, PLAN_LIMITS.PRO.videosPerDay - state.user.videoCount);
        }
        
        return 0;
      },

      getPlanLimits: () => {
        const state = get();
        const plan = state.user?.plan || 'BASIC';
        return PLAN_LIMITS[plan];
      },
      
      // Clear all stored data and reset to initial state
      clearAllData: () => {
        set({
          chats: [],
          currentChatId: null,
          anonymousMessageCount: 0,
          anonymousImageCount: 0,
          anonymousVideoCount: 0,
          isAuthenticated: false,
          user: null,
          showLoginModal: false,
          showUpgradeModal: false,
          pendingPayment: null,
          planUpgradeNotification: null,
        });
        // Also clear from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('oe-ai-chat-storage');
        }
      },
    }),
    {
      name: 'oe-ai-chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        anonymousMessageCount: state.anonymousMessageCount,
        anonymousImageCount: state.anonymousImageCount,
        anonymousVideoCount: state.anonymousVideoCount,
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          ...state.user,
          // Ensure counts are always valid numbers
          messageCount: typeof state.user.messageCount === 'number' && !isNaN(state.user.messageCount) 
            ? state.user.messageCount : 0,
          imageCount: typeof state.user.imageCount === 'number' && !isNaN(state.user.imageCount) 
            ? state.user.imageCount : 0,
          videoCount: typeof state.user.videoCount === 'number' && !isNaN(state.user.videoCount) 
            ? state.user.videoCount : 0,
        } : null,
        pendingPayment: state.pendingPayment,
        planUpgradeNotification: state.planUpgradeNotification,
      }),
      // Add migration for old data
      merge: (persistedState: any, currentState: any) => {
        // If persisted user exists, ensure counts are valid
        if (persistedState?.user) {
          const user = persistedState.user;
          user.messageCount = typeof user.messageCount === 'number' && !isNaN(user.messageCount) 
            ? user.messageCount : 0;
          user.imageCount = typeof user.imageCount === 'number' && !isNaN(user.imageCount) 
            ? user.imageCount : 0;
          user.videoCount = typeof user.videoCount === 'number' && !isNaN(user.videoCount) 
            ? user.videoCount : 0;
        }
        // Ensure anonymousVideoCount exists
        if (typeof persistedState?.anonymousVideoCount !== 'number') {
          persistedState.anonymousVideoCount = 0;
        }
        return { ...currentState, ...persistedState };
      },
    }
  )
);

export { PLAN_LIMITS };
