'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { StarterPrompts } from '@/components/chat/StarterPrompts';
import { LoginModal } from '@/components/chat/LoginModal';
import { AboutModal } from '@/components/chat/AboutModal';
import { UpgradeModal } from '@/components/chat/UpgradeModal';
import { PlanNotification } from '@/components/chat/PlanNotification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Menu, X, Zap, Shield, CheckCircle2, Info, Crown, MessageSquare, Image as ImageIcon, Rocket, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Page = 'home' | 'chat' | 'login' | 'register';

export default function Home() {
  const [page, setPage] = useState<Page>('home');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ base64: string; prompt: string } | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {
    chats,
    currentChatId,
    anonymousMessageCount,
    anonymousImageCount,
    isAuthenticated,
    user,
    createChat,
    addMessage,
    incrementAnonymousCount,
    incrementAnonymousImageCount,
    incrementUserMessageCount,
    incrementUserImageCount,
    setAuthenticated,
    setShowLoginModal,
    resetAnonymousCount,
    canSendMessage,
    canGenerateImage,
    canGenerateVideo,
    getRemainingMessages,
    getRemainingImages,
    getRemainingVideos,
    updateMessageVideoStatus,
    incrementUserVideoCount,
  } = useChatStore();

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const hasMessages = currentChat && currentChat.messages.length > 0;

  // Check payment status and plan updates on load and periodically
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkPlanStatus = () => {
      fetch(`/api/payment?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.pendingPayment) {
            useChatStore.getState().setPendingPayment(data.pendingPayment);
          }
          // Check if plan was updated by admin
          if (data.currentPlan && data.currentPlan !== user.plan) {
            // Show notification for upgrade
            useChatStore.getState().updateUserPlan(data.currentPlan);
            toast({
              title: `¡Bienvenido a ${data.currentPlan}!`,
              description: 'Tu plan ha sido actualizado exitosamente.',
            });
          }
        })
        .catch(console.error);
    };

    // Check immediately
    checkPlanStatus();

    // Poll every 30 seconds for plan updates
    const interval = setInterval(checkPlanStatus, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && anonymousMessageCount > 0) {
      resetAnonymousCount();
    }
  }, [isAuthenticated, anonymousMessageCount, resetAnonymousCount]);

  const sendMessage = useCallback(async (content: string, options?: { image?: string; searchQuery?: string; referenceImage?: string; videoMode?: boolean }) => {
    let chatId = currentChatId;

    if (!chatId) {
      chatId = createChat();
    }

    // Check if user can send message
    if (!canSendMessage()) {
      if (!isAuthenticated) {
        setShowLoginModal(true);
      } else {
        setShowUpgradeModal(true);
      }
      return;
    }

    // Add message with image if provided
    addMessage(chatId, { 
      role: 'user', 
      content: content || (options?.image ? '📷 Imagen compartida' : ''),
      image: options?.image,
    });
    
    // Increment appropriate counter
    if (!isAuthenticated) {
      incrementAnonymousCount();
    } else if (user && user.plan === 'BASIC') {
      incrementUserMessageCount();
    }

    if (page === 'home') {
      setPage('chat');
    }

    setIsTyping(true);
    setIsLoading(true);
    setCurrentImage(null);

    // If video mode is enabled, handle video generation differently
    if (options?.videoMode) {
      // Check if user can generate videos
      if (!canGenerateVideo()) {
        if (!isAuthenticated) {
          setShowLoginModal(true);
        } else {
          setShowUpgradeModal(true);
        }
        setIsTyping(false);
        setIsLoading(false);
        return;
      }

      // Add processing message with video status
      const videoMessageId = `msg_${Date.now()}_video`;
      addMessage(chatId!, {
        role: 'assistant',
        content: '🎬 **Video Generado**: ' + (content || 'Video animation'),
        videoStatus: 'processing',
        taskId: undefined,
      });

      setIsCreatingVideo(true);

      try {
        // Create video generation task
        const videoResponse = await fetch('/api/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: content,
            imageUrl: options?.image,
            duration: 5,
          }),
        });

        const videoData = await videoResponse.json();

        if (videoData.success && videoData.taskId) {
          // Poll for video status
          const pollVideo = async () => {
            const statusResponse = await fetch(`/api/video?taskId=${videoData.taskId}`);
            const statusData = await statusResponse.json();

            if (statusData.status === 'SUCCESS' && statusData.videoUrl) {
              // Update message with video URL
              const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
              const lastMessage = chat?.messages[chat.messages.length - 1];
              if (lastMessage) {
                updateMessageVideoStatus(chatId!, lastMessage.id, statusData.videoUrl, 'success');
              }
              // Increment video counter
              if (isAuthenticated && user) {
                incrementUserVideoCount();
              }
              setIsCreatingVideo(false);
              setIsTyping(false);
              setIsLoading(false);
              toast({
                title: 'Video generado!',
                description: 'Tu video está listo para ver.',
              });
            } else if (statusData.status === 'FAIL') {
              // Update message with error
              const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
              const lastMessage = chat?.messages[chat.messages.length - 1];
              if (lastMessage) {
                updateMessageVideoStatus(chatId!, lastMessage.id, '', 'error');
              }
              setIsCreatingVideo(false);
              setIsTyping(false);
              setIsLoading(false);
              toast({
                title: 'Error',
                description: 'No se pudo generar el video. Intenta de nuevo.',
                variant: 'destructive',
              });
            } else {
              // Continue polling
              setTimeout(pollVideo, 5000);
            }
          };

          // Start polling
          setTimeout(pollVideo, 5000);
        } else {
          throw new Error(videoData.error || 'Failed to create video task');
        }
      } catch (error) {
        console.error('Video error:', error);
        const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
        const lastMessage = chat?.messages[chat.messages.length - 1];
        if (lastMessage) {
          updateMessageVideoStatus(chatId!, lastMessage.id, '', 'error');
        }
        setIsCreatingVideo(false);
        setIsTyping(false);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'No se pudo generar el video. Intenta de nuevo.',
          variant: 'destructive',
        });
      }
      return;
    }

    try {
      const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
      const messages = chat?.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })) || [];

      messages.push({ role: 'user', content: content || 'Analiza esta imagen' });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages,
          image: options?.image,
          searchQuery: options?.searchQuery,
          referenceImage: options?.referenceImage,
        }),
      });

      const data = await response.json();

      if (data.response) {
        addMessage(chatId, { 
          role: 'assistant', 
          content: data.response,
          searchResults: data.searchResults,
        });
        
        if (data.isImageGeneration && data.imagePrompt) {
          // Check if user can generate images
          if (!canGenerateImage()) {
            if (!isAuthenticated) {
              setShowLoginModal(true);
            } else {
              setShowUpgradeModal(true);
            }
            setIsTyping(false);
            setIsLoading(false);
            return;
          }
          
          setIsCreatingImage(true);
          
          // Increment image counter
          if (isAuthenticated && user && user.plan === 'BASIC') {
            incrementUserImageCount();
          } else if (!isAuthenticated) {
            incrementAnonymousImageCount();
          }
          
          const imageResponse = await fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: data.imagePrompt }),
          });
          
          const imageData = await imageResponse.json();
          
          if (imageData.success && imageData.image) {
            setCurrentImage({
              base64: imageData.image,
              prompt: data.imagePrompt
            });
          }
          
          setIsCreatingImage(false);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [currentChatId, page, isAuthenticated, user, createChat, addMessage, incrementAnonymousCount, incrementAnonymousImageCount, incrementUserMessageCount, incrementUserImageCount, setShowLoginModal, canSendMessage, canGenerateImage, canGenerateVideo, updateMessageVideoStatus, incrementUserVideoCount]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (data.user) {
        setAuthenticated(data.user);
        setLoginForm({ email: '', password: '' });
        setPage('chat');
        toast({
          title: 'Welcome back!',
          description: 'You are now signed in.',
        });
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (data.user) {
        setAuthenticated(data.user);
        setRegisterForm({ email: '', password: '', name: '' });
        setPage('chat');
        toast({
          title: 'Welcome to ØΞ AI!',
          description: 'Your account has been created.',
        });
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (newPage: 'chat' | 'login' | 'register') => {
    setPage(newPage);
    setMobileSidebarOpen(false);
  };

  // Render remaining counts - use mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderRemainingInfo = () => {
    // Don't render dynamic content until mounted to prevent hydration mismatch
    if (!mounted) {
      return (
        <span className="text-xs text-muted-foreground bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/20 flex-shrink-0">
          Loading...
        </span>
      );
    }

    if (user?.plan === 'ULTRA') {
      return (
        <span className="text-xs bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-purple-400 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30 flex-shrink-0 flex items-center gap-1">
          <Rocket className="w-3 h-3" />
          ULTRA
        </span>
      );
    }
    
    if (user?.plan === 'PRO') {
      return (
        <span className="text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 backdrop-blur-sm px-3 py-1 rounded-full border border-cyan-500/30 flex-shrink-0 flex items-center gap-1">
          <Crown className="w-3 h-3" />
          PRO
        </span>
      );
    }
    
    const remainingMsg = getRemainingMessages();
    const remainingImg = getRemainingImages();
    const remainingVid = getRemainingVideos();

    // Ensure we have valid numbers
    const safeRemainingMsg = typeof remainingMsg === 'number' && !isNaN(remainingMsg) ? remainingMsg : 5;
    const safeRemainingImg = typeof remainingImg === 'number' && !isNaN(remainingImg) ? remainingImg : 2;
    const safeRemainingVid = typeof remainingVid === 'number' && !isNaN(remainingVid) ? remainingVid : 0;

    if (isAuthenticated) {
      return (
        <span className="text-xs text-muted-foreground bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/20 flex-shrink-0 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-purple-400" />
            {remainingMsg === Infinity ? '∞' : safeRemainingMsg}
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-cyan-400" />
            {remainingImg === Infinity ? '∞' : safeRemainingImg}
          </span>
          <span className="flex items-center gap-1">
            <Video className="w-3 h-3 text-pink-400" />
            {remainingVid === Infinity ? '∞' : safeRemainingVid}
          </span>
        </span>
      );
    }
    
    return (
      <span className="text-xs text-muted-foreground bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/20 flex-shrink-0">
        {safeRemainingMsg} free messages
      </span>
    );
  };

  // Auth pages
  if (page === 'login' || page === 'register') {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4 overflow-hidden electric-bg">
        <div className="w-full max-w-md relative z-10">
          <Button
            onClick={() => setPage('home')}
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-card/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ØΞ AI
                </h1>
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-muted-foreground">
                {page === 'login' ? 'Welcome back' : 'Create your account'}
              </p>
            </div>

            {page === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setPage('register')}
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                    className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setPage('login')}
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
            
            <div className="text-center mt-6 pt-4 border-t border-purple-500/10">
              <button
                type="button"
                onClick={() => setShowAboutModal(true)}
                className="text-xs text-muted-foreground hover:text-purple-400 transition-colors flex items-center gap-1 mx-auto"
              >
                <Info className="w-3 h-3" />
                Sobre ØΞ AI
              </button>
            </div>
          </div>
        </div>
        
        <AboutModal open={showAboutModal} onOpenChange={setShowAboutModal} />
      </div>
    );
  }

  // Home page
  if (page === 'home' && !hasMessages) {
    return (
      <div className="h-screen bg-background flex flex-col electric-bg overflow-hidden">
        <header className="border-b border-purple-500/10 bg-background/50 backdrop-blur-xl flex-shrink-0 relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ØΞ AI
              </h1>
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAboutModal(true)}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                title="Sobre ØΞ AI"
              >
                <Info className="w-5 h-5" />
              </button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {user?.plan === 'PRO' && (
                    <span className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PRO
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setPage('login')}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={() => setPage('register')}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent neon-text">
                ØΞ AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              AI assistant for creators
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                VERIFICADO® Y REGISTRADO EN ØΞ AI
              </span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-3">
              {renderRemainingInfo()}
              {isAuthenticated && user?.plan !== 'ULTRA' && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {user?.plan === 'BASIC' ? 'Upgrade' : 'Go ULTRA'}
                </Button>
              )}
            </div>
          </div>

          <div className="w-full max-w-2xl mb-8">
            <ChatInput
              onSend={sendMessage}
              disabled={isTyping}
              centered
            />
          </div>

          <StarterPrompts onSelect={sendMessage} />
          
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-muted-foreground/40">
              Hecho con <span className="text-pink-400">♥</span> por{' '}
              <span className="text-purple-400/60">OSKITAR</span>
              <span className="text-cyan-400/60"> & </span>
              <span className="text-cyan-400/60">EDU G.</span>
            </p>
          </div>
        </main>
        
        <AboutModal open={showAboutModal} onOpenChange={setShowAboutModal} />
        <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
        <PlanNotification />
      </div>
    );
  }

  // Chat page
  return (
    <div className="h-screen bg-background flex overflow-hidden electric-bg">
      <Button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-secondary/80 backdrop-blur-xl border border-purple-500/20"
        variant="ghost"
        size="icon"
      >
        {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <div className={`
        fixed md:relative h-full z-40 md:block flex-shrink-0
        ${mobileSidebarOpen ? 'block' : 'hidden'}
      `}>
        <Sidebar onNavigate={handleNavigate} onShowAbout={() => setShowAboutModal(true)} />
      </div>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="border-b border-purple-500/10 bg-background/80 backdrop-blur-xl px-4 py-3 flex-shrink-0 relative z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3 md:ml-0 ml-10">
              <h1 className="text-lg font-semibold truncate max-w-[150px] md:max-w-none text-foreground">
                {currentChat?.title || 'New Chat'}
              </h1>
              {renderRemainingInfo()}
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              {isAuthenticated && user?.plan !== 'ULTRA' && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  size="sm"
                  className="hidden sm:flex bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {user?.plan === 'BASIC' ? 'Upgrade' : 'Go ULTRA'}
                </Button>
              )}
              
              <div className="hidden md:flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                  VERIFICADO® EN ØΞ AI
                </span>
              </div>
              
              <button
                onClick={() => setShowAboutModal(true)}
                className="hidden md:flex p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                title="Sobre ØΞ AI"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <ChatWindow 
          isTyping={isTyping} 
          isCreatingImage={isCreatingImage}
          currentImage={currentImage}
          onSendMessage={sendMessage}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-20 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <ChatInput
              onSend={sendMessage}
              disabled={isTyping}
            />
          </div>
        </div>
      </div>

      <LoginModal onNavigate={handleNavigate} />
      <AboutModal open={showAboutModal} onOpenChange={setShowAboutModal} />
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <PlanNotification />
    </div>
  );
}
