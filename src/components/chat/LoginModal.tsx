'use client';

import { useChatStore } from '@/stores/chat-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function LoginModal({ onNavigate }: LoginModalProps) {
  const { showLoginModal, setShowLoginModal } = useChatStore();

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/20">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Sign in to continue chatting with ØΞ AI
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You&apos;ve reached your free message limit. Create an account to continue using ØΞ AI.
          </DialogDescription>
          
          {/* Verified Badge with ® */}
          <div className="flex items-center justify-center gap-2 py-3 mt-2 border-t border-purple-500/10">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">
              VERIFICADO® Y REGISTRADO EN ØΞ AI
            </span>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            onClick={() => {
              setShowLoginModal(false);
              onNavigate('login');
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button
            onClick={() => {
              setShowLoginModal(false);
              onNavigate('register');
            }}
            variant="outline"
            className="w-full border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50"
          >
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
