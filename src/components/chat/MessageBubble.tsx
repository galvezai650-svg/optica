'use client';

import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check, ExternalLink, Search, Video, Loader2, Play } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '@/stores/chat-store';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if this is an image response
  const isImageResponse = message.content.includes('🎨 **Imagen Generada**');

  // Check if this is a video response
  const isVideoResponse = message.content.includes('🎬 **Video Generado**');

  // Check if there are search results
  const hasSearchResults = message.searchResults && message.searchResults.length > 0;

  // Check video status
  const isVideoProcessing = message.videoStatus === 'processing';
  const hasVideo = message.videoUrl && message.videoStatus === 'success';

  return (
    <div
      className={cn(
        "message-bubble flex gap-3 px-4 py-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
          isVideoResponse || isVideoProcessing
            ? "bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 shadow-pink-500/30"
            : isImageResponse
              ? "bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-pink-500/30"
              : "bg-gradient-to-br from-purple-500 to-cyan-500 shadow-purple-500/30"
        )}>
          {(isVideoResponse || isVideoProcessing) ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      )}

      <div className={cn("max-w-[85%] space-y-2", isUser && "flex flex-col items-end")}>
        {/* User image preview */}
        {isUser && message.image && (
          <div className="mb-2">
            <img 
              src={message.image} 
              alt="Uploaded" 
              className="max-h-48 rounded-xl border border-purple-500/20"
            />
          </div>
        )}
        
        {/* Main message bubble */}
        <div
          className={cn(
            "rounded-3xl px-4 py-3 relative",
            isUser
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-lg shadow-lg shadow-purple-500/20"
              : "bg-secondary/80 backdrop-blur-sm text-foreground rounded-bl-lg border border-purple-500/10"
          )}
        >
          <div className="text-sm leading-relaxed prose-message">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            {isTyping && <span className="typing-cursor ml-1" />}
          </div>
          
          {/* Timestamp and copy button */}
          <div className={cn(
            "flex items-center gap-2 mt-2",
            isUser ? "justify-end" : "justify-between"
          )}>
            <span className={cn(
              "text-xs",
              isUser ? "text-white/60" : "text-muted-foreground"
            )}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {!isUser && (
              <button
                onClick={copyToClipboard}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-cyan-400"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Search results section */}
        {!isUser && hasSearchResults && showSearchResults && (
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Search className="w-3 h-3" />
                <span>Resultados de búsqueda</span>
              </div>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Ocultar
              </button>
            </div>
            <div className="space-y-2">
              {message.searchResults?.slice(0, 3).map((result, i) => (
                <a
                  key={i}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/search"
                >
                  <div className="text-sm font-medium text-foreground group-hover/search:text-cyan-400 transition-colors flex items-center gap-1">
                    {result.title}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/search:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {result.snippet}
                  </div>
                  <div className="text-xs text-cyan-400/60 mt-1">
                    {result.domain}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Video processing indicator */}
        {!isUser && isVideoProcessing && (
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-pink-400">Generando video...</p>
                <p className="text-xs text-muted-foreground">Esto puede tomar unos minutos</p>
              </div>
            </div>
          </div>
        )}

        {/* Video display section */}
        {!isUser && hasVideo && message.videoUrl && (
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-3 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-pink-400">Video generado</span>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={message.videoUrl}
                controls
                className="w-full max-h-64 object-contain"
                preload="metadata"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <a
              href={message.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Play className="w-3 h-3" />
              Abrir video en nueva pestaña
            </a>
          </div>
        )}

        {/* Video error indicator */}
        {!isUser && message.videoStatus === 'error' && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mt-2">
            <div className="flex items-center gap-2 text-xs text-red-400">
              <Video className="w-3 h-3" />
              <span>Error al generar el video. Por favor intenta de nuevo.</span>
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center border border-purple-500/20">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
