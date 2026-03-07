'use client';

import { Sparkles, Video, Instagram, TrendingUp, Film, Zap, Image as ImageIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  {
    icon: TrendingUp,
    text: "Give me 10 viral TikTok ideas",
    gradient: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/20",
  },
  {
    icon: Film,
    text: "Write a YouTube video script",
    gradient: "from-red-500 to-orange-500",
    glow: "shadow-orange-500/20",
  },
  {
    icon: Instagram,
    text: "Create Instagram captions",
    gradient: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/20",
  },
  {
    icon: Search,
    text: "Buscar tendencias de moda actuales",
    gradient: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: ImageIcon,
    text: "Analizar imagen y sugerir mejoras",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Video,
    text: "Generar video de una escena",
    gradient: "from-pink-500 to-orange-500",
    glow: "shadow-pink-500/20",
  },
  {
    icon: Sparkles,
    text: "Give trending content ideas",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
];

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => {
          const Icon = prompt.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(prompt.text)}
              className={cn(
                "group flex items-center gap-3 p-4 rounded-2xl",
                "bg-secondary/50 backdrop-blur-sm border border-purple-500/10",
                "hover:border-purple-500/30 hover:bg-secondary/70",
                "transition-all duration-300",
                "text-left",
                "hover:shadow-lg",
                prompt.glow
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br",
                prompt.gradient,
                "shadow-lg",
                "group-hover:scale-110 transition-transform duration-300"
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {prompt.text}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Electric accent line */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
        <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
      </div>
    </div>
  );
}
