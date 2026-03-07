'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { MessageBubble } from './MessageBubble';
import { StarterPrompts } from './StarterPrompts';
import { LoadingAnimation } from './LoadingAnimation';
import { ImageDisplay } from './ImageDisplay';

interface ChatWindowProps {
  isTyping: boolean;
  isCreatingImage?: boolean;
  currentImage?: { base64: string; prompt: string } | null;
  onSendMessage?: (message: string) => void;
}

export function ChatWindow({ isTyping, isCreatingImage = false, currentImage, onSendMessage }: ChatWindowProps) {
  const { chats, currentChatId } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentChat?.messages, isTyping, currentImage]);

  // Show starter prompts if no messages
  if (!currentChat || currentChat.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ØΞ AI
            </span>
          </h2>
          <p className="text-muted-foreground">How can I help you create today?</p>
        </div>
        <div className="w-full max-w-2xl">
          <StarterPrompts onSelect={onSendMessage || (() => {})} />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto pb-36"
      style={{
        scrollBehavior: 'smooth'
      }}
    >
      <div className="max-w-3xl mx-auto py-4 px-4">
        {currentChat.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isTyping={isTyping && index === currentChat.messages.length - 1 && message.role === 'assistant'}
          />
        ))}
        
        {/* Show image if being generated */}
        {currentImage && (
          <ImageDisplay 
            imageBase64={currentImage.base64} 
            prompt={currentImage.prompt} 
          />
        )}
        
        {/* Loading animation */}
        {isTyping && currentChat.messages[currentChat.messages.length - 1]?.role === 'user' && !currentImage && (
          <LoadingAnimation type={isCreatingImage ? 'creating-image' : 'thinking'} />
        )}
      </div>
    </div>
  );
}
