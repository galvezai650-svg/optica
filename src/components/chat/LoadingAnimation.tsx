'use client';

import { Brain, Palette, Sparkles, Zap, Wand2 } from 'lucide-react';

interface LoadingAnimationProps {
  type: 'thinking' | 'creating-image';
}

export function LoadingAnimation({ type }: LoadingAnimationProps) {
  if (type === 'creating-image') {
    return (
      <div className="message-bubble flex gap-4 px-4 py-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/40 relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 animate-ping opacity-30" />
          <Wand2 className="w-5 h-5 text-white animate-spin relative z-10" style={{ animationDuration: '2s' }} />
        </div>
        <div className="bg-secondary/80 rounded-3xl rounded-bl-lg px-6 py-5 border border-pink-500/20 backdrop-blur-sm relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
          
          <div className="flex flex-col items-center gap-4 min-w-[220px] relative z-10">
            {/* Animated progress ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  className="animate-spin"
                  style={{ animationDuration: '2s' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Palette className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
            </div>
            
            {/* Loading Text with glow */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-base font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
                CREANDO IMAGEN
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            
            {/* Animated wave dots */}
            <div className="flex items-end gap-1.5 h-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-2 bg-gradient-to-t from-pink-500 to-cyan-500 rounded-full animate-pulse"
                  style={{
                    height: '100%',
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
            
            {/* Progress Steps */}
            <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Analizando
              </span>
              <span className="text-purple-400">→</span>
              <span className="flex items-center gap-1 animate-pulse" style={{ animationDelay: '300ms' }}>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Generando
              </span>
              <span className="text-cyan-400">→</span>
              <span className="flex items-center gap-1 animate-pulse" style={{ animationDelay: '600ms' }}>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                Optimizando
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced thinking animation
  return (
    <div className="message-bubble flex gap-4 px-4 py-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/40 relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 animate-ping opacity-20" />
        <Brain className="w-5 h-5 text-white animate-pulse relative z-10" />
      </div>
      <div className="bg-secondary/80 rounded-3xl rounded-bl-lg px-6 py-5 border border-purple-500/20 backdrop-blur-sm relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse" />
        
        <div className="flex flex-col items-center gap-4 min-w-[200px] relative z-10">
          {/* Animated brain waves */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          
          {/* Thinking Text */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-base font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
              PENSANDO
            </span>
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          
          {/* Animated dots wave */}
          <div className="flex items-center gap-2">
            {['purple', 'blue', 'cyan'].map((color, i) => (
              <span
                key={color}
                className={`w-3 h-3 bg-${color === 'purple' ? 'purple' : color === 'blue' ? 'blue' : 'cyan'}-500 rounded-full animate-bounce shadow-lg`}
                style={{
                  animationDelay: `${i * 150}ms`,
                  boxShadow: `0 0 10px ${color === 'purple' ? '#a855f7' : color === 'blue' ? '#3b82f6' : '#06b6d4'}`
                }}
              />
            ))}
          </div>
          
          {/* Processing hint */}
          <p className="text-xs text-muted-foreground animate-pulse">
            Procesando tu solicitud...
          </p>
        </div>
      </div>
    </div>
  );
}
