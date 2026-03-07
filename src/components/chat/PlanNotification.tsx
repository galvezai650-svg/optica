'use client';

import { useState } from 'react';
import { useChatStore, Plan } from '@/stores/chat-store';
import { Crown, Rocket, X, Sparkles, Check } from 'lucide-react';
import { useEffect } from 'react';

const PLAN_INFO = {
  PRO: {
    icon: Crown,
    title: '¡Bienvenido a PRO!',
    description: 'Ahora tienes acceso a chats ilimitados y 10 imágenes por día.',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/30',
    benefits: [
      'Chats ilimitados',
      '10 imágenes por día',
      'Mejor modelo',
      'Historial de chats',
    ],
  },
  ULTRA: {
    icon: Rocket,
    title: '¡Bienvenido a ULTRA!',
    description: 'Tienes acceso total: chats ilimitados, imágenes ilimitadas y modelo avanzado.',
    color: 'from-purple-500 via-pink-500 to-orange-500',
    bgColor: 'from-purple-500/10 via-pink-500/10 to-orange-500/10',
    borderColor: 'border-purple-500/30',
    benefits: [
      'Chats ilimitados',
      'Imágenes ilimitadas',
      'Modelo más avanzado',
      'Prioridad en servidores',
      'Nuevas funciones primero',
    ],
  },
};

export function PlanNotification() {
  const { planUpgradeNotification, clearPlanUpgradeNotification } = useChatStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use a separate effect to handle visibility changes
  useEffect(() => {
    if (planUpgradeNotification && (planUpgradeNotification === 'PRO' || planUpgradeNotification === 'ULTRA')) {
      // Show the notification
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 50);
      }, 100);
      
      return () => clearTimeout(showTimer);
    }
  }, [planUpgradeNotification]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      clearPlanUpgradeNotification();
    }, 300);
  };

  if (!isVisible || !planUpgradeNotification) return null;

  const plan = PLAN_INFO[planUpgradeNotification as keyof typeof PLAN_INFO];
  if (!plan) return null;

  const Icon = plan.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={`relative max-w-md w-full bg-card border ${plan.borderColor} rounded-3xl p-8 shadow-2xl transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgColor} rounded-3xl`} />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon with animation */}
          <div className="relative mb-6">
            <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg animate-pulse`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-card animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
            {plan.title}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {plan.description}
          </p>

          {/* Benefits list */}
          <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
            {plan.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
          >
            <Sparkles className="w-4 h-4" />
            ¡Genial, gracias!
          </button>
        </div>

        {/* Close X button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
