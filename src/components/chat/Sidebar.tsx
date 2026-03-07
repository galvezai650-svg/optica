'use client';

import { useChatStore } from '@/stores/chat-store';
import { Plus, MessageSquare, Trash2, User, LogOut, Zap, Shield, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNavigate?: (page: 'chat' | 'login' | 'register') => void;
  onShowAbout?: () => void;
}

export function Sidebar({ onNavigate, onShowAbout }: SidebarProps) {
  const { chats, currentChatId, createChat, setCurrentChat, deleteChat, user, isAuthenticated, setAuthenticated, clearAllData } = useChatStore();

  const handleNewChat = () => {
    createChat();
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const handleLogout = () => {
    setAuthenticated(null);
  };

  const handleClearData = () => {
    if (confirm('¿Estás seguro? Esto borrará todos los chats y datos guardados.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="w-64 h-full bg-sidebar/95 backdrop-blur-xl border-r border-purple-500/10 flex flex-col overflow-hidden relative">
      {/* Electric glow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      {/* Logo */}
      <div className="p-4 border-b border-purple-500/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ØΞ AI
            </h1>
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <button
            onClick={onShowAbout}
            className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
            title="Sobre ØΞ AI"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 flex-shrink-0">
        <Button
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/30 hover:to-cyan-600/30 text-foreground border border-purple-500/30 justify-start gap-2 transition-all duration-300"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List - Independent scroll */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat.id)}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
                currentChatId === chat.id
                  ? "bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-foreground border border-purple-500/30 shadow-lg shadow-purple-500/10"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm flex-1">{chat.title}</span>
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="p-3 border-t border-purple-500/10 flex-shrink-0">
        {isAuthenticated && user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg">
              <User className="w-4 h-4" />
              <span className="truncate flex-1">{user.email}</span>
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={() => onNavigate?.('login')}
              className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/30 hover:to-cyan-600/30 text-foreground border border-purple-500/30"
            >
              <User className="w-4 h-4" />
              Sign in
            </Button>
            
            {/* Verified Badge with ® */}
            <div className="flex items-center justify-center gap-1.5 text-xs py-2">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                VERIFICADO® EN ØΞ AI
              </span>
            </div>
          </div>
        )}
        
        {/* Clear Data Button */}
        <button
          onClick={handleClearData}
          className="w-full mb-2 py-1.5 text-xs text-muted-foreground/40 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
          title="Limpiar todos los datos"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Limpiar datos</span>
        </button>
        
        {/* About Button */}
        <button
          onClick={onShowAbout}
          className="w-full py-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center justify-center gap-1"
        >
          <span>Hecho con</span>
          <span className="text-pink-400">♥</span>
          <span>por Oscar David & Eduardo</span>
        </button>
      </div>
    </div>
  );
}
