'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Sparkles, Zap, Image as ImageIcon, X, Search, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, options?: { image?: string; searchQuery?: string; referenceImage?: string; videoMode?: boolean }) => void;
  disabled?: boolean;
  placeholder?: string;
  centered?: boolean;
}

export function ChatInput({ onSend, disabled, placeholder = "Ask ØΞ AI anything...", centered = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if ((message.trim() || uploadedImage) && !disabled) {
      onSend(message.trim(), {
        image: uploadedImage || undefined,
        searchQuery: webSearchEnabled ? message.trim() : undefined,
        referenceImage: uploadedImage || undefined,
        videoMode: videoMode || undefined,
      });
      setMessage('');
      setUploadedImage(null);
      setWebSearchEnabled(false);
      setVideoMode(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Image too large. Maximum size is 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedImage(base64);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className={cn(
      "relative w-full",
      centered ? "max-w-2xl" : "max-w-3xl mx-auto"
    )}>
      {/* Electric glow behind */}
      <div className={cn(
        "absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-purple-600/20 blur-xl",
        (message.trim() || uploadedImage) ? "opacity-100" : "opacity-50"
      )} />
      
      <div className={cn(
        "relative flex flex-col rounded-3xl border transition-all duration-300",
        "bg-secondary/90 backdrop-blur-xl",
        "focus-within:border-purple-500/50",
        (message.trim() || uploadedImage)
          ? "border-purple-500/30 shadow-lg shadow-purple-500/10" 
          : "border-purple-500/20",
        centered && "shadow-xl shadow-purple-500/10"
      )}>
        {/* Image preview */}
        {uploadedImage && (
          <div className="relative p-3 pb-0">
            <div className="relative inline-block">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="max-h-32 rounded-xl border border-purple-500/20"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Input row */}
        <div className="flex items-end gap-2 p-2">
          {/* Left side - Image upload & Search buttons */}
          <div className="flex items-center gap-1 pl-2">
            {/* Image upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              title="Subir imagen"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            
            {/* Web search toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={cn(
                "h-9 w-9 rounded-xl transition-colors",
                webSearchEnabled
                  ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              title={webSearchEnabled ? "Web search activado" : "Activar web search"}
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>

            {/* Video mode toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setVideoMode(!videoMode)}
              className={cn(
                "h-9 w-9 rounded-xl transition-colors",
                videoMode
                  ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              title={videoMode ? "Modo video activado" : "Activar generación de video"}
            >
              <Video className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Sparkles icon */}
          <div className="text-muted-foreground pointer-events-none pb-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          
          {/* Input textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={videoMode ? "Describe el video que quieres generar..." : uploadedImage ? "Describe lo que quieres hacer con esta imagen..." : placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent py-3 pr-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none",
              "min-h-[44px] max-h-[150px]"
            )}
          />
          
          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && !uploadedImage) || disabled}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-300 flex-shrink-0",
              (message.trim() || uploadedImage)
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/30"
                : "bg-secondary/50 text-muted-foreground/30"
            )}
          >
            {message.trim() || uploadedImage ? (
              <Send className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Web search indicator */}
        {webSearchEnabled && (
          <div className="px-4 pb-2">
            <span className="text-xs text-cyan-400 flex items-center gap-1">
              <Search className="w-3 h-3" />
              Web search activado - buscará tendencias actuales
            </span>
          </div>
        )}

        {/* Video mode indicator */}
        {videoMode && (
          <div className="px-4 pb-2">
            <span className="text-xs text-pink-400 flex items-center gap-1">
              <Video className="w-3 h-3" />
              Modo video - generarás un video con tu descripción
            </span>
          </div>
        )}
      </div>
      
      {/* Help text */}
      <p className="text-xs text-muted-foreground/40 text-center mt-2">
        Press <span className="text-purple-400/60">Enter</span> to send • <span className="text-cyan-400/60">Shift+Enter</span> for new line
        {uploadedImage && <> • <span className="text-pink-400/60">Imagen lista para analizar</span></>}
        {videoMode && !uploadedImage && <> • <span className="text-pink-400/60">Describe el video a generar</span></>}
      </p>
    </div>
  );
}
